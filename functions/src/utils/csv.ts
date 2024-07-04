const userId = ['userid', 'userId', 'userID'];

type Field = {
  value: string;
  label: string;
};

// get questions order
const getOrder = (answer: any) =>
  answer.questions.map((_a: any, index: any) => ({
    value: `questions[${index}].id`,
    label: `S${index + 1}`,
  }));

// get questions ids
const getIds = (answer: any) => {
  return answer.questions
    .sort((a: any, b: any) => Number(a.id) - Number(b.id))
    .map((question: any, index: any) => ({
      value: `questions[${index}].vote`,
      label: question.id,
    }));
};

const userHasId = (answers: any[]) => {
  let flag = false;
  answers.forEach((answer) => {
    userId.forEach((id) => {
      if (answer[id]) {
        flag = true;
      }
    });
  });

  return flag;
};

const userHasSuburb = (answers: any[]) => {
  let flag = false;
  answers.forEach((answer) => {
    if (answer.suburb) {
      flag = true;
    }
  });

  return flag;
};

const quadratic = (survey: any, answers: any[]) => {
  const answer = answers[0];
  const fields: Field[] = [];

  if (userHasId(answers)) {
    fields.push({ value: 'userId', label: 'user id' });
  }

  if (userHasSuburb(answers)) {
    fields.push({ value: 'suburb', label: 'suburb' });
  }

  fields.push(...getIds(answer));
  fields.push(...getOrder(answer));
  fields.push({ value: 'createdAt', label: 'created at' });
  fields.push({ value: 'time.surveyLoadAt', label: 'survey loaded at' });
  fields.push({ value: 'time.startAt', label: 'started at' });
  fields.push({
    value: 'time.questionPageLoadAt',
    label: 'questions started at',
  });
  fields.push({ value: 'time.submitedAt', label: 'submitted at' });
  fields.push({ value: 'leftCredits', label: 'credit left' });

  if (survey.setup?.feedback?.active) {
    survey.setup.feedback.questions.forEach((question: any, index: any) => {
      fields.push({ value: `feedback[${index}].answer`, label: question.id });
    });
  }

  return fields;
};

const likert = (survey: any, answers: any[]) => {
  const answer = answers[0];
  const fields: Field[] = [];

  if (userHasId(answers)) {
    fields.push({ value: 'userId', label: 'user id' });
  }

  if (userHasSuburb(answers)) {
    fields.push({ value: 'suburb', label: 'suburb' });
  }

  // get ids
  answer.questions.map((question: any, index: any) => ({
    value: `questions[${index}].vote`,
    label: `L${index + 1}`,
  }));

  if (userHasId(answers)) {
    fields.push({ value: 'userId', label: 'user id' });
  }

  if (userHasSuburb(answers)) {
    fields.push({ value: 'suburb', label: 'suburb' });
  }

  const questions = answer.questions.map((_: any, index: any) => ({
    value: `questions[${index}].vote`,
    label: `L${index + 1}`,
  }));

  fields.push(...questions);

  fields.push({ value: 'createdAt', label: 'created at' });
  fields.push({ value: 'time.startAt', label: 'started at' });

  if (survey.setup?.feedback?.active) {
    survey.setup?.feedback.questions.forEach((question: any, index: any) => {
      fields.push({ value: `feedback[${index}].answer`, label: question.id });
    });
  }

  return fields;
};

export const getFields = {
  quadratic,
  likert,
};
