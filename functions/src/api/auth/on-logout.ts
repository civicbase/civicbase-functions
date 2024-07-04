import { Request, Response } from 'express';
import { adminAuth } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';

const logout = async (req: Request, res: Response): Promise<void> => {
  adminAuth
    .verifySessionCookie(req.user!.token)
    .then((decodedIdToken) => adminAuth.revokeRefreshTokens(decodedIdToken.sub))
    .then(() => {
      res.cookie('__civicbase_auth_token__', '', { expires: new Date(0) });

      return res.status(200).json({ message: 'User logged out' });
    })
    .catch((error) => {
      res.cookie('__civicbase_auth_token__', '', { expires: new Date(0) });
      logError('Logout', error);
      res.status(500).json({ ...error });
    });
};

export default logout;
