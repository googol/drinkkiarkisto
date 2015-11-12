import express from 'express';
import fs from 'fs';
import { DrinkRepository, IngredientRepository } from './data';
import { DrinksController } from './controllers'

const app = express();
const publicPath = __dirname + '/public';
const connectionString = process.env.DATABASE_URL;

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

function getDrinksController() {
  const drinkRepository = new DrinkRepository(connectionString);
  const ingredientRepository = new IngredientRepository(connectionString);
  const drinksController = new DrinksController(drinkRepository, ingredientRepository);
  return drinksController;
}

app.get('/', function(req, res) {
  const drinksController = getDrinksController();
  drinksController.showList(res);
});

app.route('/drinks')
  .get(function(req, res) {
    const isNewDrinkMode = req.query.new !== undefined;

    if (isNewDrinkMode) {
      const drinksController = getDrinksController();
      drinksController.showNewEditor(res);
    } else {
      res.redirect('/');
    }
  })
  .post(function(req, res) {
    const drinksController = getDrinksController();
    drinksController.addNew('', '', [], res);
  });

app.route('/drinks/:drinkId')
  .get(function(req, res) {
    const isEditMode = req.query.edit !== undefined;
    const drinkId = req.params.drinkId;
    const drinksController = getDrinksController();

    if (isEditMode) {
      drinksController.showSingleEditor(drinkId, res);
    } else {
      drinksController.showSingle(drinkId, res);
    }
  })
  .post(function(req, res) {
    const drinksController = getDrinksController();
    drinksController.updateSingle(0, '', '', [], res);
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
