import { connect, sql, beginTransaction, rollbackTransaction, commitTransaction } from './pg-helpers'
import Promise from 'bluebird';

function getIngredientAmount(dbRow) {
  return { id: dbRow.ingredientid, name: dbRow.ingredientname, amount: dbRow.amount };
}

export class DrinkRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync('SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientid, ingredients.name as ingredientname, drinkIngredients.amount FROM drinks LEFT JOIN drinkIngredients ON drinkIngredients.drink = drinks.id LEFT JOIN ingredients ON drinkIngredients.ingredient = ingredients.id')
        .then(function(result) {
          const transformed = new Map();
          result.rows.forEach(function(currentRow) {
            if (!transformed.has(currentRow.id)) {
              transformed.set(currentRow.id, {
                id: currentRow.id,
                primaryName: currentRow.primaryname,
                preparation: currentRow.preparation,
                ingredients: []
              });
            }
            const current = transformed.get(currentRow.id);

            if (currentRow.ingredientid) {
              current.ingredients.push(getIngredientAmount(currentRow));
            }
          });
          return Array.from(transformed.values());
        });
    });
  }

  findById(id) {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync(sql`SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientid, ingredients.name as ingredientname, drinkIngredients.amount FROM drinks LEFT JOIN drinkIngredients ON drinkIngredients.drink = drinks.id LEFT JOIN ingredients ON drinkIngredients.ingredient = ingredients.id WHERE drinks.id=${id}`)
        .then(result => result.rows.length === 0
          ? undefined
          : {
              id: result.rows[0].id,
              primaryName: result.rows[0].primaryname,
              preparation: result.rows[0].preparation,
              ingredients: result.rows[0].ingredientid && result.rows.map(row => getIngredientAmount(row)) || []
            },
          err => undefined);
    });
  }

  addDrink(drink) {
    if (!drink.primaryName) {
      return Promise.reject(new Error('The primary name of the drink is required.'));
    } else if(!drink.preparation) {
      return Promise.reject(new Error('The preparation instruction for the drink is required.'));
    }
    const ingredients = drink.ingredients || [];

    return Promise.using(connect(this.connectionString), function(client) {
      return beginTransaction(client)
        .then(function() {
          return client.queryAsync(sql`INSERT INTO drinks (primaryName, preparation, type, accepted, writer) VALUES (${drink.primaryName}, ${drink.preparation}, 1, 'true', 1) RETURNING id`)
            .then(function(createResult) {
              const drinkId = createResult.rows[0].id;

              return Promise.all(ingredients.map(function(ingredient) { return client.queryAsync(sql`INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (${drinkId}, ${ingredient.id}, ${ingredient.amount})`); }));
            });
        })
        .then(function(res) { return commitTransaction(client).return(res); }, 
              function(err) { return rollbackTransaction(client).throw(err); });
    });
  }
}
