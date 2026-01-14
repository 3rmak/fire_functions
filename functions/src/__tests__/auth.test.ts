// Set API_KEY before any imports
process.env.API_KEY = 'test-api-key';

import { validateApiKey } from '../middleware/auth';
import { Request } from 'firebase-functions/v2/https';
import { UnauthorizedError } from '../utils/errors';

describe('Authentication middleware', () => {
  let mockReq: Partial<Request>;

  beforeEach(() => {
    process.env.API_KEY = 'test-api-key';
    
    mockReq = {
      headers: {},
    };
  });

  afterEach(() => {
    process.env.API_KEY = 'test-api-key';
  });

  it('should not throw for valid API key in Bearer format', () => {
    mockReq.headers = {
      authorization: 'Bearer test-api-key',
    };

    expect(() => validateApiKey(mockReq as Request)).not.toThrow();
  });

  it('should throw UnauthorizedError for missing authorization header', () => {
    mockReq.headers = {};

    expect(() => validateApiKey(mockReq as Request)).toThrow(UnauthorizedError);
    expect(() => validateApiKey(mockReq as Request)).toThrow('Missing authorization header');
  });

  it('should throw UnauthorizedError for non-Bearer format', () => {
    mockReq.headers = {
      authorization: 'test-api-key',
    };

    expect(() => validateApiKey(mockReq as Request)).toThrow(UnauthorizedError);
    expect(() => validateApiKey(mockReq as Request)).toThrow('Authorization header must use Bearer format');
  });

  it('should throw UnauthorizedError for invalid API key', () => {
    mockReq.headers = {
      authorization: 'Bearer wrong-key',
    };

    expect(() => validateApiKey(mockReq as Request)).toThrow(UnauthorizedError);
    expect(() => validateApiKey(mockReq as Request)).toThrow('Invalid API key');
  });
});
