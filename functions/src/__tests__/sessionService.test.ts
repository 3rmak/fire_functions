import { SessionService } from '../services/sessionService';
import { NotFoundError } from '../utils/errors';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin for testing
if (!initializeApp.length) {
  initializeApp();
}

// Mock Firestore
jest.mock('firebase-admin/firestore', () => {
  const mockTimestamp = {
    now: jest.fn(() => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 })),
  };

  const createMockCollection = () => {
    const mockCollection: any = {
      doc: jest.fn(),
      get: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn(),
      startAfter: jest.fn(),
    };
    
    mockCollection.where.mockReturnValue(mockCollection);
    mockCollection.orderBy.mockReturnValue(mockCollection);
    mockCollection.limit.mockReturnValue(mockCollection);
    mockCollection.startAfter.mockReturnValue(mockCollection);
    
    return mockCollection;
  };

  const mockFirestoreInstance = {
    collection: jest.fn(() => createMockCollection()),
  };

  return {
    getFirestore: jest.fn(() => mockFirestoreInstance),
    Timestamp: mockTimestamp,
  };
});

// Get reference to the mock instance after mocking
import { getFirestore } from 'firebase-admin/firestore';

const mockFirestoreInstance = getFirestore();

describe('SessionService', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionService = new SessionService();
  });

  describe('createSession', () => {
    it('should create a session with correct data', async () => {
      const region = 'eu-central';
      const mockDoc = {
        set: jest.fn().mockResolvedValue(undefined),
      };
      (mockFirestoreInstance.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => mockDoc),
      });

      const session = await sessionService.createSession(region);

      expect(session.region).toBe(region);
      expect(session.status).toBe('pending');
      expect(session.sessionId).toBeDefined();
      expect(session.createdAt).toBeDefined();
      expect(session.updatedAt).toBeDefined();
    });
  });

  describe('getSession', () => {
    it('should return session when found', async () => {
      const sessionId = 'test-session-id';
      const mockSession = {
        sessionId,
        region: 'eu-central',
        status: 'pending',
        createdAt: { seconds: Date.now() / 1000 },
        updatedAt: { seconds: Date.now() / 1000 },
      };

      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => mockSession,
        }),
      };
      (mockFirestoreInstance.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => mockDocRef),
      });

      const session = await sessionService.getSession(sessionId);

      expect(session.sessionId).toBe(sessionId);
    });

    it('should throw NotFoundError when session not found', async () => {
      const sessionId = 'non-existent-id';
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: false,
        }),
      };
      (mockFirestoreInstance.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => mockDocRef),
      });

      await expect(sessionService.getSession(sessionId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateSessionStatus', () => {
    it('should update session status', async () => {
      const sessionId = 'test-session-id';
      const newStatus = 'active';
      const mockSession = {
        sessionId,
        region: 'eu-central',
        status: newStatus,
        createdAt: { seconds: Date.now() / 1000 },
        updatedAt: { seconds: Date.now() / 1000 },
      };

      const mockDocRef = {
        get: jest.fn()
          .mockResolvedValueOnce({ exists: true })
          .mockResolvedValueOnce({ exists: true, data: () => mockSession }),
        update: jest.fn().mockResolvedValue(undefined),
      };
      (mockFirestoreInstance.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => mockDocRef),
      });

      const session = await sessionService.updateSessionStatus(sessionId, newStatus);

      expect(session.status).toBe(newStatus);
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: newStatus,
          updatedAt: expect.anything(),
        })
      );
    });

    it('should throw NotFoundError when session not found', async () => {
      const sessionId = 'non-existent-id';
      const mockDocRef = {
        get: jest.fn().mockResolvedValue({ exists: false }),
        update: jest.fn(),
      };
      (mockFirestoreInstance.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => mockDocRef),
      });

      await expect(
        sessionService.updateSessionStatus(sessionId, 'active')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
