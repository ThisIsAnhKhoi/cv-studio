import { describe, it, expect } from 'vitest';
import {
  FONT_REGISTRY,
  resolveFontOption,
  buildFontFamilyString,
  LEGACY_FONT_MAP,
} from '../fontRegistry';

describe('fontRegistry utility', () => {
  it('should include 7 curated fonts with verified Vietnamese support', () => {
    expect(FONT_REGISTRY.length).toBe(7);
    FONT_REGISTRY.forEach((font) => {
      expect(font.id).toBeTruthy();
      expect(font.family).toBeTruthy();
      expect(font.vietnameseVerified).toBe(true);
      expect(font.license).toBeTruthy();
      expect(font.weights.length).toBeGreaterThan(0);
    });
  });

  it('should resolve font by id correctly', () => {
    const font = resolveFontOption('montserrat');
    expect(font.id).toBe('montserrat');
    expect(font.family).toBe('Montserrat');
  });

  it('should map legacy font names for 100% backward compatibility', () => {
    expect(resolveFontOption('Gilroy').id).toBe('montserrat');
    expect(resolveFontOption('iCiel Cubano').id).toBe('outfit');
    expect(resolveFontOption('SVN-Optima').id).toBe('playfair-display');
  });

  it('should fallback safely to Be Vietnam Pro when given undefined or unknown font', () => {
    const fallbackDefault = resolveFontOption();
    expect(fallbackDefault.id).toBe('be-vietnam-pro');

    const unknownFallback = resolveFontOption('UnknownNonExistentFont');
    expect(unknownFallback.id).toBe('be-vietnam-pro');
  });

  it('should build safe font-family CSS strings with proper fallbacks', () => {
    const fontStr = buildFontFamilyString('inter');
    expect(fontStr).toContain('"Inter"');
    expect(fontStr).toContain('"Be Vietnam Pro"');

    const legacyStr = buildFontFamilyString('Gilroy');
    expect(legacyStr).toContain('"Montserrat"');
  });
});
