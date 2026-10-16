import React from 'react';
import { SectionId, SectionStyleConfig } from '../../../types/cv';
import { isValidHexColor, normalizeHexColor } from '../../../utils/color';
import { buildFontFamilyString, ensureFontLoaded } from './fontRegistry';

export interface DefaultSectionStyles {
  headingColor?: string;
  textColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

/**
 * Computes CSS Custom Properties for a specific CV section wrapper.
 * Guarantees that template defaults are preserved when no custom override is specified.
 */
export function getSectionStyleProperties(
  sectionId: SectionId,
  sectionStyles?: Partial<Record<SectionId, SectionStyleConfig>>,
  defaultStyles?: DefaultSectionStyles
): React.CSSProperties {
  const custom = sectionStyles?.[sectionId];

  // Resolve heading color
  const headingColor =
    custom?.headingColor && isValidHexColor(custom.headingColor)
      ? normalizeHexColor(custom.headingColor)
      : defaultStyles?.headingColor;

  // Resolve text color
  const textColor =
    custom?.textColor && isValidHexColor(custom.textColor)
      ? normalizeHexColor(custom.textColor)
      : defaultStyles?.textColor;

  // Resolve accent color
  const accentColor =
    custom?.accentColor && isValidHexColor(custom.accentColor)
      ? normalizeHexColor(custom.accentColor)
      : defaultStyles?.accentColor;

  // Resolve fonts (ensure dynamically loaded if selected)
  let headingFont: string | undefined = undefined;
  if (custom?.headingFont) {
    ensureFontLoaded(custom.headingFont);
    headingFont = buildFontFamilyString(custom.headingFont);
  } else if (defaultStyles?.headingFont) {
    headingFont = buildFontFamilyString(defaultStyles.headingFont);
  }

  let bodyFont: string | undefined = undefined;
  if (custom?.bodyFont) {
    ensureFontLoaded(custom.bodyFont);
    bodyFont = buildFontFamilyString(custom.bodyFont);
  } else if (defaultStyles?.bodyFont) {
    bodyFont = buildFontFamilyString(defaultStyles.bodyFont);
  }

  const styleObj: Record<string, string> = {};

  if (headingColor) styleObj['--sec-heading-color'] = headingColor;
  if (textColor) styleObj['--sec-text-color'] = textColor;
  if (accentColor) styleObj['--sec-accent-color'] = accentColor;
  if (headingFont) styleObj['--sec-heading-font'] = headingFont;
  if (bodyFont) styleObj['--sec-body-font'] = bodyFont;

  return styleObj as React.CSSProperties;
}
