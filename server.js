'use strict';

import express from 'express';

const app = express();
const publicPath = __dirname + '/public';

app.get('/', function (req, res) {
  res.send('Drinkkiarkisto. Dokumentaatio: doc/documentation.pdf');
});

app.use('/', express.static(publicPath));

export default app;
