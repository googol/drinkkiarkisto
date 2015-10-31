import express from 'express';

const app = express();
const publicPath = __dirname + '/public';

app.use('/', express.static(publicPath));

export default app;
