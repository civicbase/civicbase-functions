import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';

const create = async (req: Request, res: Response): Promise<void> => {
  if (req.user?.uid) {
    const survey = {
      ...req.body,
      createdAt: new Date().toISOString(),
      uid: req.user.uid,
      status: 'pilot',
    };

    db.collection('surveys')
      .add(survey)
      .then((doc) => res.status(201).json({ ...survey, id: doc.id }))
      .catch((error) => {
        logError('Failed to create survey', { error, survey });
        return res.status(500).json({ ...error });
      });
  }
};

export default create;
