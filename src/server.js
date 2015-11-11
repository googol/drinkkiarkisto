import express from 'express';
import fs from 'fs';
import { DrinkRepository, IngredientRepository } from './data';

const app = express();
const publicPath = __dirname + '/public';
const connectionString = process.env.DATABASE_URL;

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  const drinkRepository = new DrinkRepository(connectionString);
  drinkRepository.getAll().then(function(result) {
    res.render('index', { drinks: result });
  });
});

app.get('/drinks', function(req, res) {
  res.redirect('/');
});

app.route('/drinks/:drinkId')
  .get(function(req, res) {
    const isEditMode = req.query.edit !== undefined;

    const drinkRepository = new DrinkRepository(connectionString);
    drinkRepository.findById(req.params.drinkId).then(function(drink) {
      if (!drink) {
        const err = new Error(`Could not find drink with id ${req.params.drinkId}`);
        err.statusCode = 404;
        throw err;
      }

      if (!isEditMode) {
        return res.render('drink', { drink: drink });
      }

      const ingredientRepository = new IngredientRepository(connectionString);
      return ingredientRepository.getAllWithAmountsForDrink(req.params.drinkId)
        .then(function(resultIngredients) {
          res.render('editdrink', { drink: drink, ingredients: resultIngredients });
        });
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

const server = app.listen(app.get('port'), function() {
  const port = server.address().port;

  console.log('Drinkkiarkisto listening at http://localhost:%s', port);
});
