import { onRequest } from 'firebase-functions/v1/https';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from '../../config/cors';
import createAnswer from './on-create';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/:surveyId', createAnswer);

export default onRequest(app);
