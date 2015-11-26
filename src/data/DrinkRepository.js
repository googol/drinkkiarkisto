import { usingConnect, usingConnectTransaction, sql } from './pg-helpers'
import Promise from 'bluebird'

function getIngredientAmount(dbRow) {
  return { id: dbRow.ingredientid, name: dbRow.ingredientname, amount: dbRow.amount };
}

function getInsertDrinkSql(drink) {
  const accepted = drink.writer.isAdmin;
  return sql`INSERT INTO drinks (primaryName, preparation, type, accepted, writer) VALUES (${drink.primaryName}, ${drink.preparation}, ${drink.type.id}, ${accepted}, ${drink.writer.id}) RETURNING id`;
}

function insertIngredientsForDrink(client, drinkId, ingredients) {
  return Promise.all(ingredients.map(ingredient =>
    client.queryAsync(sql`INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (${drinkId}, ${ingredient.id}, ${ingredient.amount})`)));
}

function insertAdditionalNamesForDrink(client, drinkId, additionalNames) {
  return Promise.all(additionalNames.map(additionalName =>
    client.queryAsync(sql`INSERT INTO additionalDrinkNames (drink, name) VALUES (${drinkId}, ${additionalName})`)));
}

export class DrinkRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return usingConnect(this.connectionString, client =>
      Promise.join(
        client.queryAsync('SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientid, ingredients.name as ingredientname, drinkIngredients.amount, drinkTypes.id as typeid, drinkTypes.name as typename, drinkTypes.description as typedescription, users.id as writerid, users.email as writeremail, users.active as writeractive FROM drinks LEFT JOIN users ON drinks.writer = users.id LEFT JOIN drinkTypes ON drinkTypes.id = drinks.type LEFT JOIN drinkIngredients ON drinkIngredients.drink = drinks.id LEFT JOIN ingredients ON drinkIngredients.ingredient = ingredients.id'),
        client.queryAsync('SELECT drinks.id, additionalDrinkNames.name FROM drinks, additionalDrinkNames WHERE drinks.id = additionalDrinkNames.drink'),
        function(result, additionalDrinkNames) {
          const transformed = new Map();
          result.rows.forEach(function(currentRow) {
            if (!transformed.has(currentRow.id)) {
              transformed.set(currentRow.id, {
                id: currentRow.id,
                primaryName: currentRow.primaryname,
                preparation: currentRow.preparation,
                type: { id: currentRow.typeid, name: currentRow.typename, description: currentRow.typedescription },
                additionalNames: additionalDrinkNames.rows.filter(drinkName => drinkName.id === currentRow.id).map(drinkName => drinkName.name),
                writer: { id: currentRow.writerid, email: currentRow.writeremail, active: currentRow.writeractive },
                ingredients: []
              });
            }
            const current = transformed.get(currentRow.id);

            if (currentRow.ingredientid) {
              current.ingredients.push(getIngredientAmount(currentRow));
            }
          });
          return Array.from(transformed.values());
        }));
  }

  findById(id) {
    return usingConnect(this.connectionString, client =>
      Promise.join(
        client.queryAsync(sql`SELECT drinks.id, drinks.primaryName, drinks.preparation, ingredients.id as ingredientid, ingredients.name as ingredientname, drinkIngredients.amount, drinkTypes.id as typeid, drinktypes.name as typename, drinkTypes.description as typedescription, users.id as writerid, users.email as writeremail, users.active as writeractive FROM drinks LEFT JOIN users ON drinks.writer = users.id LEFT JOIN drinkTypes ON drinkTypes.id = drinks.type LEFT JOIN drinkIngredients ON drinkIngredients.drink = drinks.id LEFT JOIN ingredients ON drinkIngredients.ingredient = ingredients.id WHERE drinks.id=${id}`),
        client.queryAsync(sql`SELECT name FROM additionalDrinkNames WHERE drink=${id}`),
        (result, additionalNames) => result.rows.length === 0
          ? undefined
          : {
              id: result.rows[0].id,
              primaryName: result.rows[0].primaryname,
              preparation: result.rows[0].preparation,
              type: { id: result.rows[0].typeid, name: result.rows[0].typename, description: result.rows[0].typedescription },
              additionalNames: additionalNames.rows.map(drinkName => drinkName.name),
              writer: { id: result.rows[0].writerid, email: result.rows[0].writeremail, active: result.rows[0].writeractive },
              ingredients: result.rows[0].ingredientid && result.rows.map(row => getIngredientAmount(row)) || []
            })
        .catch(err => undefined));
  }

  addDrink(drink) {
    if (!drink.primaryName) {
      return Promise.reject(new Error('The primary name of the drink is required.'));
    } else if(!drink.preparation) {
      return Promise.reject(new Error('The preparation instruction for the drink is required.'));
    }
    const ingredients = drink.ingredients || [];
    const additionalNames = drink.additionalNames || [];

    return usingConnectTransaction(this.connectionString, function(client) {
      return client.queryAsync(getInsertDrinkSql(drink))
        .then(createResult => createResult.rows[0].id)
        .then(drinkId => Promise.join(
          insertIngredientsForDrink(client, drinkId, ingredients),
          insertAdditionalNamesForDrink(client, drinkId, additionalNames),
          () => drinkId));
    });
  }

  deleteById(id) {
    return usingConnect(this.connectionString, function(client) {
      return client.queryAsync(sql`DELETE FROM drinks WHERE id=${id}`);
    });
  }

  updateById(id, drink) {
    if (!drink.primaryName) {
      return Promise.reject(new Error('The primary name of the drink is required.'));
    } else if(!drink.preparation) {
      return Promise.reject(new Error('The preparation instruction for the drink is required.'));
    }
    const ingredients = drink.ingredients || [];
    const additionalNames = drink.additionalNames || [];

    return usingConnectTransaction(this.connectionString, client =>
      client.queryAsync(sql`UPDATE drinks SET primaryName=${drink.primaryName}, preparation=${drink.preparation}, type=${drink.type.id} WHERE id=${id}`)
        .then(() => Promise.join(
          client.queryAsync(sql`DELETE FROM drinkIngredients WHERE drink=${id}`),
          client.queryAsync(sql`DELETE FROM additionalDrinkNames WHERE drink=${id}`)))
        .then(() => Promise.join(
          insertIngredientsForDrink(client, id, ingredients),
          insertAdditionalNamesForDrink(client, id, additionalNames)))
        .return(id));
  }
}
