import { describe, it, expect } from 'vitest';
import { getSectionStyleProperties } from '../styleHelpers';

describe('styleHelpers utility', () => {
  it('should return empty properties if no override or default is provided', () => {
    const props = getSectionStyleProperties('experience');
    expect(props).toEqual({});
  });

  it('should set CSS custom properties when valid custom override is specified', () => {
    const props = getSectionStyleProperties('experience', {
      experience: {
        headingColor: '#0e7c6b',
        textColor: '#2d2d2d',
        accentColor: '#e86c50',
        headingFont: 'montserrat',
        bodyFont: 'inter',
      },
    }) as Record<string, string>;

    expect(props['--sec-heading-color']).toBe('#0E7C6B');
    expect(props['--sec-text-color']).toBe('#2D2D2D');
    expect(props['--sec-accent-color']).toBe('#E86C50');
    expect(props['--sec-heading-font']).toContain('Montserrat');
    expect(props['--sec-body-font']).toContain('Inter');
  });

  it('should ignore invalid hex colors and reject injection attempts', () => {
    const props = getSectionStyleProperties(
      'education',
      {
        education: {
          headingColor: 'invalid; background: red',
        },
      },
      {
        headingColor: '#123456',
      }
    ) as Record<string, string>;

    expect(props['--sec-heading-color']).toBe('#123456');
  });
});
