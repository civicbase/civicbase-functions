import { adminAuth } from './firebase';
import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authToken = req.cookies['__civicbase_auth_token__'];

  if (!authToken) {
    res.status(403).json({ message: 'Forbidden' });
  } else {
    adminAuth
      .verifySessionCookie(authToken, true /** checkRevoked */)
      .then((decodedIdToken) => {
        req.user = {
          uid: decodedIdToken.uid,
          email: decodedIdToken.email ?? '',
          token: authToken,
        };
        next();
      })
      .catch(() => {
        res.status(401).json({ message: 'Unauthorized' });
      });
  }
};
