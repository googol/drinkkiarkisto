import { usingConnect, usingConnectTransaction, sql } from './pg-helpers'
import Promise from 'bluebird';

function getIngredientAmount(dbRow) {
  return { id: dbRow.ingredientid, name: dbRow.ingredientname, amount: dbRow.amount };
}

function getInsertDrinkSql(drink) {
  return sql`INSERT INTO drinks (primaryName, preparation, type, accepted, writer) VALUES (${drink.primaryName}, ${drink.preparation}, ${drink.type}, 'true', 1) RETURNING id`;
}

function getInsertDrinkIngredientSql(drinkId, ingredient) {
  return sql`INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (${drinkId}, ${ingredient.id}, ${ingredient.amount})`;
}

export class DrinkRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return usingConnect(this.connectionString, function(client) {
      return client.queryAsync('SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientid, ingredients.name as ingredientname, drinkIngredients.amount, drinkTypes.name as type FROM drinks LEFT JOIN drinkTypes ON drinkTypes.id = drinks.type LEFT JOIN drinkIngredients ON drinkIngredients.drink = drinks.id LEFT JOIN ingredients ON drinkIngredients.ingredient = ingredients.id')
        .then(function(result) {
          const transformed = new Map();
          result.rows.forEach(function(currentRow) {
            if (!transformed.has(currentRow.id)) {
              transformed.set(currentRow.id, {
                id: currentRow.id,
                primaryName: currentRow.primaryname,
                preparation: currentRow.preparation,
                type: currentRow.type,
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
    return usingConnect(this.connectionString, function(client) {
      return client.queryAsync(sql`SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientid, ingredients.name as ingredientname, drinkIngredients.amount, drinktypes.name as type FROM drinks LEFT JOIN drinkTypes ON drinkTypes.id = drinks.type LEFT JOIN drinkIngredients ON drinkIngredients.drink = drinks.id LEFT JOIN ingredients ON drinkIngredients.ingredient = ingredients.id WHERE drinks.id=${id}`)
        .then(result => result.rows.length === 0
          ? undefined
          : {
              id: result.rows[0].id,
              primaryName: result.rows[0].primaryname,
              preparation: result.rows[0].preparation,
              type: result.rows[0].type,
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

    return usingConnectTransaction(this.connectionString, function(client) {
      return client.queryAsync(getInsertDrinkSql(drink))
        .then(createResult => createResult.rows[0].id)
        .then(drinkId => Promise.all(ingredients.map(ingredient => client.queryAsync(getInsertDrinkIngredientSql(drinkId, ingredient))))
          .return(drinkId));
    });
  }

  deleteById(id) {
    return usingConnect(this.connectionString, function(client) {
      return client.queryAsync(sql`DELETE FROM drinks WHERE id=${id}`);
    });
  }
}
