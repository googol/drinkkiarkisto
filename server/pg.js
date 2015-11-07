import pg from 'pg';
import Promise from 'bluebird';

Promise.promisifyAll(pg, { filter: function(methodName) { return methodName === 'connect'; }, multiArgs: true });
Promise.promisifyAll(pg);

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

export function sql(parts, ...values) {
  return {
    text: parts.reduce((previous, current, i) => previous + '$' + i + current),
    values
  };
}
