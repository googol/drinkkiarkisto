import connect from './pg';
import Promise from 'bluebird';

class Drinks {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync("SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientId, ingredients.name as ingredientname, drinkIngredients.amount FROM drinks, drinkIngredients, ingredients WHERE drinkIngredients.drink = drinks.id AND drinkIngredients.ingredient = ingredients.id")
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
}

export default Drinks;
