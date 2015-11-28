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
    const query = `SELECT
      ingredients.id,
      ingredients.name,
      COUNT(drinkIngredients.drink) as numberofusages
    FROM ingredients
    LEFT JOIN drinkIngredients
      ON ingredients.id=drinkIngredients.ingredient
    GROUP BY ingredients.id
    ORDER BY ingredients.id`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows.map(mapIngredient))
    );
  }

  getAllWithAmountsForDrink(drinkId) {
    const query = sql`SELECT
      ingredients.id,
      ingredients.name,
      drinkIngredients.amount
    FROM ingredients
    LEFT JOIN drinkIngredients
      ON
        ingredients.id = drinkIngredients.ingredient
        AND drinkIngredients.drink = ${drinkId}`;
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync(query)
        .then(function(result) {
          return result.rows;
        });
    });
  }

  addIngredient(name) {
    const query = sql`INSERT
    INTO ingredients
      (
        name,
        abv
      )
    VALUES
      (
        ${name},
        0
      )
    RETURNING id`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows[0].id));
  }

  deleteById(id) {
    const query = sql`DELETE
    FROM ingredients
    WHERE id=${id}`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query));
  }
}
