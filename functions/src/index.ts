import { onRequest } from 'firebase-functions/v2/https';
import * as authentication from './api/auth';
import { middleware } from './config/middle-ware';

console.log(`${process.env.NODE_ENV}`, process.env.FIREBASE_API_KEY);

export const auth = authentication.auth;

const testFn = (req: Request, res: any) => {
  res.status(200).send('Hello from Firebase!');
};

export const test = onRequest(
  { cors: true },
  middleware(testFn, { method: 'POST' }),
);
