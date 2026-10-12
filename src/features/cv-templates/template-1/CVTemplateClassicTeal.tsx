import React from 'react';
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
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const CVTemplateClassicTeal: React.FC<CVTemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, educations, skillCategories, projects, achievements, certificates } = data;
  const isDark = theme.darkMode;

  // Preset color definitions
  const getColorClasses = (preset: string) => {
    switch (preset) {
      case 'orange':
        return {
          headerBg: 'bg-orange-600',
          accentBorder: 'border-amber-400',
          sectionAccent: 'text-orange-600 dark:text-orange-400',
          badgeBg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
          dotBg: 'bg-orange-600 dark:bg-orange-400',
        };
      case 'red':
        return {
          headerBg: 'bg-red-700',
          accentBorder: 'border-rose-400',
          sectionAccent: 'text-red-700 dark:text-red-400',
          badgeBg: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800',
          dotBg: 'bg-red-700 dark:bg-red-400',
        };
      case 'blue':
        return {
          headerBg: 'bg-blue-700',
          accentBorder: 'border-sky-400',
          sectionAccent: 'text-blue-700 dark:text-blue-400',
          badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          dotBg: 'bg-blue-700 dark:bg-blue-400',
        };
      case 'purple':
        return {
          headerBg: 'bg-purple-700',
          accentBorder: 'border-fuchsia-400',
          sectionAccent: 'text-purple-700 dark:text-purple-400',
          badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          dotBg: 'bg-purple-700 dark:bg-purple-400',
        };
      case 'emerald':
        return {
          headerBg: 'bg-emerald-700',
          accentBorder: 'border-teal-300',
          sectionAccent: 'text-emerald-700 dark:text-emerald-400',
          badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dotBg: 'bg-emerald-700 dark:bg-emerald-400',
        };
      case 'teal':
      default:
        return {
          headerBg: 'bg-[#0E7C6B]',
          accentBorder: 'border-[#E86C50]',
          sectionAccent: 'text-[#0E7C6B] dark:text-teal-400',
          badgeBg: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          dotBg: 'bg-[#0E7C6B] dark:bg-teal-400',
        };
    }
  };

  const colors = getColorClasses(theme.primaryColorPreset || 'teal');

  return (
    <div
      className={`page-a4 mx-auto w-full max-w-[210mm] min-h-[297mm] transition-all duration-300 ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-paper-dark' : 'bg-white text-slate-800 shadow-paper'
      } rounded-xl overflow-hidden print:rounded-none print:shadow-none print:m-0`}
      style={{
        fontFamily: theme.fontBody === 'Outfit' ? 'Outfit, sans-serif' : '"Be Vietnam Pro", sans-serif',
      }}
    >
      {/* ================= HEADER (Spans full width) ================= */}
      <header className={`${colors.headerBg} text-white px-8 py-7 relative flex items-center gap-6 shadow-md print:shadow-none`}>
        {/* Accent Stripe at bottom of header */}
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${colors.accentBorder.replace('border-', 'bg-')}`} />

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-md"
          />
          <div className="absolute inset-0 rounded-full ring-2 ring-white/50 pointer-events-none" />
        </div>

        {/* Name & Title */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase leading-tight font-display text-white drop-shadow-sm"
            style={{
              fontFamily: theme.fontHeading === 'Outfit' ? 'Outfit, sans-serif' : 'inherit',
            }}
          >
            {personalInfo.fullName}
          </h1>
          <p className="text-sm sm:text-base text-white/90 font-medium tracking-wide mt-1 flex items-center gap-2">
            <span>{personalInfo.title}</span>
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {personalInfo.location}
            </span>
            {personalInfo.birthday && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {personalInfo.birthday}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2-COLUMN BODY GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] print:grid-cols-[200px_1fr] min-h-[calc(297mm-125px)]">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside
          className={`px-5 py-6 space-y-6 text-xs border-r ${
            isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50/80 border-slate-200 text-slate-600'
          }`}
        >
          {/* Contact Details */}
          <section className="space-y-3">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}>
              <Mail className="w-3.5 h-3.5" />
              <span>Liên Hệ</span>
            </h2>
            <div className="space-y-2.5 text-[11.5px]">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-start gap-2 hover:underline break-all group"
              >
                <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current mt-0.5" />
                <span>{personalInfo.email}</span>
              </a>
              <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:underline group">
                <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                <span>{personalInfo.phone}</span>
              </a>
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:underline group break-all"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                  <span>{personalInfo.website.replace('https://', '')}</span>
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:underline group break-all"
                >
                  <Github className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                  <span>{personalInfo.github}</span>
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={`https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:underline group break-all"
                >
                  <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                  <span>{personalInfo.linkedin}</span>
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}>
              <GraduationCap className="w-4 h-4" />
              <span>Học Vấn</span>
            </h2>
            <div className="space-y-3.5">
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="font-bold text-[12px] text-slate-900 dark:text-white leading-tight">
                    {edu.school}
                  </div>
                  <div className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                    {edu.degree}
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400">
                    {edu.startDate} – {edu.endDate}
                  </div>
                  {edu.gpa && (
                    <div className="text-[10.5px] font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
                      {edu.gpa}
                    </div>
                  )}
                  {edu.honors && (
                    <div className="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                      {edu.honors}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Breakdown */}
          <section className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}>
              <Code2 className="w-4 h-4" />
              <span>Kỹ Năng</span>
            </h2>
            <div className="space-y-3">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                    {cat.categoryName}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`inline-block px-2 py-0.5 text-[10.5px] font-medium rounded border ${colors.badgeBg}`}
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
              <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}>
                <Award className="w-3.5 h-3.5" />
                <span>Chứng Chỉ</span>
              </h2>
              <div className="space-y-2 text-[11px]">
                {certificates.map((cert) => (
                  <div key={cert.id} className="space-y-0.5">
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
        <main className="px-7 py-6 space-y-6">
          {/* Summary / About Me */}
          <section className="space-y-2">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}>
              <span>Giới Thiệu Bản Thân</span>
            </h2>
            <p className="text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              {summary}
            </p>
          </section>

          {/* Work Experience */}
          <section className="space-y-3">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}>
              <Briefcase className="w-4 h-4" />
              <span>Kinh Nghiệm Làm Việc</span>
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-3.5 border-l-2 border-slate-200 dark:border-slate-700 space-y-1.5">
                  {/* Dot on timeline */}
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${colors.dotBg}`} />

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <h3 className="font-bold text-[13px] text-slate-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
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

          {/* Featured Projects */}
          <section className="space-y-3">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}>
              <Code2 className="w-4 h-4" />
              <span>Dự Án Tiêu Biểu</span>
            </h2>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3 rounded-lg border ${
                    isDark
                      ? 'bg-slate-800/40 border-slate-700/70 hover:border-slate-600'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  } transition-colors space-y-1.5`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-[12.5px] text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{proj.name}</span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-current transition-colors"
                          title="Xem dự án"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </h3>
                    <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 italic shrink-0">
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
                        className={`text-[10px] px-2 py-0.5 font-medium rounded ${
                          isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-200/80 text-slate-700'
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
              <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800`}>
                <Award className="w-4 h-4" />
                <span>Thành Tựu & Giải Thưởng</span>
              </h2>
              <div className="space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2 text-[11.5px]">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colors.sectionAccent}`} />
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
