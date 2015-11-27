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
    return usingConnect(this.connectionString, client =>
      client.queryAsync('SELECT drinkTypes.id, drinkTypes.name, COUNT(drinks.id) as numberofuses FROM drinkTypes LEFT JOIN drinks on drinks.type=drinkTypes.id GROUP BY drinkTypes.id ORDER BY drinkTypes.id')
        .then(result => result.rows.map(mapDrinkTypes)));
  }

  addDrinkType(name) {
    return usingConnect(this.connectionString, client =>
      client.queryAsync(sql`INSERT INTO drinkTypes (name, description) VALUES (${name}, '') RETURNING id`)
        .then(result => result.rows[0].id));
  }

  deleteById(id) {
    return usingConnect(this.connectionString, client =>
      client.queryAsync(sql`DELETE FROM drinkTypes WHERE id=${id}`));
  }
}
