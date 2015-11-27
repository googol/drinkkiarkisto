import express from 'express';
import passport from 'passport'
import { DrinkRepository, DrinkTypeRepository, IngredientRepository, UserRepository } from './data';
import { DrinksController, IngredientsController, ProfileController } from './controllers'
import { requireUser, requireAdmin, requireUserOrLoginFactory, requireAdminOrLoginFactory, urlencodedParser, getDrinkFromRequestBody } from './middleware'

function ifHasQueryParam(param, then, otherwise) {
  return (req, res, next) => req.query[param] !== undefined
    ? then(req, res, next)
    : otherwise(req, res, next);
}

export function configureRoutes(app, connectionString) {
  const drinkRepository = new DrinkRepository(connectionString);
  const drinkTypeRepository = new DrinkTypeRepository(connectionString);
  const ingredientRepository = new IngredientRepository(connectionString);
  const userRepository = new UserRepository(connectionString);

  const drinksController = new DrinksController(drinkRepository, drinkTypeRepository, ingredientRepository);
  const profileController = new ProfileController(passport, userRepository);
  const ingredientsController = new IngredientsController(ingredientRepository);

  const requireUserOrLogin = requireUserOrLoginFactory(profileController);
  const requireAdminOrLogin = requireAdminOrLoginFactory(profileController);

  app.route('/')
    .get((req, res, next) => drinksController.showList(req, res, next));

  app.route('/drinks')
    .get(ifHasQueryParam('new',
      (req, res, next) => requireUserOrLogin(req, res, () => drinksController.showNewEditor(req, res, next)),
      (req, res, next) => res.redirect('/')))
    .post(requireUser, urlencodedParser, getDrinkFromRequestBody, (req, res, next) => drinksController.addNew(req, res, next));

  app.route('/drinks/:drinkId')
    .get(ifHasQueryParam('edit',
      (req, res, next) => requireAdminOrLogin(req, res, () => drinksController.showSingleEditor(req, res, next)),
      (req, res, next) => drinksController.showSingle(req, res, next)))
    .post(requireAdmin, urlencodedParser, (req, res, next) => drinksController.acceptSingle(req, res, next))
    .put(requireAdmin, urlencodedParser, getDrinkFromRequestBody, (req, res, next) => drinksController.updateSingle(req, res, next))
    .delete(requireAdmin, (req, res, next) => drinksController.deleteSingle(req, res, next));

  app.route('/ingredients')
    .get(requireAdmin, (req, res, next) => ingredientsController.showList(req, res, next))
    .post(requireAdmin, urlencodedParser, (req, res, next) => ingredientsController.addNew(req, res, next));

  app.route('/ingredients/:ingredientId')
    .get(requireAdmin, (req, res, next) => res.redirect('/ingredients'));

  app.route('/register')
    .get((req, res, next) => profileController.showRegistrationPage(req, res, next))
    .post(urlencodedParser, (req, res, next) => profileController.registerUser(req, res, next));

  app.route('/login')
    .get((req, res, next) => profileController.showLoginPage(req, res, next))
    .post(urlencodedParser, (req, res, next) => profileController.login(req, res, next));

  app.route('/logout')
    .post((req, res, next) => profileController.logout(req, res, next));

  app.route('/profile')
    .get(requireUserOrLogin, (req, res, next) => profileController.showProfilePage(req, res, next))
    .post(requireUser, urlencodedParser, (req, res, next) => profileController.updatePassword(req, res, next))
    .delete(requireUser, (req, res, next) => profileController.deleteProfile(req, res, next));

  app.use('/', express.static(__dirname + '/../public'));
}
