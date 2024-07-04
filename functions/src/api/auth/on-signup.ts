import { Request, Response } from 'express';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { error as logError } from 'firebase-functions/logger';
import { db } from '../../config/firebase';
import { auth } from '../../config/firebase-client';

const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      updateProfile(user, {
        displayName: name,
      }).then(() => {
        sendEmailVerification(user);
      });

      return user.uid;
    })
    .then((uid) => {
      const user = {
        name,
        email,
        uid,
        createdAt: new Date().toISOString(),
      };

      return db.doc(`/users/${uid}`).set(user);
    })
    .then(() => res.status(201).json({ code: 'auth/verify-email' }))
    .catch((error) => {
      logError('Signup', error);

      if (error.code === 'auth/email-already-in-use') {
        return res.status(409).json({
          ...error,
          message: 'An account with this email already exist',
        });
      } else {
        return res.status(400).json({ ...error });
      }
    });
};

export default signup;
