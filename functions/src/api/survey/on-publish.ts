import { Request, Response } from 'express';
import { error as logError } from 'firebase-functions/logger';
import { db } from '../../config/firebase';

const publish = async (req: Request, res: Response): Promise<void> => {
  const { surveyId } = req.params;
  const survey = db.collection('surveys').doc(surveyId);

  survey
    .update({
      status: 'published',
      publishedAt: new Date().toISOString(),
    })
    .then(() => res.status(200).json({ id: surveyId }))
    .catch((error) => {
      logError(`Failed to publish survey [${surveyId}]`, {
        error,
      });
      return res.status(500).json(error);
    });
};

export default publish;
