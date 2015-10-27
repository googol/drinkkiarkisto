'use strict';
require('babel/register');

var app = require('./server.js');

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function() {
  const port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});