import { onRequest } from 'firebase-functions/v1/https';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from '../../config/cors';
import { isAuthenticated } from '../../config/middleware';
import getAll from './get-all';
import create from './on-create';
import clone from './on-clone';
import deleteSurvey from './on-delete';
import publish from './on-publish';
import finish from './on-finish';
import update from './on-update';
import getSurvey from './get-survey';
import getOverview from './get-overview';
import getCSV from './get-csv';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/all', isAuthenticated, getAll);
app.post('/create', isAuthenticated, create);
app.get('/clone/:surveyId', isAuthenticated, clone);
app.delete('/delete/:surveyId', isAuthenticated, deleteSurvey);
app.get('/publish/:surveyId', isAuthenticated, publish);
app.get('/finish/:surveyId', isAuthenticated, finish);
app.put('/update', isAuthenticated, update);
app.get('/overview/:surveyId', isAuthenticated, getOverview);
app.get('/csv/:surveyId/:mode', isAuthenticated, getCSV);

// For respondent
app.get('/:surveyId', getSurvey);

export default onRequest(app);
