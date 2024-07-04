import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';
import { getIp } from '../../utils/ip';

const getSurvey = async (req: Request, res: Response): Promise<void> => {
  const { surveyId } = req.params;

  db.doc(`/surveys/${surveyId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const survey: any = doc.data() as any;

        getIp(req, 'visitors', survey.status);
        req.params.status = survey.status;

        res.status(200).json({ ...survey, id: doc.id });
      } else {
        logError(`Survey [${surveyId}] does not exist`);
        res.status(500).json({ message: 'survey does not exist' });
      }
    })
    .catch((error) => {
      logError(`Survey ${surveyId} failed to fetch`, error);
      return res.status(500).json(error);
    });
};

export default getSurvey;
