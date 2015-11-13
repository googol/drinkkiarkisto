import pg from 'pg';
import Promise from 'bluebird';

Promise.promisifyAll(pg, { filter: function(methodName) { return methodName === 'connect'; }, multiArgs: true });
Promise.promisifyAll(pg);

/**
 * Connects to a postgres instance and returns a bluebird disposer to ensure disconnection.
 * Connection is taken from the standard pg connection pool.
 */
export function connect(connectionString) {
  var close;
  return pg.connectAsync(connectionString)
    .spread(function(client, done) {
      close = done;
      return client;
    })
    .disposer(function() {
      if (close) close();
    });
}

/**
 * Helper function that removes the need to call Promise.using every time a db connection is needed.
 * Use this for db connections if no other async resources are required.
 */
export function usingConnect(connectionString, handler) {
  return Promise.using(connect(connectionString), handler);
}

export function beginTransaction(client) {
  return client.queryAsync('BEGIN').return(client);
}

export function commitTransaction(client) {
  return client.queryAsync('COMMIT').return(client);
}

export function rollbackTransaction(client) {
  return client.queryAsync('ROLLBACK').return(client);
}

/**
 * Helper function to simplify the usage of transactions.
 * The handler function is executed inside a transaction.
 */
export function usingConnectTransaction(connectionString, handler) {
  return usingConnect(connectionString, function(client) {
    return beginTransaction(client)
      .then(handler)
      .then(res => commitTransaction(client).return(res), err => rollbackTransaction(client).throw(err));
  });
}

/**
 * This is a tag for es6 style string expansion literals, that creates a parametrised sql query for the pg module.
 * Use like this: pgClient.Query(sql`SELECT * FROM table WHERE x=${y}`)
 * Note that the quotes need to be backticks `` and no whitespace is allowed between the tag name (sql) and the backticks.
 */
export function sql(parts, ...values) {
  return {
    text: parts.reduce((previous, current, i) => previous + '$' + i + current),
    values
  };
}
