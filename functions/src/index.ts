import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { withAuth } from './middleware/withAuth';
import {
  createSessionHandler,
  getSessionHandler,
  updateSessionStatusHandler,
  listSessionsHandler,
} from './handlers/sessionHandlers';

initializeApp();

// HTTP endpoints
export const createSession = onRequest({
  cors: true,
}, withAuth(createSessionHandler));

export const getSession = onRequest({
  cors: true,
}, withAuth(getSessionHandler));

export const updateSessionStatus = onRequest({
  cors: true,
}, withAuth(updateSessionStatusHandler));

export const listSessions = onRequest({
  cors: true,
}, withAuth(listSessionsHandler));
