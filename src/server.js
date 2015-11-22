import express from 'express';
import { configureRoutes } from './routes'
import { configureMiddleware } from './middleware'

const app = express();
const connectionString = process.env.DATABASE_URL;
const cookieSecret = 'keyboard cat';

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

configureMiddleware(app, connectionString, cookieSecret);
configureRoutes(app, connectionString);

const server = app.listen(app.get('port'), function() {
  const port = server.address().port;

  console.log('Drinkkiarkisto listening at http://localhost:%s', port);
});
