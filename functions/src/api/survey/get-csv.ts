import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { error as logError } from 'firebase-functions/logger';
import { getFields } from '../../utils/csv';
import * as json2csv from 'json2csv';

const getCSV = async (req: Request, res: Response): Promise<void> => {
  const { surveyId, mode } = req.params;

  if (!surveyId) {
    res
      .status(500)
      .json({ message: 'you are missing surveyId or mode(pilot | published)' });
    return;
  } else if (!mode) {
    res
      .status(500)
      .json({ message: 'you are missing surveyId or mode(pilot | published)' });
    return;
  }

  db.doc(`/surveys/${surveyId}`)
    .get()
    .then((survey) => {
      if (survey.exists) {
        const surveyData = survey.data();

        if (surveyData?.uid !== req.user?.uid) {
          logError(
            `User = ${req.user?.uid} has no permission to collect data from survey = ${surveyId}`,
          );
          res
            .status(403)
            .json({ message: 'You have no permission to see this data' });
        } else {
          db.collection('surveys')
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

              let fields = [];

              const method =
                surveyData?.setup?.method || (surveyData as any).method;
              if (method.toLowerCase() === 'likert') {
                fields = getFields.likert(surveyData, answerData);
              } else if (method.toLowerCase() === 'quadratic') {
                fields = getFields.quadratic(surveyData, answerData);
              } else {
                return res
                  .status(500)
                  .json({ message: 'This method is not supported' });
              }

              // const fields = getFields(surveyData, answerData)

              const csv = new json2csv.Parser({ fields });

              const answers = answerData
                .filter((answer: any) => answer.status === mode)
                .map((answer: any) => {
                  const questions = answer.questions.sort(
                    (a: any, b: any) => a.order - b.order,
                  );
                  return { ...answer, questions };
                });

              const answerCSV = csv.parse(answers);

              const topic =
                surveyData?.setup?.topic || (surveyData as any).topic;

              res.attachment(`${topic}-${mode}.csv`);
              res.set('Content-Type', 'text/csv');
              return res.status(200).send(answerCSV);
            })
            .catch((error) => {
              logError(`Survey [${surveyId}] analytics`, error);
              return res.status(500).json({ error });
            });
        }
      }
    })
    .catch((error) => {
      logError(`Survey [${surveyId}] analytics`, error);
      return res.status(500).json(error);
    });
};

export default getCSV;
