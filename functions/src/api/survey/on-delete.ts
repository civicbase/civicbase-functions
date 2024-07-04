import { Request, Response } from 'express';
import { error as logError } from 'firebase-functions/logger';
import { db } from '../../config/firebase';

/* TODO: need to verify if the user is allowed to delete */
const deleteSurvey = async (req: Request, res: Response): Promise<void> => {
  const { surveyId } = req.params;

  db.doc(`/surveys/${surveyId}`)
    .delete()
    .then(() => db.doc(`/answers/${surveyId}`).delete())
    .then(() => res.status(200).json({ message: 'Deleted.' }))
    .catch((error) => {
      logError(`Failed to delete survey [${surveyId}]`, {
        error,
      });
      return res.status(500).json(error);
    });
};

export default deleteSurvey;
