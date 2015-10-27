'use strict';
require('babel/register');

var app = require('./server.js');

const server = app.listen(3000, function() {
  const port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});
