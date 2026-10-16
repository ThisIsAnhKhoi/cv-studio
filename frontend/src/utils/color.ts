/**
 * Color utility for validation, normalization, and WCAG 2.1 contrast ratio calculation.
 * Strictly prevents CSS injection and ensures accessibility standards.
 */

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const TOXIC_PATTERN = /[();<>"'`]|url|expression|javascript/i;

/**
 * Validates whether an input string is a safe, valid hex color code.
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  const trimmed = color.trim();
  if (TOXIC_PATTERN.test(trimmed)) return false;
  return HEX_REGEX.test(trimmed);
}

/**
 * Normalizes a hex color string to uppercase #RRGGBB format.
 * Returns fallback if invalid.
 */
export function normalizeHexColor(color: string, fallback = '#000000'): string {
  if (!isValidHexColor(color)) return fallback;
  const cleaned = color.trim().toUpperCase();

  if (cleaned.length === 4) {
    // Expand #RGB to #RRGGBB
    const r = cleaned[1];
    const g = cleaned[2];
    const b = cleaned[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return cleaned;
}

/**
 * Parse hex color to RGB tuple [r, g, b] (0-255).
 */
export function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHexColor(hex);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return [r, g, b];
}

/**
 * Convert sRGB channel value to linear RGB for WCAG luminance computation.
 */
function sRgbToLinear(c: number): number {
  const val = c / 255;
  return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
}

/**
 * Compute relative luminance according to WCAG 2.1 definition:
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * sRgbToLinear(r) +
    0.7152 * sRgbToLinear(g) +
    0.0722 * sRgbToLinear(b)
  );
}

/**
 * Calculate WCAG 2.1 contrast ratio between two hex colors: (L1 + 0.05) / (L2 + 0.05)
 * Returns a ratio between 1.0 and 21.0, rounded to 2 decimal places.
 */
export function calculateContrastRatio(colorA: string, colorB: string): number {
  const lumA = getRelativeLuminance(colorA);
  const lumB = getRelativeLuminance(colorB);

  const brighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  const ratio = (brighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

export interface ContrastEvaluation {
  ratio: number;
  isCompliant: boolean; // Meets WCAG AA (>= 4.5 for text, >= 3.0 for headings)
  level: 'AAA' | 'AA' | 'Fail';
  message: string;
}

/**
 * Evaluates contrast compliance for normal text or headings against a background.
 */
export function evaluateContrast(
  textHex: string,
  bgHex: string,
  isHeading = false
): ContrastEvaluation {
  const ratio = calculateContrastRatio(textHex, bgHex);
  const thresholdAA = isHeading ? 3.0 : 4.5;
  const thresholdAAA = isHeading ? 4.5 : 7.0;

  if (ratio >= thresholdAAA) {
    return {
      ratio,
      isCompliant: true,
      level: 'AAA',
      message: `Độ tương phản xuất sắc: ${ratio}:1 (Đạt chuẩn WCAG AAA)`,
    };
  }

  if (ratio >= thresholdAA) {
    return {
      ratio,
      isCompliant: true,
      level: 'AA',
      message: `Độ tương phản tốt: ${ratio}:1 (Đạt chuẩn WCAG AA)`,
    };
  }

  return {
    ratio,
    isCompliant: false,
    level: 'Fail',
    message: `Cảnh báo: Tỷ lệ tương phản ${ratio}:1 thấp hơn khuyến nghị ${thresholdAA}:1 (Khó đọc)`,
  };
}
