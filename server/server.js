import express from 'express';
import fs from 'fs';
import { Drinks, Ingredients } from './data';

const app = express();
const publicPath = __dirname + '/public';
const connectionString = process.env.DATABASE_URL;

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  const drinks = new Drinks(connectionString);
  drinks.getAll().then(function(result) {
    res.render('index', { drinks: result });
  });
});

app.get('/drinks', function(req, res) {
  res.redirect('/');
});

app.route('/drinks/:drinkId')
  .get(function(req, res) {
    const isEditMode = req.query.edit !== undefined;

    const drinks = new Drinks(connectionString);
    drinks.findById(req.params.drinkId).then(function(result) {
      if (!result) {
        const err = new Error(`Could not find drink with id ${req.params.drinkId}`);
        err.statusCode = 404;
        throw err;
      }

      if (isEditMode) {
        const ingredients = new Ingredients(connectionString);
        return ingredients.getAllWithAmountsForDrink(req.params.drinkId).then(function(resultIngredients) { return [result, resultIngredients]; });
      } else {
        return [result, undefined];
      }
    })
    .spread(function(drink, ingredients) {
      const templateName = isEditMode ? 'editdrink' : 'drink';
      res.render(templateName, { drink: drink, ingredients: ingredients });
    })
    .catch(function(err) {
      res.status(err.statusCode || 500).send(err.toString());
    });
  })
  .post(function(req, res) {
    res.send('SAVED (not)');
  });

app.get('/register', function(req, res) {
  res.render('register');
});

app.route('/login')
  .get(function(req, res) {
    res.render('login');
  })
  .post(function(req, res) {
    res.redirect('/');
  });

app.route('/logout')
  .get(function(req, res) {
    res.render('logout');
  })
  .post(function(req, res) {
    res.redirect('/');
  });

app.get('/profile', function(req, res) {
  res.render('profile');
});

app.use('/', express.static(publicPath));

export default app;
