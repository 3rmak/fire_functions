import { SessionStatus } from '../types/session';
import { ValidationError } from '../types/errors';
import { VALID_REGIONS, VALID_STATUSES } from '../constants/app';
import { DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT, DEFAULT_OFFSET } from '../constants/limits';

export function validateRegion(region: string): void {
  if (!region || typeof region !== 'string' || !region.trim().length) {
    throw new ValidationError('Region is required and must be a non-empty string');
  }
  
  if (!VALID_REGIONS.includes(region as typeof VALID_REGIONS[number])) {
    throw new ValidationError(
      `Invalid region. Must be one of: ${VALID_REGIONS.join(', ')}`
    );
  }
}

export function validateStatus(status: string): SessionStatus {
  if (!status || typeof status !== 'string' || !status.trim().length) {
    throw new ValidationError('Status is required and must be a string');
  }

  if (!VALID_STATUSES.includes(status as SessionStatus)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }

  return status as SessionStatus;
}

export function validateSessionId(sessionId: string): void {
  if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim().length) {
    throw new ValidationError('Session ID is required and must be a non-empty string');
  }
}

export function validateLimit(limit: number | undefined): number {
  if (limit === undefined || limit === null) {
    return DEFAULT_LIMIT;
  }
  
  if (typeof limit !== 'number' || limit < MIN_LIMIT || limit > MAX_LIMIT) {
    throw new ValidationError(`Limit must be a number between ${MIN_LIMIT} and ${MAX_LIMIT}`);
  }
  
  return limit;
}

export function validateOffset(offset: number | undefined): number {
  if (offset === undefined || offset === null) {
    return DEFAULT_OFFSET;
  }
  
  if (typeof offset !== 'number' || offset < 0) {
    throw new ValidationError('Offset must be a non-negative number');
  }
  
  return offset;
}
