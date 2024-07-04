import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        token: string;
      };
    }
  }
}
