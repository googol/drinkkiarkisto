import express from 'express';

const app = express();
const publicPath = __dirname + '/public';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req,res) {
  res.render('index');
});
app.use('/', express.static(publicPath));

export default app;
