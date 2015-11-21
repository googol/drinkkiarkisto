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

  showList(res) {
    this.drinkRepo.getAll().then(result => res.render('index', { drinks: result }));
  }

  showSingle(id, res) {
    findSingleDrinkOr404(this.drinkRepo, id).then(drink => res.render('singledrink', { drink: drink }), err => res.status(err.statusCode || 500).send(err.toString()));
  }

  showSingleEditor(id, res) {
    Promise.join(
      findSingleDrinkOr404(this.drinkRepo, id),
      this.ingredientRepo.getAllWithAmountsForDrink(id),
      (drink, ingredients) => res.render('editdrink', { drink: drink, ingredients: ingredients }));
  }

  showNewEditor(res) {
    Promise.join(
      this.ingredientRepo.getAll(),
      this.drinkTypeRepo.getAll(),
      (ingredients, drinkTypes) => res.render('newdrink', { ingredients: ingredients, drinkTypes: drinkTypes }));
  }

  updateSingle(id, primaryName, preparation, ingredientAmounts, res) {
    res.send('SAVED (not)');
  }

  addNew(drink, res) {
    if (!drink.primaryName || !drink.preparation || !drink.type) {
      res.redirect('/drinks/?new');
    } else {
      this.drinkRepo.addDrink(drink)
        .then(drinkId => res.redirect(`/drinks/${drinkId}/`), err => res.status(500).send(err.toString() + '\n' + err.stack));
    }
  }
}
