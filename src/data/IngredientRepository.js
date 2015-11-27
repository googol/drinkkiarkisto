import { connect, usingConnect, sql } from './pg-helpers'
import Promise from 'bluebird'

export class IngredientRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync('SELECT id, name FROM ingredients')
        .then(function(result) {
          return result.rows;
        });
    });
  }

  getAllWithAmountsForDrink(drinkId) {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync(sql`SELECT ingredients.id, ingredients.name, drinkIngredients.amount FROM ingredients LEFT JOIN drinkIngredients ON ingredients.id = drinkIngredients.ingredient AND drinkIngredients.drink = ${drinkId}`)
        .then(function(result) {
          return result.rows;
        });
    });
  }

  addIngredient(name) {
    return usingConnect(this.connectionString, client =>
      client.queryAsync(sql`INSERT INTO ingredients (name, abv) VALUES (${name}, 0) RETURNING id`)
        .then(result => result.rows[0].id));
  }
}
