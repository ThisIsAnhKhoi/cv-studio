import React from 'react';
import { PersonalInfo } from '../../../../types/cv';
import { User, Mail, Phone, MapPin, Calendar, Globe, Github, Linkedin, Image } from 'lucide-react';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Avatar Preview & URL */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <img
          src={personalInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt="Avatar Preview"
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-teal-500/30 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Đường dẫn ảnh đại diện (URL)
          </label>
          <div className="relative">
            <Image className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.avatarUrl}
              onChange={(e) => onChange('avatarUrl', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Name & Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Họ và Tên *
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Chức Danh / Vị Trí *
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Senior Full-stack Developer"
            className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Liên Hệ
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="email@example.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Số Điện Thoại
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="0912 345 678"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Location & Birthday */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Địa Chỉ / Tỉnh Thành
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Quận 1, TP. Hồ Chí Minh"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ngày Sinh
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.birthday || ''}
              onChange={(e) => onChange('birthday', e.target.value)}
              placeholder="15/08/2000"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Links: Website, GitHub, LinkedIn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Website Cá Nhân
          </label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://portfolio.dev"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            GitHub
          </label>
          <div className="relative">
            <Github className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.github || ''}
              onChange={(e) => onChange('github', e.target.value)}
              placeholder="github.com/username"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            LinkedIn
          </label>
          <div className="relative">
            <Linkedin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={personalInfo.linkedin || ''}
              onChange={(e) => onChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalInfoSection;
