import { onRequest } from 'firebase-functions/v2/https';
import express, { Request } from 'express';
import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import helmet from 'helmet';
// import { credential } from 'firebase-admin';
// import login from './on-login';
// import { corsOptions } from '../../config/cors';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 204,
};
app.use(express.json());
app.use(cors(corsOptions));
// app.use(helmet());
// app.use(cookieParser());
// app.options('*', cors(corsOptions));

// app.options('*', cors(corsOptions));

// TODO: post request returns CORS
// app.post('/login', login);
app.post('/login', (req: Request, res: any) => {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  res.cookie('pamonha', '1234', {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'none',
  });

  res.status(200).send('login');
});

app.get('/validateToken', (req: Request, res: any) => {
  res.status(200).send('Token is valid');
});

export default onRequest({ cors: true }, app);
