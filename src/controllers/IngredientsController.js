import { render, setLocals } from './helpers'

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
}
