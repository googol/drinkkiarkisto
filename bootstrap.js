'use strict';

// Requiring babel-core/register will modify the require function so that subsequent requires will be compiled with babel.
// This is required because other files are written in es6 syntax, which is not fully supported natively by node.
// https://babeljs.io/docs/setup/#babel_register
require('babel-core/register');

// Requiring the server main file will execute it, starting the server
require('./src/server.js');
