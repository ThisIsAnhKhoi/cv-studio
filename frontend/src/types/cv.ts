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

export interface ThemeConfig {
  templateId: string;
  primaryColor: string;
  primaryColorPreset: ColorPreset;
  accentColor: string;
  fontHeading: HeadingFontOption;
  fontBody: 'Be Vietnam Pro' | 'Gilroy' | 'Montserrat';
  darkMode: boolean;
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
}
