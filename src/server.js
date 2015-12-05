import express from 'express';
import { configureRoutes } from './routes';
import { configureMiddleware } from './middleware';
import { configureValidationErrorHandling } from './validation';

const app = express();
const connectionString = process.env.DATABASE_URL;
const cookieSecret = 'keyboard cat';

app.set('port', process.env.PORT || 3000);

configureMiddleware(app, connectionString, cookieSecret);
configureRoutes(app, connectionString);
configureValidationErrorHandling(app);

app.listen(app.get('port'), () => console.log('Drinkkiarkisto listening at http://localhost:%s', app.get('port')));
