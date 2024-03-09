import * as functions from 'firebase-functions'
import { db } from '../../../config/firebase'
import { middleware } from '../../../services/auth'
import { Request, Response } from '../../../types/function'
import * as json2csv from 'json2csv'
import { getFields } from '../../../utils/csv'
import { Survey } from '../../../types/survey'
import { Answer } from '../../../types/answer'

const resultsCSVFn = (req: Request, res: Response) => {
  // TODO: move this logi to ultis to return an array with params
  const params = req.params['0'].split('/')
  const surveyId = params[0]
  const mode = params[1]

  if (!surveyId || !mode) {
    res.status(500).json({ message: 'you are missing surveyId or mode(pilot | published)' })
  }

  db.doc(`/surveys/${surveyId}`)
    .get()
    .then((survey) => {
      if (survey.exists) {
        const surveyData = survey.data() as Survey

        if (surveyData?.uid !== req.user.uid) {
          functions.logger.error(`User = ${req.user.uid} has no permission to collect data from survey = ${surveyId}`)
          res.status(403).json({ message: 'You have no permission to see this data' })
        } else {
          db.collection('surveys')
            .doc(surveyId)
            .collection('answers')
            .get()
            .then((data) => {
              const answerData: Answer[] = []

              data.forEach((doc) => {
                answerData.push({
                  ...(doc.data() as Answer),
                  id: doc.id,
                })
              })

              let fields = []

              if (surveyData.setup.method === 'Likert') {
                fields = getFields.likert(surveyData, answerData)
              } else if (surveyData.setup.method === 'Quadratic') {
                fields = getFields.quadratic(surveyData, answerData)
              } else {
                return res.status(500).json({ message: 'This method is not supported' })
              }

              // const fields = getFields(surveyData, answerData)

              const csv = new json2csv.Parser({ fields })

              const answers = answerData
                .filter((answer) => answer.status === mode)
                .map((answer) => {
                  const questions = answer.questions.sort((a, b) => a.order - b.order)
                  return { ...answer, questions }
                })

              const answerCSV = csv.parse(answers)

              res.attachment(`${surveyData.setup.topic}-${mode}.csv`)
              res.set('Content-Type', 'text/csv')
              return res.status(200).send(answerCSV)
            })
            .catch((error) => {
              functions.logger.error(`Survey [${surveyId}] analytics`, error)
              return res.status(500).json({ error })
            })
        }
      }
    })
    .catch((error) => {
      functions.logger.error(`Survey [${surveyId}] analytics`, error)
      return res.status(500).json(error)
    })
}

export default functions.https.onRequest(middleware(resultsCSVFn, { authenticatedRoute: true, method: 'GET' }))
