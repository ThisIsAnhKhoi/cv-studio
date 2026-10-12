import { TemplateMeta } from '../../types/template';
import { CVTemplateClassicTeal } from './template-1/CVTemplateClassicTeal';

export const TEMPLATES_REGISTRY: Record<string, TemplateMeta> = {
  'template-classic-teal': {
    id: 'template-classic-teal',
    name: 'Classic Editorial Teal (Mẫu Chuẩn 1)',
    description: 'Bố cục 2 cột hàn lâm, trang trọng và đáng tin cậy. Phù hợp cho giáo dục, công nghệ, nghiên cứu và quản lý.',
    recommendedRole: 'Giáo dục, Kỹ thuật phần mềm, Quản lý dự án',
    component: CVTemplateClassicTeal,
  },
};

export const getTemplateComponent = (templateId: string) => {
  return TEMPLATES_REGISTRY[templateId]?.component || CVTemplateClassicTeal;
};
