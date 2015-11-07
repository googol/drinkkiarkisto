import { connect } from './pg';
import Promise from 'bluebird';

class Ingredients {
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
}

export default Ingredients;
