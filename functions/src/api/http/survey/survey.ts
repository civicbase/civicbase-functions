import * as functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'
import { getSurvey } from './get'
import { createSurvey } from './on-create'
import { auth } from '../../../services/auth'
import { updateSurvey } from './on-update'
import { deleteSurvey } from './on-delete'

const app = express()

app.use(cors({ origin: true, credentials: true }))

app.get('/:surveyId', getSurvey)
app.post('/', auth, createSurvey)
app.put('/:surveyId', auth, updateSurvey)
app.delete('/:surveyId', auth, deleteSurvey)

export default functions.https.onRequest(app)
