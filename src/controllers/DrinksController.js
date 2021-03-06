import Promise from 'bluebird';
import { render, setLocals, created, updated, deleted } from './helpers';
import { DrinkValidator } from '../validation';

function findSingleDrinkOr404(drinkRepo, id) {
  return drinkRepo.findById(id).then(drink => {
    if (drink) {
      return drink;
    }

    const err = new Error(`Couldn't find drink with id ${id}`);
    err.statusCode = 404;
    throw err;
  });
}

export class DrinksController {
  constructor(drinkRepo, drinkTypeRepo, ingredientRepo) {
    this.drinkRepo = drinkRepo;
    this.drinkTypeRepo = drinkTypeRepo;
    this.ingredientRepo = ingredientRepo;
  }

  showList(req, res, next) {
    let drinksPromise;
    const query = res.locals.query;
    if (req.user) {
      drinksPromise = req.user.isAdmin ? this.drinkRepo.getAll(query) : this.drinkRepo.getAllAcceptedOrWrittenByUser(query, req.user.id);
    } else {
      drinksPromise = this.drinkRepo.getAllAccepted(query);
    }
    drinksPromise
      .then(result => res.locals.drinks = result)
      .then(() => render(res, 'index'))
      .catch(next);
  }

  showSingle(req, res, next) {
    const id = req.params.drinkId;
    findSingleDrinkOr404(this.drinkRepo, id)
      .then(drink => setLocals(res, { drink }))
      .then(() => render(res, 'singledrink'))
      .catch(next);
  }

  showSingleEditor(req, res, next) {
    const id = req.params.drinkId;
    Promise.join(
      findSingleDrinkOr404(this.drinkRepo, id),
      this.drinkTypeRepo.getAll(),
      this.ingredientRepo.getAllWithAmountsForDrink(id),
      (drink, drinkTypes, ingredients) => setLocals(res, { drink, drinkTypes, ingredients }))
      .then(() => render(res, 'editdrink'))
      .catch(next);
  }

  showNewEditor(req, res, next) {
    Promise.join(
      this.ingredientRepo.getAll(),
      this.drinkTypeRepo.getAll(),
      (ingredients, drinkTypes) => setLocals(res, { ingredients, drinkTypes }))
      .then(() => render(res, 'newdrink'))
      .catch(next);
  }

  updateSingle(req, res, next) {
    const id = req.params.drinkId;
    const drinkUrl = `/drinks/${id}/`;
    const drink = res.locals.drink;
    const validator = new DrinkValidator();

    validator.validate(drink, `${drinkUrl}?edit`)
      .then(() => this.drinkRepo.updateById(id, drink))
      .then(() => updated(res, drinkUrl))
      .catch(next);
  }

  addNew(req, res, next) {
    const drink = res.locals.drink;
    const validator = new DrinkValidator();

    validator.validate(drink, '/drinks/?new')
      .then(() => this.drinkRepo.addDrink(drink))
      .then(drinkId => created(res, `/drinks/${drinkId}/`))
      .catch(next);
  }

  deleteSingle(req, res, next) {
    const id = req.params.drinkId;
    this.drinkRepo.deleteById(id)
      .then(drinkId => deleted(res, '/'))
      .catch(next);
  }

  acceptSingle(req, res, next) {
    const id = req.params.drinkId;
    const accepted = !!req.body.accept;
    (accepted ? this.drinkRepo.acceptById(id) : Promise.resolve())
      .then(() => updated(res, `/drinks/${id}`))
      .catch(next);
  }
}
