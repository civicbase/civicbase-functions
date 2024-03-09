import * as functions from 'firebase-functions'
import { Request, Response } from 'express'
import { db } from '../../../config/firebase'

export const getSurvey = (req: Request, res: Response) => {
  const { surveyId } = req.params

  db.doc(`/surveys/${surveyId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const survey: any = doc.data() as any

        req.params.status = survey.status

        res.status(200).json({ ...survey, id: doc.id })
      } else {
        functions.logger.error(`Survey [${surveyId}] does not exist`)
        res.status(500).json({ message: 'survey does not exist' })
      }
    })
    .catch((error) => {
      functions.logger.error(`Survey ${surveyId} failed to fetch`, error)
      return res.status(500).json(error)
    })
}
