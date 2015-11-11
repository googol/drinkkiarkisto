'use strict';
require('babel-core/register');

var app = require('./src/server.js').default;

const server = app.listen(app.get('port'), function() {
  const port = server.address().port;

  console.log('Drinkkiarkisto listening at http://localhost:%s', port);
});
