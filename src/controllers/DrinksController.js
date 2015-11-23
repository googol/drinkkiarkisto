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

export class DrinksController {
  constructor(drinkRepo, drinkTypeRepo, ingredientRepo) {
    this.drinkRepo = drinkRepo;
    this.drinkTypeRepo = drinkTypeRepo;
    this.ingredientRepo = ingredientRepo;
  }

  showList(res, user) {
    this.drinkRepo.getAll().then(result => res.render('index', { drinks: result, loggedIn: !!user }));
  }

  showSingle(id, res, user) {
    findSingleDrinkOr404(this.drinkRepo, id).then(drink => res.render('singledrink', { drink: drink, loggedIn: !!user }), err => res.status(err.statusCode || 500).send(err.toString()));
  }

  showSingleEditor(id, res, user) {
    Promise.join(
      findSingleDrinkOr404(this.drinkRepo, id),
      this.drinkTypeRepo.getAll(),
      this.ingredientRepo.getAllWithAmountsForDrink(id),
      (drink, drinkTypes, ingredients) => res.render('editdrink', { drink: drink, drinkTypes: drinkTypes, ingredients: ingredients, loggedIn: !!user }));
  }

  showNewEditor(res, user) {
    Promise.join(
      this.ingredientRepo.getAll(),
      this.drinkTypeRepo.getAll(),
      (ingredients, drinkTypes) => res.render('newdrink', { ingredients: ingredients, drinkTypes: drinkTypes, loggedIn: !!user }));
  }

  updateSingle(id, drink, res) {
    if (!drink.primaryName || !drink.preparation || !drink.type) {
      res.redirect(`/drinks/${id}/`);
    } else {
      this.drinkRepo.updateById(id, drink)
        .then(() => res.redirect(`/drinks/${id}/`), err => res.status(err.statusCode || 500).send(err.toString() + '\n' + err.stack));
    }
  }

  addNew(drink, res) {
    if (!drink.primaryName || !drink.preparation || !drink.type) {
      res.redirect('/drinks/?new');
    } else {
      this.drinkRepo.addDrink(drink)
        .then(drinkId => res.redirect(`/drinks/${drinkId}/`), err => res.status(500).send(err.toString() + '\n' + err.stack));
    }
  }

  deleteSingle(id, res) {
    this.drinkRepo.deleteById(id)
      .then(drinkId => res.redirect('/'), err => res.status(err.statusCode || 500).send(err.toString() + '\n' + err.stack));
  }
}
