import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';

const generateClonedTopicName = (originalTopic: string): string => {
  const cloneRegex = /clone (\d+) - /i;
  let cloneCount = 1;

  // Check if the topic already contains a clone count
  const match = originalTopic.match(cloneRegex);
  if (match) {
    cloneCount = parseInt(match[1], 10) + 1;
  } else if (originalTopic.toLowerCase().startsWith('clone - ')) {
    cloneCount = 2;
  }

  // Remove any existing "clone" prefix from the original topic
  const cleanedTopic = originalTopic
    .replace(cloneRegex, '')
    .replace(/clone - /i, '');

  // Construct the new topic
  const newTopic =
    cloneCount === 1
      ? `clone - ${cleanedTopic}`
      : `clone ${cloneCount} - ${cleanedTopic}`;

  return newTopic;
};

const clone = async (req: Request, res: Response): Promise<void> => {
  const { surveyId } = req.params;

  db.doc(`/surveys/${surveyId}`)
    .get()
    .then((doc: any) => {
      const topic = doc.data().setup?.topic ?? doc.data().topic;

      const clonedSurvey = {
        ...doc.data(),
        topic: generateClonedTopicName(topic),
        createdAt: new Date().toISOString(),
        status: 'pilot',
        finishedAt: null,
        publishedAt: null,
      };

      if (doc.exists && clonedSurvey) {
        return db
          .collection('surveys')
          .add(clonedSurvey)
          .then((doc) => res.status(201).json({ ...clonedSurvey, id: doc.id }))
          .catch((error) => {
            logError(`Survey ${surveyId} failed to clone`, error);
            return res.status(500).json({ message: 'Failed to clone survey' });
          });
      }

      logError(`Survey ${surveyId} failed to clone, for unknown reason`);
      return res.status(500).json('Can not clone survey');
    })
    .catch((error) => res.status(500).json(error));
};

export default clone;
