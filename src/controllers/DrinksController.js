import Promise from 'bluebird'
import { render, setLocals } from './helpers'

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

function getIngredientAmounts(body) {
  return Object.keys(body)
    .map(key => key.match(/ingredient-(\d+)-amount/))
    .map(match => match && { id: match[1], amount: body[match[0]] } || undefined)
    .filter(value => value && value.amount);
}

const getDrinkFromRequestBody = Promise.method(body => {
  return {
    primaryName: body.drinkName,
    preparation: body.drinkPreparation,
    ingredients: getIngredientAmounts(body),
    type: body.drinkType
  };
});

export class DrinksController {
  constructor(drinkRepo, drinkTypeRepo, ingredientRepo) {
    this.drinkRepo = drinkRepo;
    this.drinkTypeRepo = drinkTypeRepo;
    this.ingredientRepo = ingredientRepo;
  }

  showList(req, res, next) {
    this.drinkRepo.getAll()
      .then(result => res.locals.drinks = result)
      .then(() => render(res, 'index'))
      .catch(err => next(err));
  }

  showSingle(req, res, next) {
    const id = req.params.drinkId;
    findSingleDrinkOr404(this.drinkRepo, id)
      .then(drink => setLocals(res, { drink }))
      .then(() => render(res, 'singledrink'))
      .catch(err => next(err));
  }

  showSingleEditor(req, res, next) {
    const id = req.params.drinkId;
    Promise.join(
      findSingleDrinkOr404(this.drinkRepo, id),
      this.drinkTypeRepo.getAll(),
      this.ingredientRepo.getAllWithAmountsForDrink(id),
      (drink, drinkTypes, ingredients) => setLocals(res, { drink, drinkTypes, ingredients }))
      .then(() => render(res, 'editdrink'))
      .catch(err => next(err));
  }

  showNewEditor(req, res, next) {
    Promise.join(
      this.ingredientRepo.getAll(),
      this.drinkTypeRepo.getAll(),
      (ingredients, drinkTypes) => setLocals(res, { ingredients, drinkTypes }))
      .then(() => render(res, 'newdrink'))
      .catch(err => next(err));
  }

  updateSingle(req, res, next) {
    const id = req.params.drinkId;
    getDrinkFromRequestBody(req.body)
      .then(drink => (!drink.primaryName || !drink.preparation || !drink.type)
        ? res.redirect(`/drinks/${id}/`)
        : this.drinkRepo.updateById(id, drink)
            .then(() => res.redirect(`/drinks/${id}/`)))
      .catch(err => next(err));
  }

  addNew(req, res, next) {
    getDrinkFromRequestBody(req.body)
      .then(drink => (!drink.primaryName || !drink.preparation || !drink.type)
        ? res.redirect('/drinks/?new')
        : this.drinkRepo.addDrink(drink)
            .then(drinkId => res.redirect(`/drinks/${drinkId}/`)))
      .catch(err => next(err));
  }

  deleteSingle(req, res, next) {
    const id = req.params.drinkId;
    this.drinkRepo.deleteById(id)
      .then(drinkId => res.redirect('/'))
      .catch(err => next(err));
  }
}
