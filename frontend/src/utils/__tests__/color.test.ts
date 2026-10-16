import { describe, it, expect } from 'vitest';
import {
  isValidHexColor,
  normalizeHexColor,
  calculateContrastRatio,
  evaluateContrast,
} from '../color';

describe('color utility', () => {
  describe('isValidHexColor & CSS Injection Prevention', () => {
    it('should accept valid 3-digit and 6-digit hex codes', () => {
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#0E7C6B')).toBe(true);
      expect(isValidHexColor('#e86c50')).toBe(true);
      expect(isValidHexColor('#1A2B3C')).toBe(true);
    });

    it('should strictly reject invalid hex and CSS injection attacks', () => {
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor('red')).toBe(false);
      expect(isValidHexColor('rgb(255, 0, 0)')).toBe(false);
      expect(isValidHexColor('#12')).toBe(false);
      expect(isValidHexColor('#12345')).toBe(false);
      expect(isValidHexColor('#1234567')).toBe(false);
      expect(isValidHexColor('#ggg')).toBe(false);

      // Malicious payloads
      expect(isValidHexColor('#000; background: red')).toBe(false);
      expect(isValidHexColor('#fff url(evil.com)')).toBe(false);
      expect(isValidHexColor('#000) expression(alert(1))')).toBe(false);
      expect(isValidHexColor('<script>alert(1)</script>')).toBe(false);
    });
  });

  describe('normalizeHexColor', () => {
    it('should expand 3-digit hex to 6-digit uppercase hex', () => {
      expect(normalizeHexColor('#fff')).toBe('#FFFFFF');
      expect(normalizeHexColor('#0e7')).toBe('#00EE77');
    });

    it('should return fallback if input is invalid', () => {
      expect(normalizeHexColor('invalid', '#123456')).toBe('#123456');
    });
  });

  describe('WCAG Contrast Calculation & Evaluation', () => {
    it('should compute exact contrast ratio for black and white (21:1)', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBe(21);
    });

    it('should compute ratio 1:1 for identical colors', () => {
      const ratio = calculateContrastRatio('#FFFFFF', '#FFFFFF');
      expect(ratio).toBe(1);
    });

    it('should evaluate contrast compliance correctly', () => {
      // Black on White -> AAA
      const blackOnWhite = evaluateContrast('#000000', '#FFFFFF');
      expect(blackOnWhite.isCompliant).toBe(true);
      expect(blackOnWhite.level).toBe('AAA');

      // Teal #0E7C6B on White #FFFFFF -> ~4.8:1 -> AA
      const tealOnWhite = evaluateContrast('#0E7C6B', '#FFFFFF');
      expect(tealOnWhite.isCompliant).toBe(true);
      expect(tealOnWhite.level).toBe('AA');

      // Light gray #CCCCCC on White #FFFFFF -> Fail
      const grayOnWhite = evaluateContrast('#CCCCCC', '#FFFFFF');
      expect(grayOnWhite.isCompliant).toBe(false);
      expect(grayOnWhite.level).toBe('Fail');
      expect(grayOnWhite.message).toContain('Cảnh báo');
    });
  });
});
