import * as functions from 'firebase-functions'
import { Response } from 'express'
import { db } from '../../../config/firebase'
import { AuthRequest } from '../../../types/express'
import { setQuestionsId } from '../../../utils/survey'

export const updateSurvey = (req: AuthRequest, res: Response) => {
  const { surveyId } = req.params
  const survey: any = {
    ...req.body,
    updatedAt: new Date().toISOString(),
    id: surveyId,
  }

  if (req.body.setup.method === 'Quadratic') {
    survey.quadratic = setQuestionsId(survey)
  }

  if (req.body.setup.method === 'Conjoint') {
    survey.conjoint = setQuestionsId(survey)
  }

  if (req.body.setup.method === 'Likert') {
    survey.likert = setQuestionsId(survey)
  }

  db.collection('surveys')
    .doc(survey.id)
    .update(survey)
    .then(() => res.status(201).json({ ...survey }))
    .catch((error) => {
      functions.logger.error(`Failed to update survey [${survey.id}]`, { error })
      res.status(500).json({ ...error })
    })
}
