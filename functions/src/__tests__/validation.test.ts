import {
  validateRegion,
  validateStatus,
  validateSessionId,
  validateLimit,
  validateOffset,
} from '../utils/validation';
import { ValidationError } from '../utils/errors';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/limits';

describe('Validation utilities', () => {
  describe('validateRegion', () => {
    it('should accept valid regions', () => {
      expect(() => validateRegion('eu-central')).not.toThrow();
      expect(() => validateRegion('us-east')).not.toThrow();
      expect(() => validateRegion('us-west')).not.toThrow();
      expect(() => validateRegion('ap-southeast')).not.toThrow();
    });

    it('should throw ValidationError for invalid region', () => {
      expect(() => validateRegion('invalid-region')).toThrow(ValidationError);
      expect(() => validateRegion('')).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty or null region', () => {
      expect(() => validateRegion('')).toThrow(ValidationError);
      expect(() => validateRegion(null as any)).toThrow(ValidationError);
      expect(() => validateRegion(undefined as any)).toThrow(ValidationError);
    });
  });

  describe('validateStatus', () => {
    it('should accept valid statuses', () => {
      expect(validateStatus('pending')).toBe('pending');
      expect(validateStatus('active')).toBe('active');
      expect(validateStatus('completed')).toBe('completed');
      expect(validateStatus('failed')).toBe('failed');
    });

    it('should throw ValidationError for invalid status', () => {
      expect(() => validateStatus('invalid')).toThrow(ValidationError);
      expect(() => validateStatus('')).toThrow(ValidationError);
    });

    it('should throw ValidationError for null or undefined status', () => {
      expect(() => validateStatus(null as any)).toThrow(ValidationError);
      expect(() => validateStatus(undefined as any)).toThrow(ValidationError);
    });
  });

  describe('validateSessionId', () => {
    it('should accept valid session ID', () => {
      expect(() => validateSessionId('test-session-id')).not.toThrow();
      expect(() => validateSessionId('12345')).not.toThrow();
    });

    it('should throw ValidationError for empty session ID', () => {
      expect(() => validateSessionId('')).toThrow(ValidationError);
      expect(() => validateSessionId(null as any)).toThrow(ValidationError);
      expect(() => validateSessionId(undefined as any)).toThrow(ValidationError);
    });
  });

  describe('validateLimit', () => {
    it('should return default limit when undefined', () => {
      expect(validateLimit(undefined)).toBe(DEFAULT_LIMIT);
    });

    it('should accept valid limits', () => {
      expect(validateLimit(1)).toBe(1);
      expect(validateLimit(50)).toBe(50);
      expect(validateLimit(100)).toBe(100);
    });

    it('should throw ValidationError for invalid limits', () => {
      expect(() => validateLimit(0)).toThrow(ValidationError);
      expect(() => validateLimit(101)).toThrow(ValidationError);
      expect(() => validateLimit(-1)).toThrow(ValidationError);
    });
  });

  describe('validateOffset', () => {
    it('should return default offset when undefined', () => {
      expect(validateOffset(undefined)).toBe(DEFAULT_OFFSET);
    });

    it('should accept valid offsets', () => {
      expect(validateOffset(0)).toBe(0);
      expect(validateOffset(10)).toBe(10);
      expect(validateOffset(100)).toBe(100);
    });

    it('should throw ValidationError for negative offsets', () => {
      expect(() => validateOffset(-1)).toThrow(ValidationError);
    });
  });
});
