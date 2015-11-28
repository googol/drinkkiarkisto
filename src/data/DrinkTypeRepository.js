import { usingConnect, sql } from './pg-helpers'
import Promise from 'bluebird'

function mapDrinkTypes(drinkType) {
  return { id: drinkType.id, name: drinkType.name, used: drinkType.numberofuses > 0 };
}

export class DrinkTypeRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    const query = `SELECT
      drinkTypes.id,
      drinkTypes.name,
      COUNT(drinks.id) as numberofuses
    FROM drinkTypes
    LEFT JOIN drinks
      ON drinks.type=drinkTypes.id
    GROUP BY drinkTypes.id
    ORDER BY drinkTypes.id`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows.map(mapDrinkTypes)));
  }

  addDrinkType(name) {
    const query = sql`INSERT
    INTO drinkTypes
      (
        name
      )
    VALUES
      (
        ${name}
      )
    RETURNING id`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows[0].id));
  }

  deleteById(id) {
    const query = sql`DELETE
    FROM drinkTypes
    WHERE id=${id}`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query));
  }
}
