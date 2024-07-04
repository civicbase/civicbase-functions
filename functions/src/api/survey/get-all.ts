import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';

const getAll = async (req: Request, res: Response): Promise<void> => {
  if (req.user?.uid) {
    const { uid } = req.user;

    db.collection('surveys')
      .where('uid', '==', uid)
      .get()
      .then((data) => {
        const list: any[] = [];

        data.forEach((doc) => {
          list.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        res.status(200).json(list);
      })
      .catch((error) => {
        logError(`User [${uid}] failed to fetch surveys`, error);
        return res.status(500).json(error);
      });
  }
};

export default getAll;
