import express from 'express';
import fs from 'fs';
import bodyparser from 'body-parser'
import { DrinkRepository, IngredientRepository } from './data';
import { DrinksController } from './controllers'

const app = express();
const publicPath = __dirname + '/public';
const connectionString = process.env.DATABASE_URL;

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var urlencodedParser = bodyparser.urlencoded({ extended: false });

function getDrinksController() {
  const drinkRepository = new DrinkRepository(connectionString);
  const ingredientRepository = new IngredientRepository(connectionString);
  const drinksController = new DrinksController(drinkRepository, ingredientRepository);
  return drinksController;
}

const drinksController = getDrinksController();

app.route('/')
  .get((req, res) => drinksController.showList(res));

app.route('/drinks')
  .get((req, res) => req.query.new !== undefined
      ? drinksController.showNewEditor(res)
      : res.redirect('/'))
  .post(urlencodedParser, (req, res) => drinksController.addNew('', '', [], res));

app.route('/drinks/:drinkId')
  .get((req, res) => req.query.edit !== undefined
    ? drinksController.showSingleEditor(req.params.drinkId, res)
    : drinksController.showSingle(req.params.drinkId, res))
  .post(urlencodedParser, (req, res) => drinksController.updateSingle(0, '', '', [], res));

app.route('/register')
  .get((req, res) => res.render('register'));

app.route('/login')
  .get((req, res) => res.render('login'))
  .post((req, res) => res.redirect('/'));

app.route('/logout')
  .get((req, res) => res.render('logout'))
  .post((req, res) => res.redirect('/'));

app.route('/profile')
  .get((req, res) => res.render('profile'));

app.use('/', express.static(publicPath));

const server = app.listen(app.get('port'), function() {
  const port = server.address().port;

  console.log('Drinkkiarkisto listening at http://localhost:%s', port);
});
