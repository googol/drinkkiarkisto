'use strict';

import express from 'express';

const app = express();

app.get('/', function (req, res) {
  res.send('Drinkkiarkisto.');
});

app.use('/doc', express.static(__dirname + '/doc'));

export default app;
