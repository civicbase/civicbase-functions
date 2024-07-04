import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';
import { getIp } from '../../utils/ip';

const createAnswer = async (req: Request, res: Response): Promise<void> => {
  const { surveyId } = req.params;

  const answer = {
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  getIp(req, 'respondents', answer.status);

  db.collection('surveys')
    .doc(surveyId)
    .collection('answers')
    .add(answer)
    .then((doc) => res.status(201).json(doc.id))
    .catch((error) => {
      logError('Create answer', error);
      return res.status(500).json(error);
    });
};

export default createAnswer;
