export function getResults(survey: any, answers: any) {
  switch (survey.setup.method) {
    case 'Quadratic':
      return calculateQuadratic(answers)

    case 'Conjoint':
      return calculateConjoint()

    case 'Likert':
      return calculateLikert(answers)
  }
}

const calculateConjoint = () => {
  return []
}

const calculateLikert = (answers: any) => {
  return answers.reduce(
    (results: any, answer: any) => {
      answer.questions.forEach((question: any, index) => {
        results[answer.status] = {
          ...results[answer.status],
          [`L${index + 1}`]: results[answer.status][`L${index + 1}`]
            ? results[answer.status][`L${index + 1}`] + question.vote
            : question.vote,
        }
      })
      return results
    },
    {
      pilot: {
        totalRespondents: 0,
      },
      published: {
        totalRespondents: 0,
      },
    },
  )
}

const calculateQuadratic = (answers: any) => {
  return answers.reduce(
    (results: any, answer: any) => {
      answer.questions.forEach((question: any) => {
        if (question.id) {
          results[answer.status][question.id] = results[answer.status][question.id]
            ? results[answer.status][question.id] + question.vote
            : question.vote
        }
      })
      return results
    },
    {
      pilot: {},
      published: {},
    },
  )
}
