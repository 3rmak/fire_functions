import { Request } from 'firebase-functions/v2/https';
import { UnauthorizedError } from '../utils/errors';
import { API_KEY_HEADER, BEARER_PREFIX } from '../constants/app';

const VALID_API_KEY = process.env.API_KEY;

/* Could be improved by adding additional mechanism to validate the API key outside the function */
if (!VALID_API_KEY) {
  throw new Error('API_KEY environment variable is required');
}

export function validateApiKey(req: Request): void {
  const authHeader = req.headers[API_KEY_HEADER] as string | undefined;

  if (!authHeader) {
    throw new UnauthorizedError('Missing authorization header');
  }

  if (!authHeader.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError('Authorization header must use Bearer format');
  }

  const apiKey = authHeader.substring(BEARER_PREFIX.length).trim();

  if (!apiKey || apiKey !== VALID_API_KEY) {
    throw new UnauthorizedError('Invalid API key');
  }
}
