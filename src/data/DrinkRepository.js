import { usingConnect, usingConnectTransaction, sql } from './pg-helpers'
import Promise from 'bluebird'

function getIngredientAmount(dbRow) {
  return { id: dbRow.ingredientid, name: dbRow.ingredientname, amount: dbRow.amount };
}

function getInsertDrinkSql(drink) {
  const accepted = drink.writer.isAdmin;
  return sql`INSERT
  INTO drinks
    (
      primaryName,
      preparation,
      type,
      accepted,
      writer
    )
  VALUES
    (
      ${drink.primaryName},
      ${drink.preparation},
      ${drink.type.id},
      ${accepted},
      ${drink.writer.id}
    )
  RETURNING id`;
}

function insertIngredientsForDrink(client, drinkId, ingredients) {
  const query = sql`INSERT
  INTO drinkIngredients
    (
      drink,
      ingredient,
      amount
    )
  VALUES
    (
      ${drinkId},
      ${ingredient.id},
      ${ingredient.amount}
    )`;
  return Promise.all(ingredients.map(ingredient =>
    client.queryAsync(query)));
}

function insertAdditionalNamesForDrink(client, drinkId, additionalNames) {
  const query = sql`INSERT
  INTO additionalDrinkNames
    (
      drink,
      name
    )
  VALUES
    (
      ${drinkId},
      ${additionalName}
    )`;
  return Promise.all(additionalNames.map(additionalName =>
    client.queryAsync(query)));
}

export class DrinkRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll(query) {
    query = '%'+query+'%';
    const idsQuery = sql`SELECT DISTINCT drinks.id
    FROM drinks
    LEFT JOIN drinkIngredients
      ON drinks.id=drinkIngredients.drink
    LEFT JOIN ingredients
      ON drinkIngredients.ingredient=ingredients.id
    LEFT JOIN additionalDrinkNames
      ON drinks.id=additionalDrinkNames.drink
    WHERE
      drinks.primaryName ILIKE ${query}
      OR additionalDrinkNames.name ILIKE ${query}
      OR ingredients.name ILIKE ${query}`;
    return this.getMany(idsQuery);
  }

  getAllAccepted(query) {
    query = '%'+query+'%';
    const idsQuery = sql`SELECT DISTINCT drinks.id
    FROM drinks
    LEFT JOIN drinkIngredients
      ON drinks.id=drinkIngredients.drink
    LEFT JOIN ingredients
      ON drinkIngredients.ingredient=ingredients.id
    LEFT JOIN additionalDrinkNames
      ON drinks.id=additionalDrinkNames.drink
    WHERE
      drinks.accepted='true'
      AND (
        drinks.primaryName ILIKE ${query}
        OR additionalDrinkNames.name ILIKE ${query}
        OR ingredients.name ILIKE ${query}
      )`;
    return this.getMany(idsQuery);
  }

  getAllAcceptedOrWrittenByUser(query, userId) {
    query = '%'+query+'%';
    const idsQuery = sql`SELECT DISTINCT drinks.id
    FROM drinks
    LEFT JOIN drinkIngredients
      ON drinks.id=drinkIngredients.drink
    LEFT JOIN ingredients
      ON drinkIngredients.ingredient=ingredients.id
    LEFT JOIN additionalDrinkNames
      ON drinks.id=additionalDrinkNames.drink
    WHERE
      (
        drinks.accepted='true'
        OR drinks.writer=${userId}
      ) AND (
        drinks.primaryName ILIKE ${query}
        OR additionalDrinkNames.name ILIKE ${query}
        OR ingredients.name ILIKE ${query}
      )`;
    return this.getMany(idsQuery);
  }

  getMany(idsQuery) {
    const selectDrinks = {
      text:
    `SELECT
      drinks.id,
      drinks.primaryName,
      drinks.preparation,
      drinks.accepted,
      ingredients.id as ingredientid,
      ingredients.name as ingredientname,
      drinkIngredients.amount,
      drinkTypes.id as typeid,
      drinkTypes.name as typename,
      users.id as writerid,
      users.email as writeremail,
      users.active as writeractive
    FROM drinks
    LEFT JOIN users
      ON drinks.writer = users.id
    LEFT JOIN drinkTypes
      ON drinkTypes.id = drinks.type
    LEFT JOIN drinkIngredients
      ON drinkIngredients.drink = drinks.id
    LEFT JOIN ingredients
      ON drinkIngredients.ingredient = ingredients.id
    WHERE
      drinks.id IN (${idsQuery.text})`,
      values: idsQuery.values
    };
    const selectAdditionalDrinkNames = {
      text:
    `SELECT
      drinks.id,
      additionalDrinkNames.name
    FROM
      drinks,
      additionalDrinkNames
    WHERE
      drinks.id = additionalDrinkNames.drink
      AND drinks.id IN (${idsQuery.text})`,
      values: idsQuery.values
    };

    return usingConnect(this.connectionString, client =>
      Promise.join(
        client.queryAsync(selectDrinks),
        client.queryAsync(selectAdditionalDrinkNames),
        function(result, additionalDrinkNames) {
          const transformed = new Map();
          result.rows.forEach(function(currentRow) {
            if (!transformed.has(currentRow.id)) {
              transformed.set(currentRow.id, {
                id: currentRow.id,
                primaryName: currentRow.primaryname,
                preparation: currentRow.preparation,
                type: { id: currentRow.typeid, name: currentRow.typename },
                additionalNames: additionalDrinkNames.rows.filter(drinkName => drinkName.id === currentRow.id).map(drinkName => drinkName.name),
                writer: { id: currentRow.writerid, email: currentRow.writeremail, active: currentRow.writeractive },
                accepted: currentRow.accepted,
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
    const selectDrink = sql`SELECT
      drinks.id,
      drinks.primaryName,
      drinks.preparation,
      drinks.accepted,
      ingredients.id as ingredientid,
      ingredients.name as ingredientname,
      drinkIngredients.amount,
      drinkTypes.id as typeid,
      drinktypes.name as typename,
      users.id as writerid,
      users.email as writeremail,
      users.active as writeractive
    FROM drinks
    LEFT JOIN users
      ON drinks.writer = users.id
    LEFT JOIN drinkTypes
      ON drinkTypes.id = drinks.type
    LEFT JOIN drinkIngredients
      ON drinkIngredients.drink = drinks.id
    LEFT JOIN ingredients
      ON drinkIngredients.ingredient = ingredients.id
    WHERE drinks.id=${id}`;
    const selectAdditionalDrinkNames = sql`SELECT
      name
    FROM additionalDrinkNames
    WHERE drink=${id}`;
    return usingConnect(this.connectionString, client =>
      Promise.join(
        client.queryAsync(selectDrink),
        client.queryAsync(selectAdditionalDrinkNames),
        (result, additionalNames) => result.rows.length === 0
          ? undefined
          : {
              id: result.rows[0].id,
              primaryName: result.rows[0].primaryname,
              preparation: result.rows[0].preparation,
              type: { id: result.rows[0].typeid, name: result.rows[0].typename },
              additionalNames: additionalNames.rows.map(drinkName => drinkName.name),
              writer: { id: result.rows[0].writerid, email: result.rows[0].writeremail, active: result.rows[0].writeractive },
              accepted: result.rows[0].accepted,
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
    const query = sql`DELETE
    FROM drinks
    WHERE id=${id}`;
    return usingConnect(this.connectionString, function(client) {
      return client.queryAsync(query);
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

    const updateQuery = sql`UPDATE
      drinks
    SET
      primaryName=${drink.primaryName},
      preparation=${drink.preparation},
      type=${drink.type.id}
    WHERE id=${id}`;
    const deleteDrinkIngredients = sql`DELETE
    FROM drinkIngredients
    WHERE drink=${id}`;
    const deleteAdditionalDrinkNames = sql`DELETE
    FROM additionalDrinkNames
    WHERE drink=${id}`;

    return usingConnectTransaction(this.connectionString, client =>
      client.queryAsync(updateQuery)
        .then(() => Promise.join(
          client.queryAsync(deleteDrinkIngredients),
          client.queryAsync(deleteAdditionalDrinkNames)))
        .then(() => Promise.join(
          insertIngredientsForDrink(client, id, ingredients),
          insertAdditionalNamesForDrink(client, id, additionalNames)))
        .return(id));
  }

  acceptById(id) {
    const query = sql`UPDATE
      drinks
    SET
      accepted='true'
    WHERE id=${id}`;
    return usingConnect(this.connectionString, client =>
      client.queryAsync(query));
  }
}
