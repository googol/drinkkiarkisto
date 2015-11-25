import { connect, sql } from './pg-helpers'
import Promise from 'bluebird'

export class DrinkTypeRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    return Promise.using(connect(this.connectionString), function(client) {
      return client.queryAsync('SELECT id, name FROM drinkTypes')
        .then(function(result) {
          return result.rows;
        });
    });
  }
}
