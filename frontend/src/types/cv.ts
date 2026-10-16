export type SocialPlatformId =
  | 'github'
  | 'linkedin'
  | 'facebook'
  | 'twitter'
  | 'behance'
  | 'dribbble'
  | 'youtube'
  | 'tiktok'
  | 'zalo'
  | 'telegram'
  | 'gitlab'
  | 'leetcode'
  | 'figma'
  | 'medium'
  | 'website'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatformId | string;
  url: string;
  label?: string;
}

export interface PersonalInfo {
  avatarUrl: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  birthday?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  socialLinks?: SocialLink[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location?: string;
  descriptions: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillItem {
  name: string;
  level?: number; // 1 to 5
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  description: string;
  techStack: string[];
  link?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export type ColorPreset = 'teal' | 'orange' | 'red' | 'blue' | 'purple' | 'emerald';
export type HeadingFontOption = 'Gilroy' | 'iCiel Cubano' | 'SVN-Optima' | 'Be Vietnam Pro' | 'Montserrat';

export type SectionId =
  | 'header'
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'achievements'
  | 'certificates';

export interface SectionStyleConfig {
  headingColor?: string;
  textColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface ThemeConfig {
  templateId: string;
  primaryColor: string;
  primaryColorPreset: ColorPreset;
  accentColor: string;
  fontHeading: HeadingFontOption;
  fontBody: 'Be Vietnam Pro' | 'Gilroy' | 'Montserrat';
  darkMode: boolean;
  schemaVersion?: number;
  sectionStyles?: Partial<Record<SectionId, SectionStyleConfig>>;
}

export type CVCategory =
  | 'tech'
  | 'design'
  | 'data-ai'
  | 'marketing'
  | 'business'
  | 'hr'
  | 'other';

export interface CVCategoryMeta {
  id: CVCategory;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  colorClass: string;
}

export const CV_CATEGORIES: CVCategoryMeta[] = [
  {
    id: 'tech',
    label: 'Công Nghệ Thông Tin & Phần Mềm',
    shortLabel: 'CNTT & Phần mềm',
    description: 'Kỹ sư phần mềm, lập trình viên Web/Mobile, DevOps, Cloud',
    iconName: 'Code',
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'design',
    label: 'Thiết Kế Sáng Tạo & UI/UX',
    shortLabel: 'Thiết kế & UI/UX',
    description: 'UI/UX Designer, Graphic Designer, Product Designer, 3D',
    iconName: 'Palette',
    colorClass: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'data-ai',
    label: 'Dữ Liệu, AI & Khoa Học Máy Tính',
    shortLabel: 'Dữ liệu & AI',
    description: 'Data Analyst, Data Engineer, Machine Learning, Data Science',
    iconName: 'BrainCircuit',
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'marketing',
    label: 'Tiếp Thị, Truyền Thông & Nội Dung',
    shortLabel: 'Marketing & Media',
    description: 'Digital Marketing, Content Creator, SEO, Brand Manager',
    iconName: 'TrendingUp',
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    id: 'business',
    label: 'Kinh Doanh, Bán Hàng & Tài Chính',
    shortLabel: 'Kinh doanh & Tài chính',
    description: 'Business Development, Sales, Financial Analyst, Account',
    iconName: 'Briefcase',
    colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    id: 'hr',
    label: 'Nhân Sự, Quản Trị & Vận Hành',
    shortLabel: 'Nhân sự & Vận hành',
    description: 'HR Generalist, Talent Acquisition, Operations Manager',
    iconName: 'Users',
    colorClass: 'text-rose-600 bg-rose-50 border-rose-200'
  },
  {
    id: 'other',
    label: 'Lĩnh Vực Khác',
    shortLabel: 'Lĩnh vực khác',
    description: 'Giáo dục, Y tế, Dịch thuật, Pháp lý và các ngành nghề khác',
    iconName: 'Layers',
    colorClass: 'text-slate-600 bg-slate-50 border-slate-200'
  }
];

export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'disabled';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  disabledReason?: string;
  disabledAt?: string;
  disabledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminActionType =
  | 'LOCK_USER'
  | 'UNLOCK_USER'
  | 'DISABLE_CV'
  | 'RESTORE_CV'
  | 'CHANGE_ROLE';

export interface AuditLogEntry {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: AdminActionType;
  targetType: 'user' | 'cv';
  targetId: string;
  reason: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface CVData {
  id: string;
  userId: string;
  slug: string;
  isPublic: boolean;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  certificates: CertificateItem[];
  themeConfig: ThemeConfig;
  createdAt: string;
  updatedAt: string;

  // Trường mở rộng v0.4.0 (RBAC, Moderation, View Counter & Category Discovery)
  viewCount?: number;
  status?: 'active' | 'disabled';
  ownerDisabled?: boolean;
  category?: CVCategory;
  disabledReason?: string;
  disabledAt?: string;
  disabledBy?: string;
}
