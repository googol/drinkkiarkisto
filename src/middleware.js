import methodOverride from 'method-override'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import passport from 'passport'
import flash from 'connect-flash'
import pg from 'pg'
import bodyparser from 'body-parser'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserRepository } from './data'
import { ValidationError } from './validation'

export const urlencodedParser = bodyparser.urlencoded({ extended: false });

export function requireUser(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export function requireUserOrLoginFactory(profileController) {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      req.flash('error', 'Pyytämäsi sivu vaatii sisäänkirjautumisen');
      req.session.returnTo = req.originalUrl;
      res.status(401);
      profileController.showLoginPage(req, res);
    }
  };
}

export function requireAdminOrLoginFactory(profileController) {
  return (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'Pyytämäsi sivu vaatii ylläpitäjän oikeudet.');
      req.session.returnTo = req.originalUrl;
      res.status(401);
      profileController.showLoginPage(req, res);
    }
  };
}

function setCommonLocals(req, res, next) {
  res.locals.user = req.user;
  res.locals.errors = req.flash('error');
  res.locals.successes = req.flash('success');
  next();
}

function getIngredientAmounts(body) {
  return Object.keys(body)
    .map(key => key.match(/ingredient-(\d+)-amount/))
    .map(match => match && { id: match[1], amount: body[match[0]] } || undefined)
    .filter(value => value && value.amount);
}

export function getDrinkFromRequestBody(req, res, next) {
  let err = undefined;

  try {
    const body = req.body;
    res.locals.drink = {
      primaryName: body.drinkName,
      preparation: body.drinkPreparation,
      ingredients: getIngredientAmounts(body),
      type: { id: body.drinkType }
    };
  } catch (e) {
    err = e;
  } finally {
    next(err);
  }
}

export function configureMiddleware(app, connectionString, cookieSecret) {
  const PgSession = connectPgSimple(session);
  const userRepo = new UserRepository(connectionString);

  const sessionConfiguration = {
    store: new PgSession({
      pg: pg,
      conString: connectionString
    }),
    secret: cookieSecret,
    resave: true,
    saveUninitialized: false
  };
  const localStrategy = new LocalStrategy(function(email, password, done) {
    userRepo.findByEmail(email)
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Väärä sähköpostiosoite' });
        }

        return user.validatePassword(password)
          .then(isValid => isValid
            ? done(null, user)
            : done(null, false, { message: 'Väärä salasana' }),
            err => done(err));
      }, err => done(err));
  });

  passport.use(localStrategy);
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    userRepo.findById(id)
      .asCallback(done);
  });

  app.use(methodOverride('_method'));
  app.use(session(sessionConfiguration));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(setCommonLocals);
}
