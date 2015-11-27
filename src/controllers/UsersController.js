import { render, setLocals, created, deleted, updated } from './helpers'

export class UsersController {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  showList(req, res, next) {
    this.userRepo.getAll()
      .then(users => setLocals(res, { users }))
      .then(() => render(res, 'userList'))
      .catch(next);
  }

  addNew(req, res, next) {
    const name = req.body.userName;
    this.userRepo.addDrinkType(name)
      .then(id => created(res, `/users/${id}/`))
      .catch(next);
  }

  deleteSingle(req, res, next) {
    const id = req.params.userId;
    this.userRepo.deleteById(id)
      .then(() => deleted(res, '/users'))
      .catch(next);
  }

  changeAdminStatus(req, res, next) {
    console.log(req.body);
    const newIsAdmin = req.body.setAdmin === 'true';
    console.log(req.body.setAdmin, newIsAdmin);
    const id = req.params.userId;
    this.userRepo.setAdminStatusById(id, newIsAdmin)
      .then(() => updated(res, `/users/${id}/`))
      .catch(next);
  }
}
