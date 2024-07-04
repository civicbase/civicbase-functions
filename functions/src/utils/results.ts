export const getResults = (survey: any, answers: any) => {
  const method = survey.setup?.method || survey.method;

  switch (method.toLowerCase()) {
    case 'quadratic':
      return calculateQuadratic(answers);

    case 'conjoint':
      return calculateConjoint();

    case 'likert':
      return calculateLikert(answers);
  }
};

const calculateConjoint = () => {
  return [];
};

const calculateLikert = (answers: any) => {
  return answers.reduce(
    (results: any, answer: any) => {
      answer.questions.forEach((question: any, index: any) => {
        results[answer.status] = {
          ...results[answer.status],
          [`L${index + 1}`]: results[answer.status][`L${index + 1}`]
            ? results[answer.status][`L${index + 1}`] + question.vote
            : question.vote,
        };
      });
      return results;
    },
    {
      pilot: {
        totalRespondents: 0,
      },
      published: {
        totalRespondents: 0,
      },
    },
  );
};

const calculateQuadratic = (answers: any) => {
  return answers.reduce(
    (results: any, answer: any) => {
      answer.questions.forEach((question: any) => {
        if (question.id) {
          results[answer.status][question.id] = results[answer.status][
            question.id
          ]
            ? results[answer.status][question.id] + question.vote
            : question.vote;
        }
      });
      return results;
    },
    {
      pilot: {},
      published: {},
    },
  );
};
