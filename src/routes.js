import express from 'express';
import bodyparser from 'body-parser'
import passport from 'passport'
import { DrinkRepository, DrinkTypeRepository, IngredientRepository } from './data';
import { DrinksController } from './controllers'

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

function authenticate(req, res, next) {
  const validationFunc = (err, user, info) => {
    if (err) {
      next(err);
    } else if (!user) {
      req.flash('error', info.message);
      res.redirect('/login');
    } else {
      req.logIn(user, err => {
        if (err) {
          next(err);
        } else {
          const redirectTo = req.flash('redirect')[0] || '/';
          res.redirect(redirectTo);
        }
      });
    }
  };
  const authenticationFunc = passport.authenticate('local', validationFunc);

  authenticationFunc(req, res, next);
}

export function configureRoutes(app, connectionString) {
  const drinkRepository = new DrinkRepository(connectionString);
  const drinkTypeRepository = new DrinkTypeRepository(connectionString);
  const ingredientRepository = new IngredientRepository(connectionString);
  const drinksController = new DrinksController(drinkRepository, drinkTypeRepository, ingredientRepository);

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
    .get((req, res) => res.render('register', { loggedIn: !!req.user }));

  app.route('/login')
    .get((req, res) => res.render('login', { loggedIn: !!req.user, error: req.flash('error')[0] }))
    .post(urlencodedParser, authenticate);

  app.route('/logout')
    .post((req, res) => { req.logout(); res.redirect('/'); });

  app.route('/profile')
    .get(requireUser, (req, res) => res.render('profile', { loggedIn: !!req.user }));

  app.use('/', express.static(__dirname + '/../public'));
}
