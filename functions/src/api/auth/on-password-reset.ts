import { Request, Response } from 'express';
import { sendPasswordResetEmail } from 'firebase/auth';
import { error as logError } from 'firebase-functions/logger';
import { auth } from '../../config/firebase-client';

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  sendPasswordResetEmail(auth, email)
    .then(() =>
      res.status(200).json({ code: 'auth/reset-password-email-sent' }),
    )
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ code: 'auth/user-not-found' });
      }

      logError('Reset password', error);
      return res.status(500).json({ ...error });
    });
};

export default resetPassword;
