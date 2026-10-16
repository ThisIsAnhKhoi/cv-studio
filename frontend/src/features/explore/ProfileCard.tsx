import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight, CheckCircle, Sparkles, Eye } from 'lucide-react';
import { CVData, CV_CATEGORIES } from '../../types/cv';
import { TEMPLATES_REGISTRY } from '../cv-templates/TemplateRegistry';
import { stripHtml } from '../../utils/text';

interface ProfileCardProps {
  cv: CVData;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ cv }) => {
  const { personalInfo, summary, skillCategories, themeConfig, id, category, viewCount } = cv;

  // Flatten top skills for preview
  const topSkills = skillCategories.flatMap((c) => c.skills.map((s) => s.name)).slice(0, 4);

  // Template metadata
  const templateMeta = TEMPLATES_REGISTRY[themeConfig.templateId] || TEMPLATES_REGISTRY['template-classic-teal'];

  // Category metadata
  const categoryMeta = CV_CATEGORIES.find((c) => c.id === category);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
      {/* Top Header: Avatar + Name + Title + Category Badge */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Avatar with status indicator */}
            <div className="relative shrink-0">
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName}
                className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm group-hover:ring-teal-500/50 transition-all"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.fullName)}&background=0d9488&color=fff&bold=true`;
                }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs"
                title="Đã xác thực hồ sơ"
              >
                <CheckCircle className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            {/* Name & Title */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {personalInfo.fullName}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-teal-700 dark:text-teal-400 line-clamp-1 mt-0.5">
                {personalInfo.title}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Category Badge if present */}
          {categoryMeta && (
            <span
              className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${categoryMeta.colorClass}`}
              title={categoryMeta.label}
            >
              {categoryMeta.shortLabel}
            </span>
          )}
        </div>

        {/* Bio Summary Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mt-3.5">
          {stripHtml(summary)}
        </p>

        {/* Skill Badges */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {topSkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 max-w-[140px] truncate"
              title={skill}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer: Template info + Views + Action button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        {/* Template Badge & Views */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 min-w-0">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span className="truncate max-w-[85px] sm:max-w-[105px]">{templateMeta?.name.split(':')[0]}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300 shrink-0" title="Tổng lượt xem hồ sơ">
            <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{viewCount || 0}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/cv/${id}`}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all group/btn shadow-xs cursor-pointer shrink-0"
        >
          <span>Xem CV</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
export default ProfileCard;
