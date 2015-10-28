'use strict';

import express from 'express';

const app = express();
const docPath = __dirname + '/doc';

app.get('/', function (req, res) {
  res.send('Drinkkiarkisto. Dokumentaatio: doc/documentation.pdf');
});

app.use('/doc', express.static(docPath));

export default app;
