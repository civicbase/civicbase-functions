import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';

const check = async (req: Request, res: Response): Promise<void> => {
  if (req.user?.uid) {
    const doctRef = db.collection('users').doc(req.user.uid);

    doctRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          return res.status(200).json(doc.data());
        } else {
          return res.status(500).json({ message: 'Can not find user details' });
        }
      })
      .catch((error) => {
        logError(`Failed to get user profile [${req.user?.uid}]`, error);
        return res.status(500).json({ ...error });
      });
  }
};

export default check;
