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
  ChevronRight,
} from 'lucide-react';

export const CVTemplateWarmBold: React.FC<CVTemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, educations, skillCategories, projects, achievements, certificates } = data;
  const isDark = theme.darkMode;
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Color preset mapping for Warm Bold style
  const getThemeColors = (preset: string) => {
    switch (preset) {
      case 'teal':
        return {
          accent: 'text-teal-600 dark:text-teal-400',
          accentBg: 'bg-teal-500',
          accentLight: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200 border-teal-200 dark:border-teal-800',
          borderAccent: 'border-teal-500',
          gradientStripe: 'from-teal-500 via-emerald-400 to-teal-400',
          sidebarBg: isDark ? 'bg-slate-950/70' : 'bg-[#F2FBF9]',
          cardHover: 'hover:border-teal-400 dark:hover:border-teal-600',
          dot: 'bg-teal-600 dark:bg-teal-400',
          subRole: 'text-teal-300',
        };
      case 'red':
        return {
          accent: 'text-rose-600 dark:text-rose-400',
          accentBg: 'bg-rose-600',
          accentLight: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border-rose-200 dark:border-rose-800',
          borderAccent: 'border-rose-600',
          gradientStripe: 'from-rose-600 via-red-500 to-amber-500',
          sidebarBg: isDark ? 'bg-slate-950/70' : 'bg-[#FFF8F7]',
          cardHover: 'hover:border-rose-400 dark:hover:border-rose-600',
          dot: 'bg-rose-600 dark:bg-rose-400',
          subRole: 'text-rose-300',
        };
      case 'blue':
        return {
          accent: 'text-blue-600 dark:text-blue-400',
          accentBg: 'bg-blue-600',
          accentLight: 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border-blue-200 dark:border-blue-800',
          borderAccent: 'border-blue-600',
          gradientStripe: 'from-blue-600 via-sky-400 to-indigo-500',
          sidebarBg: isDark ? 'bg-slate-950/70' : 'bg-[#F4F8FD]',
          cardHover: 'hover:border-blue-400 dark:hover:border-blue-600',
          dot: 'bg-blue-600 dark:bg-blue-400',
          subRole: 'text-blue-300',
        };
      case 'purple':
        return {
          accent: 'text-purple-600 dark:text-purple-400',
          accentBg: 'bg-purple-600',
          accentLight: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200 border-purple-200 dark:border-purple-800',
          borderAccent: 'border-purple-600',
          gradientStripe: 'from-purple-600 via-fuchsia-500 to-pink-500',
          sidebarBg: isDark ? 'bg-slate-950/70' : 'bg-[#FAF6FD]',
          cardHover: 'hover:border-purple-400 dark:hover:border-purple-600',
          dot: 'bg-purple-600 dark:bg-purple-400',
          subRole: 'text-purple-300',
        };
      case 'emerald':
        return {
          accent: 'text-emerald-600 dark:text-emerald-400',
          accentBg: 'bg-emerald-600',
          accentLight: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
          borderAccent: 'border-emerald-600',
          gradientStripe: 'from-emerald-600 via-teal-400 to-lime-400',
          sidebarBg: isDark ? 'bg-slate-950/70' : 'bg-[#F2FAF6]',
          cardHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
          dot: 'bg-emerald-600 dark:bg-emerald-400',
          subRole: 'text-emerald-300',
        };
      case 'orange':
      default:
        return {
          accent: 'text-orange-600 dark:text-orange-400',
          accentBg: 'bg-orange-500',
          accentLight: 'bg-orange-50 text-orange-900 dark:bg-orange-950/60 dark:text-orange-200 border-orange-200 dark:border-orange-800',
          borderAccent: 'border-orange-500',
          gradientStripe: 'from-orange-500 via-amber-500 to-orange-400',
          sidebarBg: isDark ? 'bg-slate-950/70' : 'bg-[#FDF8F3]', // Warm Sand
          cardHover: 'hover:border-orange-400 dark:hover:border-orange-600',
          dot: 'bg-orange-500 dark:bg-orange-400',
          subRole: 'text-orange-300',
        };
    }
  };

  const colors = getThemeColors(theme.primaryColorPreset || 'orange');
  const headingFontFamily = `'${theme.fontHeading}', 'Be Vietnam Pro', sans-serif`;

  return (
    <div
      className={`page-a4 mx-auto w-full max-w-[210mm] min-h-[297mm] transition-all duration-300 ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-paper-dark' : 'bg-white text-slate-800 shadow-paper'
      } rounded-2xl overflow-hidden print:rounded-none print:shadow-none print:m-0`}
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      {/* ================= HEADER (Full-bleed Dark Ink with Warm Gradient Stripe) ================= */}
      <header className="bg-slate-900 text-white px-8 py-7 relative shadow-md print:shadow-none">
        {/* Gradient Accent Stripe */}
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradientStripe}`} />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-left">
            {/* Avatar Ring */}
            <div className="relative shrink-0 group">
              <div
                className={`w-24 h-24 rounded-full p-1 border-2 border-dashed ${colors.borderAccent} group-hover:scale-105 transition-transform duration-300`}
              >
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full rounded-full object-cover shadow-inner"
                />
              </div>
            </div>

            {/* Name and Title */}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold uppercase leading-tight text-white tracking-wide"
                style={{ fontFamily: headingFontFamily }}
              >
                {personalInfo.fullName}
              </h1>

              <p
                className={`text-sm sm:text-base font-semibold tracking-wide mt-1.5 ${colors.subRole}`}
                style={{ fontFamily: headingFontFamily }}
              >
                {personalInfo.title}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2.5 text-xs text-slate-300">
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
          </div>

          {/* Quick Contact Chips in Header Right */}
          <div className="flex flex-col gap-2 text-xs text-slate-300 self-center sm:self-start">
            <div
              onClick={() => copyToClipboard(personalInfo.email, 'header-email')}
              className="group flex items-center gap-2 p-1 px-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 cursor-pointer transition-colors"
              title="Nhấn để copy email"
            >
              <Mail className={`w-3.5 h-3.5 shrink-0 ${colors.accent}`} />
              <span className="text-[11.5px] font-medium text-slate-200">{personalInfo.email}</span>
              {copiedItem === 'header-email' ? (
                <Check className="w-3 h-3 text-emerald-400 ml-1" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors ml-1" />
              )}
            </div>

            <a
              href={`tel:${personalInfo.phone}`}
              className="flex items-center gap-2 p-1 px-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
            >
              <Phone className={`w-3.5 h-3.5 shrink-0 ${colors.accent}`} />
              <span className="text-[11.5px] font-medium text-slate-200">{personalInfo.phone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ================= 2-COLUMN BODY: MAIN CONTENT LEFT, WARM SIDEBAR RIGHT ================= */}
      <div className="flex flex-col md:flex-row print:flex-row min-h-[calc(297mm-125px)]">
        {/* ================= LEFT MAIN CONTENT (1fr) ================= */}
        <main className="flex-1 px-8 py-6 space-y-6">
          {/* Summary / Profile */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <Sparkles className={`w-4 h-4 shrink-0 ${colors.accent}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Giới Thiệu Bản Thân
              </h2>
            </div>
            <p className="text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              {summary}
            </p>
          </section>

          {/* Work Experience */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <Briefcase className={`w-4 h-4 shrink-0 ${colors.accent}`} />
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
                  className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1.5 group p-2 -ml-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200 cursor-default"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[5px] top-[14px] w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-150 ${colors.dot}`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3
                      className={`font-bold text-[13px] text-slate-900 dark:text-white group-hover:${colors.accent} transition-colors`}
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

          {/* Featured Projects with warm cards */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <Code2 className={`w-4 h-4 shrink-0 ${colors.accent}`} />
              <h2
                className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
                style={{ fontFamily: headingFontFamily }}
              >
                Dự Án Tiêu Biểu
              </h2>
            </div>

            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 space-y-2 group hover:-translate-y-0.5 hover:shadow-md ${
                    isDark
                      ? 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  } ${colors.cardHover}`}
                >
                  <div className="flex items-center justify-between gap-2">
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
                          className="inline-flex items-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-orange-500 transition-colors shrink-0"
                          title="Xem dự án"
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
                        className={`text-[10px] px-2 py-0.5 font-medium rounded-md ${
                          isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-700'
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
        </main>

        {/* ================= RIGHT SIDEBAR (Warm Sand Background, 240px) ================= */}
        <aside
          className={`w-full md:w-[245px] print:w-[235px] shrink-0 px-6 py-6 space-y-6 text-xs border-l ${
            isDark ? 'border-slate-800' : 'border-slate-200/80'
          } ${colors.sidebarBg}`}
        >
          {/* Social Links & Web */}
          <section className="space-y-3">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.accent} flex items-center gap-1.5`}
              style={{ fontFamily: headingFontFamily }}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>Liên Kết Mạng Xã Hội</span>
            </h2>

            <div className="space-y-2 text-[11.5px]">
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{personalInfo.website.replace('https://', '')}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {personalInfo.github && (
                <a
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Github className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{personalInfo.github}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {personalInfo.linkedin && (
                <a
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{personalInfo.linkedin}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.accent} flex items-center gap-1.5`}
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
                    <div className="text-[10.5px] font-semibold text-orange-700 dark:text-orange-400">
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Breakdown */}
          <section className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.accent} flex items-center gap-1.5`}
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
                        className={`inline-block px-2.5 py-0.5 text-[10.5px] font-medium rounded-md border transition-all duration-150 hover:scale-105 cursor-default ${colors.accentLight}`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications & Achievements */}
          {certificates && certificates.length > 0 && (
            <section className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${colors.accent} flex items-center gap-1.5`}
                style={{ fontFamily: headingFontFamily }}
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Chứng Chỉ & Giải Thưởng</span>
              </h2>

              <div className="space-y-2.5 text-[11px]">
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

                {achievements && achievements.length > 0 && (
                  <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-1.5">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="text-[10.5px]">
                        <span className="font-bold text-slate-900 dark:text-white">★ {ach.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};
