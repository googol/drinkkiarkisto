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

export function configureRoutes(app, connectionString) {
  const drinkRepository = new DrinkRepository(connectionString);
  const drinkTypeRepository = new DrinkTypeRepository(connectionString);
  const ingredientRepository = new IngredientRepository(connectionString);
  const drinksController = new DrinksController(drinkRepository, drinkTypeRepository, ingredientRepository);

  app.route('/')
    .get((req, res) => drinksController.showList(res, req.user));

  app.route('/drinks')
    .get((req, res) => req.query.new !== undefined
        ? drinksController.showNewEditor(res, req.user)
        : res.redirect('/'))
    .post(urlencodedParser, (req, res) => drinksController.addNew(getDrinkFromRequestBody(req.body), res));

  app.route('/drinks/:drinkId')
    .get((req, res) => req.query.edit !== undefined
      ? drinksController.showSingleEditor(req.params.drinkId, res, req.user)
      : drinksController.showSingle(req.params.drinkId, res, req.user))
    .put(urlencodedParser, (req, res) => drinksController.updateSingle(req.params.drinkId, getDrinkFromRequestBody(req.body), res))
    .delete((req, res) => drinksController.deleteSingle(req.params.drinkId, res));

  app.route('/register')
    .get((req, res) => res.render('register', { loggedIn: !!req.user }));

  app.route('/login')
    .get((req, res) => res.render('login', { loggedIn: !!req.user, error: req.flash('error') }))
    .post(urlencodedParser, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

  app.route('/logout')
    .post((req, res) => { req.logout(); res.redirect('/'); });

  app.route('/profile')
    .get((req, res) => res.render('profile', { loggedIn: !!req.user }));

  app.use('/', express.static(__dirname + '/../public'));
}
