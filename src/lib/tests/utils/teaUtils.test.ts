import { describe, it, expect } from 'vitest';
import type { TeaSession } from '$lib/stores/chatStore';

interface TeaValidationResult {
  isValid: boolean;
  errors: string[];
}

// Utility functions to test
const validateTeaSession = (session: Partial<TeaSession>): TeaValidationResult => {
  const errors: string[] = [];

  if (!session.teaType?.trim()) {
    errors.push('Tea type is required');
  }

  if (!session.teaStyle?.trim()) {
    errors.push('Tea style is required');
  }

  if (session.brewingTemp !== undefined && session.brewingTemp !== null) {
    if (session.brewingTemp < 0 || session.brewingTemp > 100) {
      errors.push('Brewing temperature must be between 0°C and 100°C');
    }
  }

  if (session.steepTime !== undefined && session.steepTime !== null) {
    if (session.steepTime < 0 || session.steepTime > 3600) {
      errors.push('Steep time must be between 0 and 3600 seconds');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const formatSteepTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`
    : `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

describe('Tea Utilities', () => {
  describe('validateTeaSession', () => {
    it('should validate a complete tea session', () => {
      const session: Partial<TeaSession> = {
        teaType: 'Green Tea',
        teaStyle: 'Sencha',
        brewingTemp: 75,
        steepTime: 180
      };

      const result = validateTeaSession(session);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a minimal tea session', () => {
      const session: Partial<TeaSession> = {
        teaType: 'Green Tea',
        teaStyle: 'Sencha'
      };

      const result = validateTeaSession(session);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject session with missing required fields', () => {
      const session: Partial<TeaSession> = {
        teaType: '',
        teaStyle: '  ',
        brewingTemp: 75
      };

      const result = validateTeaSession(session);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tea type is required');
      expect(result.errors).toContain('Tea style is required');
    });

    it('should validate brewing temperature range', () => {
      const invalidTemps = [-1, 101, 150];
      
      invalidTemps.forEach(temp => {
        const session: Partial<TeaSession> = {
          teaType: 'Green Tea',
          teaStyle: 'Sencha',
          brewingTemp: temp
        };

        const result = validateTeaSession(session);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Brewing temperature must be between 0°C and 100°C');
      });
    });

    it('should validate steep time range', () => {
      const invalidTimes = [-1, 3601, 7200];
      
      invalidTimes.forEach(time => {
        const session: Partial<TeaSession> = {
          teaType: 'Green Tea',
          teaStyle: 'Sencha',
          steepTime: time
        };

        const result = validateTeaSession(session);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Steep time must be between 0 and 3600 seconds');
      });
    });
  });

  describe('formatSteepTime', () => {
    it('should format seconds only', () => {
      expect(formatSteepTime(45)).toBe('45 seconds');
      expect(formatSteepTime(1)).toBe('1 seconds');
    });

    it('should format minutes and seconds', () => {
      expect(formatSteepTime(65)).toBe('1 minute 5 seconds');
      expect(formatSteepTime(185)).toBe('3 minutes 5 seconds');
    });

    it('should format minutes only', () => {
      expect(formatSteepTime(60)).toBe('1 minute');
      expect(formatSteepTime(180)).toBe('3 minutes');
    });

    it('should handle edge cases', () => {
      expect(formatSteepTime(0)).toBe('0 seconds');
      expect(formatSteepTime(3600)).toBe('60 minutes');
    });
  });
});
