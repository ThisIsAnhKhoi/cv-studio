import { TemplateMeta } from '../../types/template';
import { CVTemplateClassicTeal } from './template-1/CVTemplateClassicTeal';
import { CVTemplateWarmBold } from './template-2/CVTemplateWarmBold';
import { CVTemplateModernMinimal } from './template-3/CVTemplateModernMinimal';

export const TEMPLATES_REGISTRY: Record<string, TemplateMeta> = {
  'template-classic-teal': {
    id: 'template-classic-teal',
    name: 'Mẫu 1: Classic Editorial (Sidebar Trái)',
    description: 'Bố cục 2 cột hàn lâm, trang trọng và đáng tin cậy. Phù hợp cho giáo dục, công nghệ và quản lý.',
    recommendedRole: 'Giáo dục, Kỹ thuật phần mềm, Quản lý',
    component: CVTemplateClassicTeal,
  },
  'template-warm-bold': {
    id: 'template-warm-bold',
    name: 'Mẫu 2: Warm Bold (Nền Cát & Viền Cam)',
    description: 'Header tối màu Ink viền gradient cam năng động, nội dung chính bên trái, cột cát ấm bên phải. Rất được ưa chuộng trong giới Tech & Startup.',
    recommendedRole: 'Lập trình viên, UI/UX Designer, EdTech',
    component: CVTemplateWarmBold,
  },
  'template-modern-minimal': {
    id: 'template-modern-minimal',
    name: 'Mẫu 3: Modern Minimal (Lưới Cân Đối & Dải Thẻ)',
    description: 'Thiết kế hiện đại thanh lịch, dải liên hệ độc đáo, các khối card bo cong nhẹ nhàng với màu nhấn cá tính.',
    recommendedRole: 'Marketing, Dịch vụ, Kinh doanh, Quản trị',
    component: CVTemplateModernMinimal,
  },
};

export const getTemplateComponent = (templateId: string) => {
  return TEMPLATES_REGISTRY[templateId]?.component || CVTemplateClassicTeal;
};
