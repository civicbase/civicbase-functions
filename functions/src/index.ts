import * as authAPI from './api/auth';
import * as surveyAPI from './api/survey';
import * as answerAPI from './api/answer';

console.log(`${process.env.NODE_ENV}`, process.env.FIREBASE_API_KEY);

export const auth = authAPI.auth;
export const survey = surveyAPI.survey;
export const answer = answerAPI.answer;
