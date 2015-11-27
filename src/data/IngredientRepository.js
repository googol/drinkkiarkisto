import { connect, usingConnect, sql } from './pg-helpers'
import Promise from 'bluebird'

function mapIngredient(ingredient) {
  return { id: ingredient.id, name: ingredient.name, used: ingredient.numberofusages > 0 };
}

export class IngredientRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return usingConnect(this.connectionString, client =>
      client.queryAsync('SELECT ingredients.id, ingredients.name, COUNT(drinkIngredients.drink) as numberofusages FROM ingredients LEFT JOIN drinkIngredients ON ingredients.id=drinkIngredients.ingredient GROUP BY ingredients.id ORDER BY ingredients.id')
        .then(result => result.rows.map(mapIngredient))
    );
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

  deleteById(id) {
    return usingConnect(this.connectionString, client =>
      client.queryAsync(sql`DELETE FROM ingredients WHERE id=${id}`));
  }
}
