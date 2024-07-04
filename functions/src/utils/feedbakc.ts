const getFeedback = (answers: any[]) => {
  const feeback: any = {
    pilot: [],
    published: [],
  };

  answers.forEach((answer) => {
    if (answer.feedback) {
      answer.feedback.forEach((feedback: any) => {
        if (answer.status === 'pilot') {
          feeback.pilot.push(feedback);
        }

        if (answer.status === 'published') {
          feeback.published.push(feedback);
        }
      });
    }
  });

  return feeback;
};

export default getFeedback;
