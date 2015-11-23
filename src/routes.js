import express from 'express';
import bodyparser from 'body-parser'
import passport from 'passport'
import { DrinkRepository, DrinkTypeRepository, IngredientRepository } from './data';
import { DrinksController, ProfileController } from './controllers'

const urlencodedParser = bodyparser.urlencoded({ extended: false });

function getIngredientAmounts(body) {
  return Object.keys(body)
    .map(key => { const match = key.match(/ingredient-(\d+)-amount/); return match && { id: match[1], amount: body[match[0]] } || undefined })
    .filter(value => value && value.amount);
}

function getDrinkFromRequestBody(body) {
  return {
    primaryName: body.drinkName,
    preparation: body.drinkPreparation,
    ingredients: getIngredientAmounts(body),
    type: body.drinkType
  };
}

function requireUser(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.sendStatus(401);
  }
}

function requireUserOrLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'Pyytämäsi sivu vaatii sisäänkirjautumisen');
    req.flash('redirect', req.originalUrl);
    res.redirect('/login');
  }
}

function requireAdminOrLogin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    req.flash('error', 'Pyytämäsi sivu vaatii ylläpitäjän oikeudet.');
    req.flash('redirect', req.originalUrl);
    res.redirect('/login');
  }
}

export function configureRoutes(app, connectionString) {
  const drinkRepository = new DrinkRepository(connectionString);
  const drinkTypeRepository = new DrinkTypeRepository(connectionString);
  const ingredientRepository = new IngredientRepository(connectionString);

  const drinksController = new DrinksController(drinkRepository, drinkTypeRepository, ingredientRepository);
  const profileController = new ProfileController(passport);

  app.route('/')
    .get((req, res) => drinksController.showList(res, req.user));

  app.route('/drinks')
    .get((req, res) => req.query.new !== undefined
        ? requireUserOrLogin(req, res, () => drinksController.showNewEditor(res, req.user))
        : res.redirect('/'))
    .post(requireUser, urlencodedParser, (req, res) => drinksController.addNew(getDrinkFromRequestBody(req.body), res));

  app.route('/drinks/:drinkId')
    .get((req, res) => req.query.edit !== undefined
      ? requireAdminOrLogin(req, res, () => drinksController.showSingleEditor(req.params.drinkId, res, req.user))
      : drinksController.showSingle(req.params.drinkId, res, req.user))
    .put(requireAdmin, urlencodedParser, (req, res) => drinksController.updateSingle(req.params.drinkId, getDrinkFromRequestBody(req.body), res))
    .delete(requireAdmin, (req, res) => drinksController.deleteSingle(req.params.drinkId, res));

  app.route('/register')
    .get((req, res) => profileController.showRegistrationPage(res));

  app.route('/login')
    .get((req, res) => profileController.showLoginPage(req, res))
    .post(urlencodedParser, (req, res, next) => profileController.login(req, res, next));

  app.route('/logout')
    .post((req, res) => profileController.logout(req, res));

  app.route('/profile')
    .get(requireUserOrLogin, (req, res) => profileController.showProfilePage(req.user, res));

  app.use('/', express.static(__dirname + '/../public'));
}
