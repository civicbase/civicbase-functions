import { onRequest } from 'firebase-functions/v1/https';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from '../../config/cors';
import { isAuthenticated } from '../../config/middleware';
import login from './on-login';
import signup from './on-signup';
import check from './on-check';
import logout from './on-logout';
import forgotPassword from './on-password-reset';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/login', login);
app.post('/signup', signup);
app.post('/forgotPassword', forgotPassword);
app.get('/check', isAuthenticated, check);
app.get('/logout', isAuthenticated, logout);

export default onRequest(app);
