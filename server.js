'use strict';

import express from 'express';
import { readdir } from 'fs';

const app = express();
const docPath = __dirname + '/doc';

app.get('/', function (req, res) {
  readdir(docPath, function(err, files) {
    let result = 'Drinkkiarkisto. ' + docPath + '\n';
    files.forEach(function(file) {
      result += file + '\n';
    });

    res.send(result);
  });
});

app.use('/doc', express.static(__dirname + '/doc'));

export default app;
