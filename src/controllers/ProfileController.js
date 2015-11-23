export class ProfileController {
  constructor(passport, userRepo) {
    this.passport = passport;
    this.userRepo = userRepo;
  }

  showRegistrationPage(res) {
    res.render('register');
  }

  showLoginPage(req, res) {
    res.render('login', { user: req.user, errors: req.flash('error') });
  }

  login(req, res, next) {
    const validationFunc = (err, user, info) => {
      if (err) {
        next(err);
      } else if (!user) {
        req.flash('error', info.message);
        res.redirect('/login');
      } else {
        req.logIn(user, err => {
          if (err) {
            next(err);
          } else {
            const redirectTo = req.flash('redirect')[0] || '/';
            res.redirect(redirectTo);
          }
        });
      }
    };
    const authenticationFunc = this.passport.authenticate('local', validationFunc);

    authenticationFunc(req, res, next);
  }

  logout(req, res) {
    req.logout();
    res.redirect('/');
  }

  showProfilePage(user, req, res) {
    res.render('profile', { user: user, successes: req.flash('success'), errors: req.flash('error') });
  }

  updatePassword(user, passwordCurrent, passwordNew, passwordNewConfirm, req, res) {
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
      .then(() => res.redirect('/profile'));
  }

  deleteProfile(req, res) {
    const user = req.user;
    req.logout();
    this.userRepo.deleteById(user.id)
      .then(() => res.redirect('/'));
  }
}
