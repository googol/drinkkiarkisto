import Promise from 'bluebird'

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
    const user = req.user;
    this.drinkRepo.getAll()
      .then(result => res.render('index', { drinks: result, user: user }))
      .catch(err => next(err));
  }

  showSingle(req, res, next) {
    const id = req.params.drinkId;
    const user = req.user;
    findSingleDrinkOr404(this.drinkRepo, id)
      .then(drink => res.render('singledrink', { drink: drink, user: user }))
      .catch(err => next(err));
  }

  showSingleEditor(req, res, next) {
    const id = req.params.drinkId;
    const user = req.user;
    Promise.join(
      findSingleDrinkOr404(this.drinkRepo, id),
      this.drinkTypeRepo.getAll(),
      this.ingredientRepo.getAllWithAmountsForDrink(id),
      (drink, drinkTypes, ingredients) => res.render('editdrink', { drink: drink, drinkTypes: drinkTypes, ingredients: ingredients, user: user }))
      .catch(err => next(err));
  }

  showNewEditor(req, res, next) {
    const user = req.user;
    Promise.join(
      this.ingredientRepo.getAll(),
      this.drinkTypeRepo.getAll(),
      (ingredients, drinkTypes) => res.render('newdrink', { ingredients: ingredients, drinkTypes: drinkTypes, user: user }))
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
