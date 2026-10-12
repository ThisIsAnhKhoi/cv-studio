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
  Sparkles,
} from 'lucide-react';

export const CVTemplateClassicTeal: React.FC<CVTemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, educations, skillCategories, projects, achievements, certificates } = data;
  const isDark = theme.darkMode;
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Preset color definitions
  const getColorClasses = (preset: string) => {
    switch (preset) {
      case 'orange':
        return {
          headerBg: 'bg-gradient-to-r from-orange-600 to-amber-600',
          accentBorder: 'bg-amber-400',
          sectionAccent: 'text-orange-600 dark:text-orange-400',
          badgeBg: 'bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200 border-orange-200 dark:border-orange-800 hover:border-orange-400',
          dotBg: 'bg-orange-600 dark:bg-orange-400',
          hoverCardBorder: 'hover:border-orange-400 dark:hover:border-orange-600',
        };
      case 'red':
        return {
          headerBg: 'bg-gradient-to-r from-red-700 to-rose-600',
          accentBorder: 'bg-rose-400',
          sectionAccent: 'text-red-700 dark:text-red-400',
          badgeBg: 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-200 border-red-200 dark:border-red-800 hover:border-red-400',
          dotBg: 'bg-red-700 dark:bg-red-400',
          hoverCardBorder: 'hover:border-red-400 dark:hover:border-red-600',
        };
      case 'blue':
        return {
          headerBg: 'bg-gradient-to-r from-blue-700 to-indigo-600',
          accentBorder: 'bg-sky-400',
          sectionAccent: 'text-blue-700 dark:text-blue-400',
          badgeBg: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border-blue-200 dark:border-blue-800 hover:border-blue-400',
          dotBg: 'bg-blue-700 dark:bg-blue-400',
          hoverCardBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
        };
      case 'purple':
        return {
          headerBg: 'bg-gradient-to-r from-purple-700 to-violet-600',
          accentBorder: 'bg-fuchsia-400',
          sectionAccent: 'text-purple-700 dark:text-purple-400',
          badgeBg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200 border-purple-200 dark:border-purple-800 hover:border-purple-400',
          dotBg: 'bg-purple-700 dark:bg-purple-400',
          hoverCardBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
        };
      case 'emerald':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-700 to-teal-600',
          accentBorder: 'bg-emerald-300',
          sectionAccent: 'text-emerald-700 dark:text-emerald-400',
          badgeBg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400',
          dotBg: 'bg-emerald-700 dark:bg-emerald-400',
          hoverCardBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
        };
      case 'teal':
      default:
        return {
          headerBg: 'bg-gradient-to-r from-[#0E7C6B] to-[#0A6456]',
          accentBorder: 'bg-[#E86C50]',
          sectionAccent: 'text-[#0E7C6B] dark:text-teal-400',
          badgeBg: 'bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 border-teal-200 dark:border-teal-800 hover:border-teal-400',
          dotBg: 'bg-[#0E7C6B] dark:bg-teal-400',
          hoverCardBorder: 'hover:border-teal-400 dark:hover:border-teal-600',
        };
    }
  };

  const colors = getColorClasses(theme.primaryColorPreset || 'teal');

  // Direct CSS inline style ensures 100% reliable font application across all headings
  const headingFontFamily = `'${theme.fontHeading}', 'Be Vietnam Pro', sans-serif`;

  return (
    <div
      className={`page-a4 mx-auto w-full max-w-[210mm] min-h-[297mm] transition-all duration-300 ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-paper-dark' : 'bg-white text-slate-800 shadow-paper'
      } rounded-2xl overflow-hidden print:rounded-none print:shadow-none print:m-0`}
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      {/* ================= HEADER (Spans full width) ================= */}
      <header className={`${colors.headerBg} text-white px-8 py-7 relative flex items-center gap-6 shadow-md print:shadow-none`}>
        {/* Accent Stripe at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${colors.accentBorder}`} />

        {/* Avatar with hover effect */}
        <div className="relative shrink-0 group">
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 rounded-full ring-2 ring-white/50 pointer-events-none" />
        </div>

        {/* Name & Title */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-white drop-shadow-sm tracking-wide"
            style={{ fontFamily: headingFontFamily }}
          >
            {personalInfo.fullName}
          </h1>

          <p
            className="text-sm sm:text-base text-white/95 font-medium tracking-wide mt-1.5 flex items-center gap-2"
            style={{ fontFamily: headingFontFamily }}
          >
            <span>{personalInfo.title}</span>
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{personalInfo.location}</span>
            </span>
            {personalInfo.birthday && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{personalInfo.birthday}</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2-COLUMN BODY GRID (245px sidebar + 1fr main) ================= */}
      <div className="flex flex-col md:flex-row print:flex-row min-h-[calc(297mm-125px)]">
        {/* ================= LEFT SIDEBAR (Width 245px) ================= */}
        <aside
          className={`w-full md:w-[245px] print:w-[235px] shrink-0 px-6 py-6 space-y-6 text-xs border-r ${
            isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-slate-50/90 border-slate-200 text-slate-600'
          }`}
        >
          {/* Contact Details with Interactive Click-to-Copy */}
          <section className="space-y-3">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
              style={{ fontFamily: headingFontFamily }}
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>Thông Tin Liên Hệ</span>
            </h2>

            <div className="space-y-2 text-[11.5px]">
              {/* Email */}
              <div
                onClick={() => copyToClipboard(personalInfo.email, 'email')}
                className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                title="Nhấn để sao chép email"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
                <span className="shrink-0 text-[10px] text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                  {copiedItem === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </span>
              </div>

              {/* Phone */}
              <a
                href={`tel:${personalInfo.phone}`}
                className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                title="Gọi điện thoại"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                  <span>{personalInfo.phone}</span>
                </div>
              </a>

              {/* Website */}
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                  title="Mở website"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{personalInfo.website.replace('https://', '')}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </a>
              )}

              {/* GitHub */}
              {personalInfo.github && (
                <a
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Github className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{personalInfo.github}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </a>
              )}

              {/* LinkedIn */}
              {personalInfo.linkedin && (
                <a
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{personalInfo.linkedin}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
              style={{ fontFamily: headingFontFamily }}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Học Vấn</span>
            </h2>

            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-1 group hover:translate-x-1 transition-transform">
                  <div
                    className="font-bold text-[12px] text-slate-900 dark:text-white leading-tight"
                    style={{ fontFamily: headingFontFamily }}
                  >
                    {edu.school}
                  </div>
                  <div className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    {edu.degree}
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {edu.gpa && (
                    <div className="text-[10.5px] font-semibold text-teal-700 dark:text-teal-400">
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Breakdown */}
          <section className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
              style={{ fontFamily: headingFontFamily }}
            >
              <Code2 className="w-4 h-4 shrink-0" />
              <span>Kỹ Năng</span>
            </h2>

            <div className="space-y-3.5">
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
                        className={`inline-block px-2 py-0.5 text-[10.5px] font-medium rounded-md border transition-all duration-150 hover:scale-105 hover:shadow-xs cursor-default ${colors.badgeBg}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {certificates && certificates.length > 0 && (
            <section className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
                style={{ fontFamily: headingFontFamily }}
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Chứng Chỉ</span>
              </h2>

              <div className="space-y-2 text-[11px]">
                {certificates.map((cert) => (
                  <div key={cert.id} className="space-y-0.5 group hover:translate-x-1 transition-transform">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {cert.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                      <span>{cert.issuer}</span>
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <main className="flex-1 px-8 py-6 space-y-6">
          {/* Summary / About Me */}
          <section className="space-y-2">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}
              style={{ fontFamily: headingFontFamily }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Giới Thiệu Bản Thân</span>
            </h2>
            <p className="text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              {summary}
            </p>
          </section>

          {/* Work Experience */}
          <section className="space-y-3">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}
              style={{ fontFamily: headingFontFamily }}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Kinh Nghiệm Làm Việc</span>
            </h2>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1.5 group p-2 -ml-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200 cursor-default"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[5px] top-[14px] w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-150 ${colors.dotBg}`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3
                      className="font-bold text-[13px] text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors"
                      style={{ fontFamily: headingFontFamily }}
                    >
                      {exp.position}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>

                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                    {exp.company}
                    {exp.location && <span className="text-slate-400 font-normal"> • {exp.location}</span>}
                  </div>

                  <ul className="space-y-1 text-[12px] text-slate-600 dark:text-slate-300 list-disc list-outside pl-4 leading-relaxed">
                    {exp.descriptions.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Projects with Perfectly Aligned Icon & Card Hover */}
          <section className="space-y-3">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}
              style={{ fontFamily: headingFontFamily }}
            >
              <Code2 className="w-4 h-4 shrink-0" />
              <span>Dự Án Tiêu Biểu</span>
            </h2>

            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 space-y-2 group hover:-translate-y-0.5 hover:shadow-md ${
                    isDark
                      ? 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  } ${colors.hoverCardBorder}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Aligned Title with perfectly inline Icon */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className="font-bold text-[13px] text-slate-900 dark:text-white truncate"
                        style={{ fontFamily: headingFontFamily }}
                      >
                        {proj.name}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shrink-0"
                          title="Xem dự án trực tuyến"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic shrink-0">
                      {proj.role}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 font-medium rounded-md transition-colors ${
                          isDark ? 'bg-slate-700/70 text-slate-300' : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements & Awards */}
          {achievements && achievements.length > 0 && (
            <section className="space-y-2.5">
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}
                style={{ fontFamily: headingFontFamily }}
              >
                <Award className="w-4 h-4 shrink-0" />
                <span>Thành Tựu Nổi Bật</span>
              </h2>

              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2.5 text-[11.5px] group hover:translate-x-1 transition-transform">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${colors.dotBg}`} />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{ach.title}</span>
                      <span className="text-slate-500 dark:text-slate-400"> ({ach.issuer}, {ach.year})</span>
                      {ach.description && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{ach.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
