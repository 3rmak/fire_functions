import { VALID_STATUSES } from '../constants/app';

export type SessionStatus = typeof VALID_STATUSES[number];

export interface Session {
  sessionId: string;
  region: string;
  status: SessionStatus;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateSessionRequest {
  region: string;
}

export interface UpdateSessionStatusRequest {
  status: SessionStatus;
}

export interface ListSessionsQuery {
  status?: SessionStatus;
  region?: string;
  limit?: number;
  offset?: number;
}
