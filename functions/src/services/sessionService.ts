import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Session, SessionStatus, ListSessionsQuery } from '../types/session';
import { NotFoundError } from '../utils/errors';
import { randomUUID } from 'crypto';
import { SESSIONS_COLLECTION } from '../constants/app';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/limits';

const db = getFirestore();

export class SessionService {
  async createSession(region: string): Promise<Session> {
    const sessionId = randomUUID();
    const now = Timestamp.now();

    const session: Session = {
      sessionId,
      region,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection(SESSIONS_COLLECTION).doc(sessionId).set(session);

    return session;
  }

  async getSession(sessionId: string): Promise<Session> {
    const doc = await db.collection(SESSIONS_COLLECTION).doc(sessionId).get();

    if (!doc.exists) {
      throw new NotFoundError('Session');
    }

    return doc.data() as Session;
  }

  async updateSessionStatus(sessionId: string, status: SessionStatus): Promise<Session> {
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc(sessionId);
    const doc = await sessionRef.get();

    if (!doc.exists) {
      throw new NotFoundError('Session');
    }

    const updatedAt = Timestamp.now();
    await sessionRef.update({
      status,
      updatedAt,
    });

    const updatedDoc = await sessionRef.get();
    return updatedDoc.data() as Session;
  }

  async listSessions(query: ListSessionsQuery): Promise<{ sessions: Session[]; total: number }> {
    let queryRef: FirebaseFirestore.Query = db.collection(SESSIONS_COLLECTION);

    if (query.status) {
      queryRef = queryRef.where('status', '==', query.status);
    }

    if (query.region) {
      queryRef = queryRef.where('region', '==', query.region);
    }

    queryRef = queryRef.orderBy('createdAt', 'desc');

    const limit = query.limit || DEFAULT_LIMIT;
    const offset = query.offset || DEFAULT_OFFSET;

    const countSnapshot = await queryRef.get();
    const total = countSnapshot.size;

    if (offset > 0) {
      const offsetSnapshot = await queryRef.limit(offset).get();
      const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
      if (lastDoc) {
        queryRef = queryRef.startAfter(lastDoc);
      }
    }

    const snapshot = await queryRef.limit(limit).get();
    const sessions = snapshot.docs.map((doc) => doc.data() as Session);

    return { sessions, total };
  }
}
