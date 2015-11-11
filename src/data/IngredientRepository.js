import { connect, sql } from './pg-helpers'
import Promise from 'bluebird';

export class IngredientRepository {
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