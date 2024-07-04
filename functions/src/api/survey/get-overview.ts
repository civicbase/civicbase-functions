import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';
import { getResults } from '../../utils/results';
import getFeedback from '../../utils/feedbakc';

export const getAccess = (access: any[]) => {
  const total = { pilot: 0, published: 0 };

  access.forEach((a) => {
    if (a.status === 'pilot') {
      total.pilot = total.pilot + 1;
    } else if (a.status === 'published') {
      total.published = total.published + 1;
    }
  });

  return { ...total };
};

export const getRespodents = (respondents: any[]) => {
  const total = { pilot: 0, published: 0 };

  respondents.forEach((a) => {
    if (a.status === 'pilot') {
      total.pilot = total.pilot + 1;
    } else if (a.status === 'published') {
      total.published = total.published + 1;
    }
  });

  return { ...total };
};

const getOverview = async (req: Request, res: Response): Promise<void> => {
  const { surveyId } = req.params;

  db.doc(`/surveys/${surveyId}`)
    .get()
    .then((survey) => {
      if (survey.exists) {
        const surveyData: any = survey.data();

        if (surveyData.uid !== req.user?.uid) {
          logError(
            `User = ${req.user?.uid} has no permission to collect data from survey = ${surveyId}`,
          );
          res
            .status(403)
            .json({ message: 'You have no permission to see this data' });
        } else {
          const overview: any = {};

          const A = db
            .collection('surveys')
            .doc(surveyId)
            .collection('access')
            .get()
            .then((data) => {
              const access: any = [];

              data.forEach((doc) => {
                access.push(doc.data());
              });

              overview.access = getAccess(access);
            })
            .catch((error) => {
              logError(`Survey [${surveyId}] access overview`, error);
              return res.status(500).json({ error });
            });

          const R = db
            .collection('surveys')
            .doc(surveyId)
            .collection('respondents')
            .get()
            .then((data) => {
              const respondents: any = [];

              data.forEach((doc) => {
                respondents.push(doc.data());
              });

              overview.respondent = getRespodents(respondents);
            })
            .catch((error) => {
              logError(`Survey [${surveyId}] respondents overview`, error);
              return res.status(500).json({ error });
            });

          const Results = db
            .collection('surveys')
            .doc(surveyId)
            .collection('answers')
            .get()
            .then((data) => {
              const answerData: any = [];

              data.forEach((doc) => {
                answerData.push({
                  ...doc.data(),
                  id: doc.id,
                });
              });

              const response: any = {
                survey: { ...surveyData, id: survey.id },
              };

              response.results = getResults(surveyData, answerData);

              if (surveyData?.setup?.feedback?.active) {
                response.feedback = getFeedback(answerData);
                overview.feedback = response.feedback;
              }

              overview.results = response.results;
            })
            .catch((error) => {
              logError(`Survey [${surveyId}] results overview`, error);
              return res.status(500).json({ error });
            });

          Promise.all([A, R, Results]).then(() => {
            res.status(200).json({ ...overview, id: surveyId });
          });
        }
      }
    })
    .catch((error) => {
      logError(`Survey [${surveyId}] overview`, error);
      return res.status(500).json(error);
    });
};

export default getOverview;
