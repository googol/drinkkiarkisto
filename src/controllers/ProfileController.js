export class ProfileController {
  constructor(passport) {
    this.passport = passport;
  }

  showRegistrationPage(res) {
    res.render('register');
  }

  showLoginPage(req, res) {
    res.render('login', { user: req.user, error: req.flash('error')[0] });
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

  showProfilePage(user, res) {
    res.render('profile', { user: user });
  }
}
