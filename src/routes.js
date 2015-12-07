import express from 'express';
import passport from 'passport';
import path from 'path';
import { DrinkRepository, DrinkTypeRepository, IngredientRepository, UserRepository } from './data';
import { DrinksController, DrinkTypesController, IngredientsController, ProfileController, UsersController } from './controllers';
import { requireUser, requireAdmin, requireUserOrLoginFactory, requireAdminOrLoginFactory, urlencodedParser, getDrinkFromRequestBody } from './middleware';

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
  const drinkTypesController = new DrinkTypesController(drinkTypeRepository);
  const usersController = new UsersController(userRepository);

  const requireUserOrLogin = requireUserOrLoginFactory(profileController);
  const requireAdminOrLogin = requireAdminOrLoginFactory(profileController);

  app.route('/')
    .get(::drinksController.showList);

  app.route('/drinks')
    .get(ifHasQueryParam('new',
      (req, res, next) => requireUserOrLogin(req, res, () => drinksController.showNewEditor(req, res, next)),
      (req, res, next) => res.redirect('/')))
    .post(requireUser, urlencodedParser, getDrinkFromRequestBody, ::drinksController.addNew);

  app.route('/drinks/:drinkId')
    .get(ifHasQueryParam('edit',
      (req, res, next) => requireAdminOrLogin(req, res, () => drinksController.showSingleEditor(req, res, next)),
      ::drinksController.showSingle))
    .post(requireAdmin, urlencodedParser, ::drinksController.acceptSingle)
    .put(requireAdmin, urlencodedParser, getDrinkFromRequestBody, ::drinksController.updateSingle)
    .delete(requireAdmin, ::drinksController.deleteSingle);

  app.route('/ingredients')
    .get(requireAdmin, ::ingredientsController.showList)
    .post(requireAdmin, urlencodedParser, ::ingredientsController.addNew);

  app.route('/ingredients/:ingredientId')
    .get(requireAdmin, (req, res, next) => res.redirect('/ingredients'))
    .delete(requireAdmin, ::ingredientsController.deleteSingle);

  app.route('/drinktypes')
    .get(requireAdmin, ::drinkTypesController.showList)
    .post(requireAdmin, urlencodedParser, ::drinkTypesController.addNew);

  app.route('/drinktypes/:drinkTypeId')
    .get(requireAdmin, (req, res, next) => res.redirect('/drinktypes'))
    .delete(requireAdmin, ::drinkTypesController.deleteSingle);

  app.route('/users')
    .get(requireAdmin, ::usersController.showList);

  app.route('/users/:userId')
    .get(requireAdmin, (req, res, next) => res.redirect('/users'))
    .post(requireAdmin, urlencodedParser, ::usersController.changeAdminStatus)
    .delete(requireAdmin, ::usersController.deleteSingle);

  app.route('/register')
    .get(::profileController.showRegistrationPage)
    .post(urlencodedParser, ::profileController.registerUser);

  app.route('/login')
    .get(::profileController.showLoginPage)
    .post(urlencodedParser, ::profileController.login);

  app.route('/logout')
    .post(::profileController.logout);

  app.route('/profile')
    .get(requireUserOrLogin, ::profileController.showProfilePage)
    .post(requireUser, urlencodedParser, ::profileController.updatePassword)
    .delete(requireUser, ::profileController.deleteProfile);

  app.use('/', express.static(path.join(__dirname, '..', 'public')));
}
