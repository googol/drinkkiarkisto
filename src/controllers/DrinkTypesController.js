import { render, setLocals, created, deleted } from './helpers'

export class DrinkTypesController {
  constructor(drinkTypeRepo) {
    this.drinkTypeRepo = drinkTypeRepo;
  }

  showList(req, res, next) {
    this.drinkTypeRepo.getAll()
      .then(drinkTypes => setLocals(res, { drinkTypes }))
      .then(() => render(res, 'drinkTypeList'))
      .catch(next);
  }

  addNew(req, res, next) {
    const name = req.body.drinkTypeName;
    this.drinkTypeRepo.addDrinkType(name)
      .then(id => created(res, `/drinktypes/${id}/`))
      .catch(next);
  }

  deleteSingle(req, res, next) {
    const id = req.params.drinkTypeId;
    this.drinkTypeRepo.deleteById(id)
      .then(() => deleted(res, '/drinktypes'))
      .catch(next);
  }
}
