import express from 'express';
import { apiRequest } from './apiRequest';

const app: express.Express = express();
app.use(express.json());
app.use(apiRequest);

export default app
