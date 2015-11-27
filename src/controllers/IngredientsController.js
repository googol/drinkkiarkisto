import { render, setLocals, created } from './helpers'

export class IngredientsController {
  constructor(ingredientRepo) {
    this.ingredientRepo = ingredientRepo;
  }

  showList(req, res, next) {
    this.ingredientRepo.getAll()
      .then(ingredients => setLocals(res, { ingredients }))
      .then(() => render(res, 'ingredientList'))
      .catch(next);
  }

  addNew(req, res, next) {
    const name = req.body.ingredientName;
    this.ingredientRepo.addIngredient(name)
      .then(id => created(res, `/ingredients/${id}/`))
      .catch(next);
  }
}
