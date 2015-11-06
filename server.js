import express from 'express';
import fs from 'fs';
import Drinks from './server/drinks';

const app = express();
const publicPath = __dirname + '/public';
const connectionString = process.env.DATABASE_URL;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  const drinks = new Drinks(connectionString);
  drinks.getAll().then(function(result) {
    res.render('index', { drinks: result });
  });
});

app.get('/drinks', function(req, res) {
  res.redirect('/');
});

app.route('/drinks/:drinkId')
  .get(function(req, res) {
    const templateName = (req.query.edit === undefined ? 'drink' : 'editdrink') + req.params.drinkId;
    const templateFile = __dirname + '/views/' + templateName + '.ejs';

    if (fs.existsSync(templateFile)) {
      res.render(templateName);
    } else {
      res.sendStatus(404);
    }
  })
  .post(function(req, res) {
    res.send('SAVED (not)');
  });

app.get('/register', function(req, res) {
  res.render('register');
});

app.route('/login')
  .get(function(req, res) {
    res.render('login');
  })
  .post(function(req, res) {
    res.redirect('/');
  });

app.route('/logout')
  .get(function(req, res) {
    res.render('logout');
  })
  .post(function(req, res) {
    res.redirect('/');
  });

app.get('/profile', function(req, res) {
  res.render('profile');
});

app.use('/', express.static(publicPath));

export default app;
