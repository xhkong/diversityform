import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { getInterview } from './functions/getInterview/resource';
import { putInterviewFeedback } from './functions/feedback/resource.js';
defineBackend({
  auth,
  data,
  getInterview,
  putInterviewFeedback,
});
