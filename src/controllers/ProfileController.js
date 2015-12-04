import Promise from 'bluebird';
import { render, created } from './helpers';
import { ValidationError } from '../validation';

export class ProfileController {
  constructor(passport, userRepo) {
    this.passport = passport;
    this.userRepo = userRepo;
  }

  showRegistrationPage(req, res, next) {
    render(res, 'register')
      .catch(next);
  }

  registerUser(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    Promise.try(() => {
      const errorMessages = {};
      if (!email) {
        errorMessages.email = 'Sähköpostiosoite vaaditaan';
      }
      if (!password) {
        errorMessages.password = 'Salasana vaaditaan';
      }
      if (password !== passwordConfirm) {
        errorMessages.passwordConfirm = 'Salasana ja salasanan vahvistus eivät vastaa toisiaan';
      }

      if (Object.keys(errorMessages).length > 0) {
        throw new ValidationError({ email, password, passwordConfirm }, errorMessages, '/register');
      }
    }).then(() => this.userRepo.addUser({ email, password }))
      .then(() => req.flash('success', 'Käyttäjätunnus luotu, kirjaudu sisään.'))
      .then(() => created(res, '/login'))
      .catch(next);
  }

  showLoginPage(req, res, next) {
    render(res, 'login')
      .catch(next);
  }

  login(req, res, next) {
    const authenticationFunc = this.passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login', failureFlash: true });

    authenticationFunc(req, res, next);
  }

  logout(req, res, next) {
    Promise.try(() => {
      req.logout();
      res.redirect('/');
    }).catch(next);
  }

  showProfilePage(req, res, next) {
    render(res, 'profile')
      .catch(next);
  }

  updatePassword(req, res, next) {
    const user = req.user;
    const passwordCurrent = req.body.passwordCurrent;
    const passwordNew = req.body.passwordNew;
    const passwordNewConfirm = req.body.passwordNewConfirm;

    user.validatePassword(passwordCurrent)
      .then(isValid => {
        let errors = 0;
        if (!isValid) { req.flash('error', 'Nykyinen salasana ei ole oikein'); errors++; }
        if (passwordNew !== passwordNewConfirm) { req.flash('error', 'Uusi salasana ja salasanan vahvistus eivät täsmää'); errors++; }
        if (!passwordNew) { req.flash('error', 'Uusi salasana ei voi olla tyhjä'); errors++; }

        if (errors === 0) {
          return this.userRepo.updatePasswordById(user.id, passwordNew)
            .then(() => req.flash('success', 'Salasana vaihdettu.'));
        }
      })
      .then(() => res.redirect('/profile'))
      .catch(next);
  }

  deleteProfile(req, res, next) {
    const user = req.user;
    Promise.try(() => req.logout())
      .then(() => this.userRepo.deleteById(user.id))
      .then(() => res.redirect('/'))
      .catch(next);
  }
}
