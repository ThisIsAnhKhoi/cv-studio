import React, { useState } from 'react';
import { CVTemplateProps } from '../../../types/template';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  ExternalLink,
  Copy,
  Check,
  User,
  Star,
} from 'lucide-react';

export const CVTemplateModernMinimal: React.FC<CVTemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, educations, skillCategories, projects, achievements, certificates } = data;
  const isDark = theme.darkMode;
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Color preset mapping for Modern Minimal style
  const getThemeColors = (preset: string) => {
    switch (preset) {
      case 'orange':
        return {
          primary: 'text-orange-600 dark:text-orange-400',
          bgAccent: 'bg-orange-600',
          borderAccent: 'border-orange-500',
          lightBadge: 'bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
          hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-600',
          tagBg: 'bg-orange-100/70 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200',
          iconBg: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
        };
      case 'teal':
        return {
          primary: 'text-teal-600 dark:text-teal-400',
          bgAccent: 'bg-teal-600',
          borderAccent: 'border-teal-500',
          lightBadge: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-600',
          tagBg: 'bg-teal-100/70 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200',
          iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
        };
      case 'blue':
        return {
          primary: 'text-blue-600 dark:text-blue-400',
          bgAccent: 'bg-blue-600',
          borderAccent: 'border-blue-500',
          lightBadge: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
          tagBg: 'bg-blue-100/70 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200',
          iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
        };
      case 'purple':
        return {
          primary: 'text-purple-600 dark:text-purple-400',
          bgAccent: 'bg-purple-600',
          borderAccent: 'border-purple-500',
          lightBadge: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
          tagBg: 'bg-purple-100/70 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200',
          iconBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
        };
      case 'emerald':
        return {
          primary: 'text-emerald-600 dark:text-emerald-400',
          bgAccent: 'bg-emerald-600',
          borderAccent: 'border-emerald-500',
          lightBadge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
          tagBg: 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
          iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
        };
      case 'red':
      default:
        return {
          primary: 'text-[#D92D20] dark:text-rose-400',
          bgAccent: 'bg-[#D92D20]',
          borderAccent: 'border-[#D92D20]',
          lightBadge: 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800',
          hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-600',
          tagBg: 'bg-red-100/70 text-red-900 dark:bg-red-900/40 dark:text-red-200',
          iconBg: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
        };
    }
  };

  const colors = getThemeColors(theme.primaryColorPreset || 'red');
  const headingFontFamily = `'${theme.fontHeading}', 'Be Vietnam Pro', sans-serif`;

  return (
    <div
      className={`page-a4 mx-auto w-full max-w-[210mm] min-h-[297mm] transition-all duration-300 ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-paper-dark' : 'bg-white text-slate-800 shadow-paper'
      } rounded-2xl overflow-hidden print:rounded-none print:shadow-none print:m-0`}
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      {/* ================= TOP MODERN HEADER ================= */}
      <header className="p-8 pb-6 border-b border-slate-200/90 dark:border-slate-800 relative">
        {/* Subtle Top Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.bgAccent}`} />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-left">
            {/* Avatar with Double Ring */}
            <div className="relative shrink-0 group">
              <div
                className={`w-24 h-24 rounded-full p-1 border-2 ${colors.borderAccent} shadow-sm group-hover:scale-105 transition-transform duration-300`}
              >
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Name, Title, Bio Tagline */}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-slate-900 dark:text-white tracking-wide"
                style={{ fontFamily: headingFontFamily }}
              >
                {personalInfo.fullName}
              </h1>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                <span
                  className={`text-sm sm:text-base font-bold tracking-wide ${colors.primary}`}
                  style={{ fontFamily: headingFontFamily }}
                >
                  {personalInfo.title}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {personalInfo.location}
                </span>
              </div>

              {/* Bio summary crisp */}
              <p className="text-[12px] text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Strip Banner */}
        <div className="mt-5 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div
            onClick={() => copyToClipboard(personalInfo.email, 'min-email')}
            className="flex items-center gap-2 group cursor-pointer hover:text-red-600 transition-colors"
            title="Nhấn để sao chép email"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
              <Mail className="w-3 h-3 shrink-0" />
            </div>
            <span className="font-medium text-[11.5px] text-slate-700 dark:text-slate-300">{personalInfo.email}</span>
            {copiedItem === 'min-email' ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          <a
            href={`tel:${personalInfo.phone}`}
            className="flex items-center gap-2 hover:text-red-600 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
              <Phone className="w-3 h-3 shrink-0" />
            </div>
            <span className="font-medium text-[11.5px] text-slate-700 dark:text-slate-300">{personalInfo.phone}</span>
          </a>

          {personalInfo.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
                <Globe className="w-3 h-3 shrink-0" />
              </div>
              <span className="font-medium text-[11.5px] text-slate-700 dark:text-slate-300">{personalInfo.website.replace('https://', '')}</span>
            </a>
          )}

          {personalInfo.github && (
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-red-600 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
                <Github className="w-3 h-3 shrink-0" />
              </div>
              <span className="font-medium text-[11.5px] text-slate-700 dark:text-slate-300">{personalInfo.github}</span>
            </a>
          )}
        </div>
      </header>

      {/* ================= 2-COLUMN BALANCED BODY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] print:grid-cols-[1.1fr_0.9fr] gap-7 p-8 py-6 min-h-[calc(297mm-165px)]">
        {/* ================= COLUMN 1: EXPERIENCES & PROJECTS ================= */}
        <div className="space-y-6">
          {/* Work Experience */}
          <section className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b-2 border-slate-900 dark:border-white">
              <Briefcase className={`w-4 h-4 shrink-0 ${colors.primary}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Kinh Nghiệm Làm Việc
              </h2>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="space-y-1.5 p-2 -mx-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3
                      className="font-bold text-[13px] text-slate-900 dark:text-white"
                      style={{ fontFamily: headingFontFamily }}
                    >
                      {exp.position}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>

                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span>{exp.company}</span>
                    {exp.location && <span className="text-slate-400 font-normal">• {exp.location}</span>}
                  </div>

                  <ul className="space-y-1 text-[11.5px] text-slate-600 dark:text-slate-300 list-disc list-outside pl-4 leading-relaxed">
                    {exp.descriptions.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b-2 border-slate-900 dark:border-white">
              <Code2 className={`w-4 h-4 shrink-0 ${colors.primary}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Dự Án Nổi Bật
              </h2>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-sm transition-all space-y-1.5 ${colors.hoverBorder}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className="font-bold text-[12.5px] text-slate-900 dark:text-white truncate"
                        style={{ fontFamily: headingFontFamily }}
                      >
                        {proj.name}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>
                    <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 italic shrink-0">
                      {proj.role}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 font-medium rounded-full ${colors.tagBg}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ================= COLUMN 2: SKILLS, EDUCATION, AWARDS ================= */}
        <div className="space-y-6">
          {/* Skills Breakdown */}
          <section className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b-2 border-slate-900 dark:border-white">
              <Code2 className={`w-4 h-4 shrink-0 ${colors.primary}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Kỹ Năng Chuyên Môn
              </h2>
            </div>

            <div className="space-y-3">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div
                    className="font-semibold text-[11px] text-slate-800 dark:text-slate-200"
                    style={{ fontFamily: headingFontFamily }}
                  >
                    {cat.categoryName}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full border transition-all hover:scale-105 cursor-default ${colors.lightBadge}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b-2 border-slate-900 dark:border-white">
              <GraduationCap className={`w-4 h-4 shrink-0 ${colors.primary}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Học Vấn & Bằng Cấp
              </h2>
            </div>

            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-1 p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div
                    className="font-bold text-[12.5px] text-slate-900 dark:text-white leading-tight"
                    style={{ fontFamily: headingFontFamily }}
                  >
                    {edu.school}
                  </div>
                  <div className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    {edu.degree}
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>{edu.startDate} – {edu.endDate}</span>
                    {edu.gpa && <span className="font-semibold text-red-600 dark:text-rose-400">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Awards & Certifications */}
          <section className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b-2 border-slate-900 dark:border-white">
              <Award className={`w-4 h-4 shrink-0 ${colors.primary}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Thành Tựu & Chứng Chỉ
              </h2>
            </div>

            <div className="space-y-2 text-[11px]">
              {achievements &&
                achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <Star className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colors.primary}`} />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{ach.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {ach.issuer} ({ach.year})
                      </div>
                    </div>
                  </div>
                ))}

              {certificates &&
                certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <Award className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{cert.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {cert.issuer} ({cert.issueDate})
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
