import React, { useState } from 'react';
import { CVTemplateProps } from '../../../types/template';
import { formatSafeUrl, cleanDisplayUrl } from '../../../utils/url';
import { getSectionStyleProperties } from '../../cv-editor/utils/styleHelpers';
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
  Star,
} from 'lucide-react';

export const CVTemplateModernMinimal: React.FC<CVTemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, educations, skillCategories, projects, achievements, certificates } = data;
  const isDark = Boolean(theme.darkMode);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Color preset mapping strictly conditioned on isDark
  const getThemeColors = (preset: string, dark: boolean) => {
    switch (preset) {
      case 'orange':
        return {
          primary: dark ? 'text-orange-400' : 'text-orange-600',
          bgAccent: 'bg-orange-600',
          borderAccent: 'border-orange-500',
          lightBadge: dark
            ? 'bg-orange-950/60 text-orange-200 border-orange-800'
            : 'bg-orange-50 text-orange-800 border-orange-200',
          hoverBorder: dark ? 'hover:border-orange-500' : 'hover:border-orange-400',
          tagBg: dark ? 'bg-orange-900/40 text-orange-200' : 'bg-orange-100/70 text-orange-900',
          iconBg: dark ? 'bg-orange-950 text-orange-300' : 'bg-orange-100 text-orange-700',
        };
      case 'teal':
        return {
          primary: dark ? 'text-teal-400' : 'text-teal-600',
          bgAccent: 'bg-teal-600',
          borderAccent: 'border-teal-500',
          lightBadge: dark
            ? 'bg-teal-950/60 text-teal-200 border-teal-800'
            : 'bg-teal-50 text-teal-800 border-teal-200',
          hoverBorder: dark ? 'hover:border-teal-500' : 'hover:border-teal-400',
          tagBg: dark ? 'bg-teal-900/40 text-teal-200' : 'bg-teal-100/70 text-teal-900',
          iconBg: dark ? 'bg-teal-950 text-teal-300' : 'bg-teal-100 text-teal-700',
        };
      case 'blue':
        return {
          primary: dark ? 'text-blue-400' : 'text-blue-600',
          bgAccent: 'bg-blue-600',
          borderAccent: 'border-blue-500',
          lightBadge: dark
            ? 'bg-blue-950/60 text-blue-200 border-blue-800'
            : 'bg-blue-50 text-blue-800 border-blue-200',
          hoverBorder: dark ? 'hover:border-blue-500' : 'hover:border-blue-400',
          tagBg: dark ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-100/70 text-blue-900',
          iconBg: dark ? 'bg-blue-950 text-blue-300' : 'bg-blue-100 text-blue-700',
        };
      case 'purple':
        return {
          primary: dark ? 'text-purple-400' : 'text-purple-600',
          bgAccent: 'bg-purple-600',
          borderAccent: 'border-purple-500',
          lightBadge: dark
            ? 'bg-purple-950/60 text-purple-200 border-purple-800'
            : 'bg-purple-50 text-purple-800 border-purple-200',
          hoverBorder: dark ? 'hover:border-purple-500' : 'hover:border-purple-400',
          tagBg: dark ? 'bg-purple-900/40 text-purple-200' : 'bg-purple-100/70 text-purple-900',
          iconBg: dark ? 'bg-purple-950 text-purple-300' : 'bg-purple-100 text-purple-700',
        };
      case 'emerald':
        return {
          primary: dark ? 'text-emerald-400' : 'text-emerald-600',
          bgAccent: 'bg-emerald-600',
          borderAccent: 'border-emerald-500',
          lightBadge: dark
            ? 'bg-emerald-950/60 text-emerald-200 border-emerald-800'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200',
          hoverBorder: dark ? 'hover:border-emerald-500' : 'hover:border-emerald-400',
          tagBg: dark ? 'bg-emerald-900/40 text-emerald-200' : 'bg-emerald-100/70 text-emerald-900',
          iconBg: dark ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
        };
      case 'red':
      default:
        return {
          primary: dark ? 'text-rose-400' : 'text-[#D92D20]',
          bgAccent: 'bg-[#D92D20]',
          borderAccent: 'border-[#D92D20]',
          lightBadge: dark
            ? 'bg-red-950/60 text-red-200 border-red-800'
            : 'bg-red-50 text-red-800 border-red-200',
          hoverBorder: dark ? 'hover:border-rose-500' : 'hover:border-rose-400',
          tagBg: dark ? 'bg-red-900/40 text-red-200' : 'bg-red-100/70 text-red-900',
          iconBg: dark ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-700',
        };
    }
  };

  const colors = getThemeColors(theme.primaryColorPreset || 'red', isDark);

  // Surface and typography tokens strictly bound to isDark
  const tc = {
    title: isDark ? 'text-white' : 'text-slate-900',
    subtitle: isDark ? 'text-slate-200' : 'text-slate-800',
    body: isDark ? 'text-slate-300' : 'text-slate-700',
    bodyMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    meta: isDark ? 'text-slate-400' : 'text-slate-500',
    border: isDark ? 'border-slate-800' : 'border-slate-200/90',
    borderStrong: isDark ? 'border-white' : 'border-slate-900',
    hoverRow: isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50',
    cardBorder: isDark ? 'border-slate-800' : 'border-slate-200',
    tagPill: isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600',
    gpaColor: isDark ? 'text-rose-400' : 'text-red-600',
  };

  const headingFontFamily = `'${theme.fontHeading}', 'Be Vietnam Pro', sans-serif`;

  return (
    <div
      className={`page-a4 mx-auto w-full max-w-[210mm] min-h-[297mm] transition-all duration-300 ${
        isDark ? 'bg-slate-900 text-slate-100 shadow-paper-dark' : 'bg-white text-slate-800 shadow-paper'
      } rounded-2xl overflow-hidden print:rounded-none print:shadow-none print:m-0`}
      style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}
    >
      {/* ================= TOP MODERN HEADER ================= */}
      <header
        className={`p-8 pb-6 border-b ${tc.border} relative`}
        style={getSectionStyleProperties('header', theme.sectionStyles)}
      >
        {/* Subtle Top Accent Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${colors.bgAccent}`}
          style={{ backgroundColor: 'var(--sec-accent-color)' }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-left">
            {/* Avatar with Double Ring */}
            <div className="relative shrink-0 group">
              <div
                className={`w-24 h-24 rounded-full p-1 border-2 ${colors.borderAccent} shadow-sm group-hover:scale-105 transition-transform duration-300`}
                style={{ borderColor: 'var(--sec-accent-color)' }}
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
                className={`text-2xl sm:text-3xl font-extrabold uppercase leading-tight ${tc.title} tracking-wide break-words`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                {personalInfo.fullName}
              </h1>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                <span
                  className={`text-sm sm:text-base font-bold tracking-wide ${colors.primary}`}
                  style={{
                    fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                    color: 'var(--sec-accent-color, inherit)',
                  }}
                >
                  {personalInfo.title}
                </span>
                <span className={tc.meta}>•</span>
                <span className={`text-xs ${tc.meta} font-medium`}>
                  {personalInfo.location}
                </span>
              </div>

              {/* Bio summary crisp */}
              <p
                className={`text-[12px] ${tc.bodyMuted} mt-2 max-w-xl leading-relaxed`}
                style={{
                  ...getSectionStyleProperties('summary', theme.sectionStyles),
                  color: 'var(--sec-text-color, inherit)',
                  fontFamily: 'var(--sec-body-font, inherit)',
                }}
              >
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Strip Banner */}
        <div
          className={`mt-5 pt-4 border-t border-dashed ${tc.border} flex flex-wrap items-center justify-between gap-3 text-xs`}
          style={getSectionStyleProperties('contact', theme.sectionStyles)}
        >
          <div
            onClick={() => copyToClipboard(personalInfo.email, 'min-email')}
            className={`flex items-center gap-2 group cursor-pointer hover:${colors.primary} transition-colors`}
            title="Nhấn để sao chép email"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
              <Mail className="w-3 h-3 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
            </div>
            <span
              className={`font-medium text-[11.5px] ${tc.body}`}
              style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}
            >
              {personalInfo.email}
            </span>
            {copiedItem === 'min-email' ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          <a
            href={`tel:${personalInfo.phone}`}
            className={`flex items-center gap-2 hover:${colors.primary} transition-colors`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
              <Phone className="w-3 h-3 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
            </div>
            <span
              className={`font-medium text-[11.5px] ${tc.body}`}
              style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}
            >
              {personalInfo.phone}
            </span>
          </a>

          {personalInfo.website && (
            <a
              href={formatSafeUrl(personalInfo.website)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 hover:${colors.primary} transition-colors`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
                <Globe className="w-3 h-3 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              </div>
              <span
                className={`font-medium text-[11.5px] ${tc.body}`}
                style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}
              >
                {cleanDisplayUrl(personalInfo.website)}
              </span>
            </a>
          )}

          {personalInfo.github && (
            <a
              href={formatSafeUrl(personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 hover:${colors.primary} transition-colors`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colors.iconBg}`}>
                <Github className="w-3 h-3 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              </div>
              <span
                className={`font-medium text-[11.5px] ${tc.body}`}
                style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}
              >
                {cleanDisplayUrl(personalInfo.github)}
              </span>
            </a>
          )}
        </div>
      </header>

      {/* ================= 2-COLUMN BALANCED BODY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] print:grid-cols-[1.1fr_0.9fr] gap-7 p-8 py-6 min-h-[calc(297mm-165px)]">
        {/* ================= COLUMN 1: EXPERIENCES & PROJECTS ================= */}
        <div className="space-y-6">
          {/* Work Experience */}
          <section
            className="space-y-3.5"
            style={getSectionStyleProperties('experience', theme.sectionStyles)}
          >
            <div
              className={`flex items-center gap-2 pb-1.5 border-b-2 ${tc.borderStrong}`}
              style={{ borderColor: 'var(--sec-accent-color)' }}
            >
              <Briefcase className={`w-4 h-4 shrink-0 ${colors.primary}`} style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${tc.title}`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                Kinh Nghiệm Làm Việc
              </h2>
            </div>

            <div className="space-y-4" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className={`space-y-1.5 p-2 -mx-2 rounded-xl ${tc.hoverRow} transition-colors`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3
                      className={`font-bold text-[13px] ${tc.title}`}
                      style={{
                        fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                        color: 'var(--sec-heading-color, inherit)',
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${tc.tagPill} shrink-0`}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>

                  <div
                    className={`text-[12px] font-semibold ${tc.body} flex items-center gap-2`}
                    style={{ color: 'var(--sec-text-color, inherit)' }}
                  >
                    <span>{exp.company}</span>
                    {exp.location && <span className={`${tc.meta} font-normal`}>• {exp.location}</span>}
                  </div>

                  <ul
                    className={`space-y-1 text-[11.5px] ${tc.bodyMuted} list-disc list-outside pl-4 leading-relaxed`}
                    style={{ color: 'var(--sec-text-color, inherit)' }}
                  >
                    {exp.descriptions.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section
            className="space-y-3.5"
            style={getSectionStyleProperties('projects', theme.sectionStyles)}
          >
            <div
              className={`flex items-center gap-2 pb-1.5 border-b-2 ${tc.borderStrong}`}
              style={{ borderColor: 'var(--sec-accent-color)' }}
            >
              <Code2 className={`w-4 h-4 shrink-0 ${colors.primary}`} style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${tc.title}`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                Dự Án Nổi Bật
              </h2>
            </div>

            <div className="space-y-3" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3 rounded-xl border ${tc.cardBorder} hover:shadow-sm transition-all space-y-1.5 ${colors.hoverBorder}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className={`font-bold text-[12.5px] ${tc.title} truncate`}
                        style={{
                          fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                          color: 'var(--sec-heading-color, inherit)',
                        }}
                      >
                        {proj.name}
                      </h3>
                      {proj.link && (
                        <a
                          href={formatSafeUrl(proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center text-slate-400 hover:${colors.primary} transition-colors`}
                          style={{ color: 'var(--sec-accent-color, inherit)' }}
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>
                    <span className={`text-[10.5px] font-medium ${tc.meta} italic shrink-0`}>
                      {proj.role}
                    </span>
                  </div>

                  <p
                    className={`text-[11.5px] ${tc.bodyMuted} leading-relaxed`}
                    style={{ color: 'var(--sec-text-color, inherit)' }}
                  >
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
          <section
            className="space-y-3.5"
            style={getSectionStyleProperties('skills', theme.sectionStyles)}
          >
            <div
              className={`flex items-center gap-2 pb-1.5 border-b-2 ${tc.borderStrong}`}
              style={{ borderColor: 'var(--sec-accent-color)' }}
            >
              <Code2 className={`w-4 h-4 shrink-0 ${colors.primary}`} style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${tc.title}`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                Kỹ Năng Chuyên Môn
              </h2>
            </div>

            <div className="space-y-3" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div
                    className={`font-semibold text-[11px] ${tc.subtitle}`}
                    style={{
                      fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                      color: 'var(--sec-heading-color, inherit)',
                    }}
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
          <section
            className="space-y-3.5"
            style={getSectionStyleProperties('education', theme.sectionStyles)}
          >
            <div
              className={`flex items-center gap-2 pb-1.5 border-b-2 ${tc.borderStrong}`}
              style={{ borderColor: 'var(--sec-accent-color)' }}
            >
              <GraduationCap className={`w-4 h-4 shrink-0 ${colors.primary}`} style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${tc.title}`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                Học Vấn & Bằng Cấp
              </h2>
            </div>

            <div className="space-y-3" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {educations.map((edu) => (
                <div key={edu.id} className={`space-y-1 p-2 -mx-2 rounded-lg ${tc.hoverRow} transition-colors`}>
                  <div
                    className={`font-bold text-[12.5px] ${tc.title} leading-tight`}
                    style={{
                      fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                      color: 'var(--sec-heading-color, inherit)',
                    }}
                  >
                    {edu.school}
                  </div>
                  <div
                    className={`text-[11.5px] font-medium ${tc.body}`}
                    style={{ color: 'var(--sec-text-color, inherit)' }}
                  >
                    {edu.degree}
                  </div>
                  <div className={`text-[10.5px] ${tc.meta} flex justify-between`}>
                    <span>{edu.startDate} – {edu.endDate}</span>
                    {edu.gpa && (
                      <span
                        className={`font-semibold ${tc.gpaColor}`}
                        style={{ color: 'var(--sec-accent-color, inherit)' }}
                      >
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Awards & Certifications */}
          <section
            className="space-y-3.5"
            style={getSectionStyleProperties('certificates', theme.sectionStyles)}
          >
            <div
              className={`flex items-center gap-2 pb-1.5 border-b-2 ${tc.borderStrong}`}
              style={{ borderColor: 'var(--sec-accent-color)' }}
            >
              <Award className={`w-4 h-4 shrink-0 ${colors.primary}`} style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${tc.title}`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                Thành Tựu & Chứng Chỉ
              </h2>
            </div>

            <div className="space-y-2 text-[11px]" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {achievements &&
                achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`flex items-start gap-2 p-1.5 rounded-lg ${tc.hoverRow} transition-colors`}
                    style={getSectionStyleProperties('achievements', theme.sectionStyles)}
                  >
                    <Star className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colors.primary}`} style={{ color: 'var(--sec-accent-color, inherit)' }} />
                    <div>
                      <div
                        className={`font-bold ${tc.title}`}
                        style={{ color: 'var(--sec-heading-color, inherit)' }}
                      >
                        {ach.title}
                      </div>
                      <div className={`text-[10px] ${tc.meta}`}>
                        {ach.issuer} ({ach.year})
                      </div>
                    </div>
                  </div>
                ))}

              {certificates &&
                certificates.map((cert) => (
                  <div key={cert.id} className={`flex items-start gap-2 p-1.5 rounded-lg ${tc.hoverRow} transition-colors`}>
                    <Award className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" style={{ color: 'var(--sec-accent-color, inherit)' }} />
                    <div>
                      <div
                        className={`font-semibold ${tc.subtitle}`}
                        style={{ color: 'var(--sec-heading-color, inherit)' }}
                      >
                        {cert.name}
                      </div>
                      <div
                        className={`text-[10px] ${tc.meta}`}
                        style={{ color: 'var(--sec-text-color, inherit)' }}
                      >
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
