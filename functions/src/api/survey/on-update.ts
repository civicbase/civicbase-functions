import { Request, Response } from 'express';
import { error as logError } from 'firebase-functions/logger';
import { db } from '../../config/firebase';

const update = async (req: Request, res: Response): Promise<void> => {
  const survey: any = {
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const surveyRef = db.collection('surveys').doc(survey.id);

  console.log('survey', survey);

  surveyRef
    .set(survey, { merge: true })
    .then(() => res.status(201).json({ ...survey }))
    .catch((error) => {
      logError(`Failed to update survey [${survey.id}]`, { error });
      res.status(500).json(error);
    });

  // db.collection('surveys')
  //   .doc(survey.id)
  //   .update(survey)
  //   .then(() => res.status(201).json({ ...survey }))
  // .catch((error) => {
  //   logError(`Failed to update survey [${survey.id}]`, {
  //     error,
  //   });
  //   res.status(500).json(error);
  // });
};

export default update;
