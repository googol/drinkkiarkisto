import express from 'express';

const app = express();
const publicPath = __dirname + '/public';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/login', function(req, res) {
  res.redirect('/');
});

app.get('/logout', function(req, res) {
  res.render('logout');
});
app.post('/logout', function(req, res) {
  res.redirect('/');
});

app.get('/profile', function(req, res) {
  res.render('profile');
});

app.use('/', express.static(publicPath));

export default app;
