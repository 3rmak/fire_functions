import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { SessionService } from '../services/sessionService';
import { CreateSessionRequest, UpdateSessionStatusRequest, ListSessionsQuery } from '../types/session';
import { validateRegion, validateStatus, validateSessionId, validateLimit, validateOffset } from '../utils/validation';

const sessionService = new SessionService();

export async function createSessionHandler(req: Request, res: Response): Promise<void> {
  const { region } = req.body as CreateSessionRequest;
  
  validateRegion(region);
  
  try {
    const session = await sessionService.createSession(region);
  
    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Failed to create session');
    throw error;
  }
}

export async function getSessionHandler(req: Request, res: Response): Promise<void> {
  const sessionId = req.query.sessionId as string;
  
  validateSessionId(sessionId);
  
  try {
    const session = await sessionService.getSession(sessionId);
  
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Failed to get session');
    throw error;
  }
}

export async function updateSessionStatusHandler(req: Request, res: Response): Promise<void> {
  const sessionId = (req.query.sessionId as string) || (req.body?.sessionId as string);
  const { status } = req.body as UpdateSessionStatusRequest;
  
  validateSessionId(sessionId);
  const validStatus = validateStatus(status);
  
  try {
    const session = await sessionService.updateSessionStatus(sessionId, validStatus);
  
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Failed to update session status');
    throw error;
  }
}

export async function listSessionsHandler(req: Request, res: Response): Promise<void> {
  const { status, region, limit, offset } = req.query;
  
  const query: ListSessionsQuery = {};
  
  if (status) {
    query.status = validateStatus(status as string);
  }
  
  if (region) {
    validateRegion(region as string);
    query.region = region as string;
  }
  
  query.limit = validateLimit(limit ? Number(limit) : undefined);
  query.offset = validateOffset(offset ? Number(offset) : undefined);

  try {
    const result = await sessionService.listSessions(query);
  
    res.status(200).json({
      success: true,
      data: result.sessions,
      meta: {
        total: result.total,
        limit: query.limit,
        offset: query.offset,
      },
    });
  } catch (error) {
    console.error('Failed to list sessions');
    throw error;
  }
}
