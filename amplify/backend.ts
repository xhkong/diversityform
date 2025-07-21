import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { getInterview } from './functions/getInterview/resource';
defineBackend({
  auth,
  data,
  getInterview,
});
