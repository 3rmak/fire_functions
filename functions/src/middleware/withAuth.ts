import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { validateApiKey } from '../utils/auth';
import { handleError } from '../utils/errorHandler';

export function withAuth(handler: (req: Request, res: Response) => Promise<void>) {
  return async (req: Request, res: Response) => {
    try {
      validateApiKey(req);
      await handler(req, res);
    } catch (error) {
      handleError(error, res);
    }
  };
}
