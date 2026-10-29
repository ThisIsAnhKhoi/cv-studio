import { describe, it, expect } from 'vitest';
import { formatSafeUrl, cleanDisplayUrl } from '../url';

describe('formatSafeUrl utility', () => {
  it('should return empty string for undefined, null, or empty string', () => {
    expect(formatSafeUrl(undefined)).toBe('');
    expect(formatSafeUrl('')).toBe('');
    expect(formatSafeUrl('   ')).toBe('');
  });

  it('should block javascript: protocol attacks (Stored XSS)', () => {
    expect(formatSafeUrl('javascript:alert(1)')).toBe('#');
    expect(formatSafeUrl('JAVASCRIPT:alert(document.cookie)')).toBe('#');
    expect(formatSafeUrl('  javascript:void(0)  ')).toBe('#');
  });

  it('should block data: and vbscript: protocols', () => {
    expect(formatSafeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    expect(formatSafeUrl('vbscript:msgbox("xss")')).toBe('#');
  });

  it('should auto-prepend https:// when protocol is missing', () => {
    expect(formatSafeUrl('trankhoi.dev')).toBe('https://trankhoi.dev');
    expect(formatSafeUrl('github.com/trankhoi')).toBe('https://github.com/trankhoi');
    expect(formatSafeUrl('linkedin.com/in/trankhoi')).toBe('https://linkedin.com/in/trankhoi');
  });

  it('should preserve already valid http and https URLs', () => {
    expect(formatSafeUrl('https://myportfolio.com')).toBe('https://myportfolio.com');
    expect(formatSafeUrl('http://insecure-site.org')).toBe('http://insecure-site.org');
  });
});

describe('cleanDisplayUrl utility', () => {
  it('should clean display URLs by stripping protocol and www', () => {
    expect(cleanDisplayUrl('https://www.github.com/trankhoi/')).toBe('github.com/trankhoi');
    expect(cleanDisplayUrl('http://myportfolio.com/')).toBe('myportfolio.com');
    expect(cleanDisplayUrl('')).toBe('');
  });
});
