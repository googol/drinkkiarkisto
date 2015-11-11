import pg from 'pg';
import Promise from 'bluebird';

Promise.promisifyAll(pg, { filter: function(methodName) { return methodName === 'connect'; }, multiArgs: true });
Promise.promisifyAll(pg);

/**
 * Connects to a postgres instance and returns a bluebird disposer to ensure disconnection.
 * Connection is taken from the standard pg connection pool.
 */
function connect(connectionString) {
  var close;
  return pg.connectAsync(connectionString)
    .spread(function(client, done) {
      close = done;
      return client;
    })
    .disposer(function() {
      if (close) close();
    });
}

/**
 * This is a tag for es6 style string expansion literals, that creates a parametrised sql query for the pg module.
 * Use like this: pgClient.Query(sql`SELECT * FROM table WHERE x=${y}`)
 * Note that the quotes need to be backticks `` and no whitespace is allowed between the tag name (sql) and the backticks.
 */
function sql(parts, ...values) {
  return {
    text: parts.reduce((previous, current, i) => previous + '$' + i + current),
    values
  };
}

export class Drinks {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync('SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientId, ingredients.name as ingredientname, drinkIngredients.amount FROM drinks, drinkIngredients, ingredients WHERE drinkIngredients.drink = drinks.id AND drinkIngredients.ingredient = ingredients.id')
        .then(function(result) {
          const transformed = result.rows.reduce(function(acc, currentRow) {
            if (!acc.has(currentRow.id)) {
              acc.set(currentRow.id, {
                id: currentRow.id,
                primaryName: currentRow.primaryname,
                preparation: currentRow.preparation,
                ingredients: []
              });
            }
            const current = acc.get(currentRow.id);

            current.ingredients.push({ id: currentRow.ingredientId, name: currentRow.ingredientname, amount: currentRow.amount });

            return acc;
          }, new Map());
          return Array.from(transformed.values());
        });
    });
  }

  findById(id) {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync(sql`SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientId, ingredients.name as ingredientname, drinkIngredients.amount FROM drinks, drinkIngredients, ingredients WHERE drinkIngredients.drink = drinks.id AND drinkIngredients.ingredient = ingredients.id AND drinks.id=${id}`)
        .then(function(result) {
          return result.rows.length > 0
            ? result.rows.reduce(function(acc, currentRow) {
              if (!acc) {
                acc = {
                  id: currentRow.id,
                  primaryName: currentRow.primaryname,
                  preparation: currentRow.preparation,
                  ingredients: []
                };
              }
              acc.ingredients.push({ id: currentRow.ingredientId, name: currentRow.ingredientname, amount: currentRow.amount });

              return acc;
            }, false)
          : undefined;
        }, function(err) { return undefined; });
    });
  }
}

export class Ingredients {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAllWithAmountsForDrink(drinkId) {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync(sql`SELECT ingredients.id, ingredients.name, drinkIngredients.amount FROM ingredients LEFT JOIN drinkIngredients ON ingredients.id = drinkIngredients.ingredient AND drinkIngredients.drink = ${drinkId}`)
        .then(function(result) {
          return result.rows;
        });
    });
  }
}
