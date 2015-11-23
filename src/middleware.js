import methodOverride from 'method-override'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import passport from 'passport'
import flash from 'connect-flash'
import { Strategy as LocalStrategy } from 'passport-local'
import pg from 'pg'
import { UserRepository } from './data'

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
          return done(null, false, { message: 'Incorrect email address' });
        }

        return user.validatePassword(password)
          .then(isValid => isValid
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password' }),
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
}
