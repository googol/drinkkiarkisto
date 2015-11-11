import { connect, sql } from './pg-helpers'
import Promise from 'bluebird';

export class DrinkRepository {
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
          if (result.rows.length === 0) {
            return undefined;
          }
          const combined = result.rows.reduce(function(acc, currentRow) {
            if (!acc.ingredients) {
              acc.ingredients = [];
            }
            acc.ingredients.push({ id: currentRow.ingredientId, name: currentRow.ingredientname, amount: currentRow.amount });

            return acc;
          });
          return {
            id: combined.id,
            primaryName: combined.primaryname,
            preparation: combined.preparation,
            ingredients: combined.ingredients
          };
        }, function(err) { return undefined; });
    });
  }
}
