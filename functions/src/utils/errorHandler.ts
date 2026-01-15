import { Response } from 'express';
import { AppError } from '../types/errors';

export function handleError(error: unknown, res: Response): void {
  if (res.headersSent) return;

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code || 'ERROR',
        message: error.message,
      },
    });
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}
