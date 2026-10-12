import React from 'react';
import { CVData, ThemeConfig } from './cv';

export interface CVTemplateProps {
  data: CVData;
  theme: ThemeConfig;
  isPrintMode?: boolean;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  recommendedRole: string;
  component: React.ComponentType<CVTemplateProps>;
}
