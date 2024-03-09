import { Answer } from '../types/answer'
import { Survey } from '../types/survey'

const userId = ['userid', 'userId', 'userID']

type Field = {
  value: string
  label: string
}

// get questions order
const getOrder = (answer: Answer) =>
  answer.questions.map((_a, index) => ({ value: `questions[${index}].id`, label: `S${index + 1}` }))

// get questions ids
const getIds = (answer: Answer) => {
  return answer.questions
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((question, index) => ({ value: `questions[${index}].vote`, label: question.id }))
}

const userHasId = (answers: Answer[]) => {
  let flag = false
  answers.forEach((answer) => {
    userId.forEach((id) => {
      if (answer[id]) {
        flag = true
      }
    })
  })

  return flag
}

const userHasSuburb = (answers: Answer[]) => {
  let flag = false
  answers.forEach((answer) => {
    if (answer.suburb) {
      flag = true
    }
  })

  return flag
}

const quadratic = (survey: Survey, answers: Answer[]) => {
  const answer = answers[0]
  const fields: Field[] = []

  if (userHasId(answers)) {
    fields.push({ value: 'userId', label: 'user id' })
  }

  if (userHasSuburb(answers)) {
    fields.push({ value: 'suburb', label: 'suburb' })
  }

  fields.push(...getIds(answer))
  fields.push(...getOrder(answer))
  fields.push({ value: 'createdAt', label: 'created at' })
  fields.push({ value: 'time.surveyLoadAt', label: 'survey loaded at' })
  fields.push({ value: 'time.startAt', label: 'started at' })
  fields.push({ value: 'time.questionPageLoadAt', label: 'questions started at' })
  fields.push({ value: 'time.submitedAt', label: 'submitted at' })
  fields.push({ value: 'leftCredits', label: 'credit left' })

  if (survey.setup.feedback?.active) {
    survey.setup.feedback.questions.forEach((question, index) => {
      fields.push({ value: `feedback[${index}].answer`, label: question.id })
    })
  }

  return fields
}

const likert = (survey: Survey, answers: Answer[]) => {
  const answer = answers[0]
  const fields: Field[] = []

  if (userHasId(answers)) {
    fields.push({ value: 'userId', label: 'user id' })
  }

  if (userHasSuburb(answers)) {
    fields.push({ value: 'suburb', label: 'suburb' })
  }

  // get ids
  answer.questions.map((question, index) => ({ value: `questions[${index}].vote`, label: `L${index + 1}` }))

  if (userHasId(answers)) {
    fields.push({ value: 'userId', label: 'user id' })
  }

  if (userHasSuburb(answers)) {
    fields.push({ value: 'suburb', label: 'suburb' })
  }

  const questions = answer.questions.map((_, index) => ({
    value: `questions[${index}].vote`,
    label: `L${index + 1}`,
  }))

  fields.push(...questions)

  fields.push({ value: 'createdAt', label: 'created at' })
  fields.push({ value: 'time.startAt', label: 'started at' })

  if (survey.setup.feedback?.active) {
    survey.setup.feedback.questions.forEach((question, index) => {
      fields.push({ value: `feedback[${index}].answer`, label: question.id })
    })
  }

  return fields
}

export const getFields = {
  quadratic,
  likert,
}
