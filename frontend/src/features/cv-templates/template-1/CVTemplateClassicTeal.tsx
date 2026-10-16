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
  Sparkles,
} from 'lucide-react';

export const CVTemplateClassicTeal: React.FC<CVTemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, educations, skillCategories, projects, achievements, certificates } = data;
  const isDark = Boolean(theme.darkMode);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Preset color definitions strictly controlled by CV theme's isDark (immune to website html.dark cascade)
  const getColorClasses = (preset: string, dark: boolean) => {
    switch (preset) {
      case 'orange':
        return {
          headerBg: 'bg-gradient-to-r from-orange-600 to-amber-600',
          accentBorder: 'bg-amber-400',
          sectionAccent: dark ? 'text-orange-400' : 'text-orange-600',
          badgeBg: dark
            ? 'bg-orange-950/60 text-orange-200 border-orange-800 hover:border-orange-400'
            : 'bg-orange-50 text-orange-800 border-orange-200 hover:border-orange-400',
          dotBg: dark ? 'bg-orange-400' : 'bg-orange-600',
          hoverCardBorder: dark ? 'hover:border-orange-500' : 'hover:border-orange-400',
        };
      case 'red':
        return {
          headerBg: 'bg-gradient-to-r from-red-700 to-rose-600',
          accentBorder: 'bg-rose-400',
          sectionAccent: dark ? 'text-red-400' : 'text-red-700',
          badgeBg: dark
            ? 'bg-red-950/60 text-red-200 border-red-800 hover:border-red-400'
            : 'bg-red-50 text-red-800 border-red-200 hover:border-red-400',
          dotBg: dark ? 'bg-red-400' : 'bg-red-700',
          hoverCardBorder: dark ? 'hover:border-red-500' : 'hover:border-red-400',
        };
      case 'blue':
        return {
          headerBg: 'bg-gradient-to-r from-blue-700 to-indigo-600',
          accentBorder: 'bg-sky-400',
          sectionAccent: dark ? 'text-blue-400' : 'text-blue-700',
          badgeBg: dark
            ? 'bg-blue-950/60 text-blue-200 border-blue-800 hover:border-blue-400'
            : 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400',
          dotBg: dark ? 'bg-blue-400' : 'bg-blue-700',
          hoverCardBorder: dark ? 'hover:border-blue-500' : 'hover:border-blue-400',
        };
      case 'purple':
        return {
          headerBg: 'bg-gradient-to-r from-purple-700 to-violet-600',
          accentBorder: 'bg-fuchsia-400',
          sectionAccent: dark ? 'text-purple-400' : 'text-purple-700',
          badgeBg: dark
            ? 'bg-purple-950/60 text-purple-200 border-purple-800 hover:border-purple-400'
            : 'bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-400',
          dotBg: dark ? 'bg-purple-400' : 'bg-purple-700',
          hoverCardBorder: dark ? 'hover:border-purple-500' : 'hover:border-purple-400',
        };
      case 'emerald':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-700 to-teal-600',
          accentBorder: 'bg-emerald-300',
          sectionAccent: dark ? 'text-emerald-400' : 'text-emerald-700',
          badgeBg: dark
            ? 'bg-emerald-950/60 text-emerald-200 border-emerald-800 hover:border-emerald-400'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
          dotBg: dark ? 'bg-emerald-400' : 'bg-emerald-700',
          hoverCardBorder: dark ? 'hover:border-emerald-500' : 'hover:border-emerald-400',
        };
      case 'teal':
      default:
        return {
          headerBg: 'bg-gradient-to-r from-[#0E7C6B] to-[#0A6456]',
          accentBorder: 'bg-[#E86C50]',
          sectionAccent: dark ? 'text-teal-400' : 'text-[#0E7C6B]',
          badgeBg: dark
            ? 'bg-teal-950/60 text-teal-200 border-teal-800 hover:border-teal-400'
            : 'bg-teal-50 text-teal-900 border-teal-200 hover:border-teal-400',
          dotBg: dark ? 'bg-teal-400' : 'bg-[#0E7C6B]',
          hoverCardBorder: dark ? 'hover:border-teal-500' : 'hover:border-teal-400',
        };
    }
  };

  const colors = getColorClasses(theme.primaryColorPreset || 'teal', isDark);

  // Surface and typography tokens strictly bound to isDark
  const tc = {
    title: isDark ? 'text-white' : 'text-slate-900',
    subtitle: isDark ? 'text-slate-200' : 'text-slate-800',
    body: isDark ? 'text-slate-300' : 'text-slate-700',
    bodyMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    meta: isDark ? 'text-slate-400' : 'text-slate-500',
    border: isDark ? 'border-slate-800' : 'border-slate-200',
    borderTimeline: isDark ? 'border-slate-700' : 'border-slate-200',
    sidebarBg: isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-slate-50/90 border-slate-200 text-slate-600',
    hoverRow: isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80',
    hoverLink: isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-200/60',
    cardBg: isDark ? 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600' : 'bg-slate-50/70 border-slate-200 hover:border-slate-300',
    tagBg: isDark ? 'bg-slate-700/70 text-slate-300' : 'bg-slate-200/80 text-slate-700',
    gpaColor: isDark ? 'text-teal-400' : 'text-teal-700',
  };

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
      <header
        className={`${colors.headerBg} text-white px-8 py-7 relative flex items-center gap-6 shadow-md print:shadow-none`}
        style={getSectionStyleProperties('header', theme.sectionStyles)}
      >
        {/* Accent Stripe at bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1.5 ${colors.accentBorder}`}
          style={{ backgroundColor: 'var(--sec-accent-color)' }}
        />

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
            className="text-2xl sm:text-3xl font-extrabold uppercase leading-tight drop-shadow-sm tracking-wide break-words"
            style={{
              fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
              color: 'var(--sec-heading-color, #ffffff)',
            }}
          >
            {personalInfo.fullName}
          </h1>

          <p
            className="text-sm sm:text-base font-medium tracking-wide mt-1.5 flex items-center gap-2"
            style={{
              fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
              color: 'var(--sec-text-color, rgba(255,255,255,0.95))',
            }}
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
          className={`w-full md:w-[245px] print:w-[235px] shrink-0 px-6 py-6 space-y-6 text-xs border-r ${tc.sidebarBg}`}
        >
          {/* Contact Details with Interactive Click-to-Copy */}
          <section className="space-y-3" style={getSectionStyleProperties('contact', theme.sectionStyles)}>
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
              style={{
                fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                color: 'var(--sec-heading-color, inherit)',
              }}
            >
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <span>Thông Tin Liên Hệ</span>
            </h2>

            <div className="space-y-2 text-[11.5px]">
              {/* Email */}
              <div
                onClick={() => copyToClipboard(personalInfo.email, 'email')}
                className={`group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg ${tc.hoverLink} transition-colors cursor-pointer`}
                title="Nhấn để sao chép email"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
                <span className={`shrink-0 text-[10px] ${colors.sectionAccent} opacity-0 group-hover:opacity-100 transition-opacity ml-1`}>
                  {copiedItem === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </span>
              </div>

              {/* Phone */}
              <a
                href={`tel:${personalInfo.phone}`}
                className={`group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg ${tc.hoverLink} transition-colors`}
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
                  href={formatSafeUrl(personalInfo.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg ${tc.hoverLink} transition-colors`}
                  title="Mở website"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{cleanDisplayUrl(personalInfo.website)}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </a>
              )}

              {/* GitHub */}
              {personalInfo.github && (
                <a
                  href={formatSafeUrl(personalInfo.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg ${tc.hoverLink} transition-colors`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Github className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{cleanDisplayUrl(personalInfo.github)}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </a>
              )}

              {/* LinkedIn */}
              {personalInfo.linkedin && (
                <a
                  href={formatSafeUrl(personalInfo.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg ${tc.hoverLink} transition-colors`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-current" />
                    <span className="truncate">{cleanDisplayUrl(personalInfo.linkedin)}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          <section
            className={`space-y-3 pt-3 border-t ${tc.border}`}
            style={getSectionStyleProperties('education', theme.sectionStyles)}
          >
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
              style={{
                fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                color: 'var(--sec-heading-color, inherit)',
              }}
            >
              <GraduationCap className="w-4 h-4 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <span>Học Vấn</span>
            </h2>

            <div className="space-y-3" style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}>
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-1 group hover:translate-x-1 transition-transform">
                  <div
                    className={`font-bold text-[12px] ${tc.title} leading-tight`}
                    style={{
                      fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                      color: 'var(--sec-heading-color, inherit)',
                    }}
                  >
                    {edu.school}
                  </div>
                  <div className={`text-[11.5px] font-medium ${tc.body}`}>
                    {edu.degree}
                  </div>
                  <div className={`text-[10.5px] ${tc.meta} flex justify-between`}>
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {edu.gpa && (
                    <div
                      className={`text-[10.5px] font-semibold ${tc.gpaColor}`}
                      style={{ color: 'var(--sec-accent-color, inherit)' }}
                    >
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Breakdown */}
          <section
            className={`space-y-3 pt-3 border-t ${tc.border}`}
            style={getSectionStyleProperties('skills', theme.sectionStyles)}
          >
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
              style={{
                fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                color: 'var(--sec-heading-color, inherit)',
              }}
            >
              <Code2 className="w-4 h-4 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <span>Kỹ Năng</span>
            </h2>

            <div className="space-y-3.5" style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}>
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
            <section
              className={`space-y-3 pt-3 border-t ${tc.border}`}
              style={getSectionStyleProperties('certificates', theme.sectionStyles)}
            >
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-1.5`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                <Award className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
                <span>Chứng Chỉ</span>
              </h2>

              <div className="space-y-2 text-[11px]" style={{ color: 'var(--sec-text-color, inherit)', fontFamily: 'var(--sec-body-font, inherit)' }}>
                {certificates.map((cert) => (
                  <div key={cert.id} className="space-y-0.5 group hover:translate-x-1 transition-transform">
                    <div
                      className={`font-semibold ${tc.subtitle} leading-snug`}
                      style={{ color: 'var(--sec-heading-color, inherit)' }}
                    >
                      {cert.name}
                    </div>
                    <div className={`text-[10px] ${tc.meta} flex justify-between`}>
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
          <section
            className="space-y-2"
            style={getSectionStyleProperties('summary', theme.sectionStyles)}
          >
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b ${tc.border}`}
              style={{
                fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                color: 'var(--sec-heading-color, inherit)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <span>Giới Thiệu Bản Thân</span>
            </h2>
            <p
              className={`text-[12.5px] leading-relaxed ${tc.body} text-justify`}
              style={{
                color: 'var(--sec-text-color, inherit)',
                fontFamily: 'var(--sec-body-font, inherit)',
              }}
            >
              {summary}
            </p>
          </section>

          {/* Work Experience */}
          <section
            className="space-y-3"
            style={getSectionStyleProperties('experience', theme.sectionStyles)}
          >
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b ${tc.border}`}
              style={{
                fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                color: 'var(--sec-heading-color, inherit)',
              }}
            >
              <Briefcase className="w-4 h-4 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <span>Kinh Nghiệm Làm Việc</span>
            </h2>

            <div className="space-y-4" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className={`relative pl-4 border-l-2 ${tc.borderTimeline} space-y-1.5 group p-2 -ml-2 rounded-lg ${tc.hoverRow} transition-all duration-200 cursor-default`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[5px] top-[14px] w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-150 ${colors.dotBg}`}
                    style={{ backgroundColor: 'var(--sec-accent-color)' }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3
                      className={`font-bold text-[13px] ${tc.title} transition-colors`}
                      style={{
                        fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                        color: 'var(--sec-heading-color, inherit)',
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span className={`text-[11px] font-semibold ${tc.meta} shrink-0`}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>

                  <div
                    className={`text-[12px] font-semibold ${tc.body}`}
                    style={{ color: 'var(--sec-text-color, inherit)' }}
                  >
                    {exp.company}
                    {exp.location && <span className={`${tc.meta} font-normal`}> • {exp.location}</span>}
                  </div>

                  <ul
                    className={`space-y-1 text-[12px] ${tc.bodyMuted} list-disc list-outside pl-4 leading-relaxed`}
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

          {/* Featured Projects with Perfectly Aligned Icon & Card Hover */}
          <section
            className="space-y-3"
            style={getSectionStyleProperties('projects', theme.sectionStyles)}
          >
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b ${tc.border}`}
              style={{
                fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                color: 'var(--sec-heading-color, inherit)',
              }}
            >
              <Code2 className="w-4 h-4 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
              <span>Dự Án Tiêu Biểu</span>
            </h2>

            <div className="space-y-3.5" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 space-y-2 group hover:-translate-y-0.5 hover:shadow-md ${tc.cardBg} ${colors.hoverCardBorder}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Aligned Title with perfectly inline Icon */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className={`font-bold text-[13px] ${tc.title} truncate`}
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
                          className={`inline-flex items-center justify-center p-1 rounded ${tc.hoverLink} text-slate-400 hover:${colors.sectionAccent} transition-colors shrink-0`}
                          title="Xem dự án trực tuyến"
                          style={{ color: 'var(--sec-accent-color, inherit)' }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      )}
                    </div>

                    <span className={`text-[11px] font-medium ${tc.meta} italic shrink-0`}>
                      {proj.role}
                    </span>
                  </div>

                  <p
                    className={`text-[11.5px] ${tc.bodyMuted} leading-relaxed`}
                    style={{ color: 'var(--sec-text-color, inherit)' }}
                  >
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 font-medium rounded-md transition-colors ${tc.tagBg}`}
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
            <section
              className="space-y-2.5"
              style={getSectionStyleProperties('achievements', theme.sectionStyles)}
            >
              <h2
                className={`text-xs font-bold uppercase tracking-wider ${colors.sectionAccent} flex items-center gap-2 pb-1 border-b ${tc.border}`}
                style={{
                  fontFamily: 'var(--sec-heading-font, ' + headingFontFamily + ')',
                  color: 'var(--sec-heading-color, inherit)',
                }}
              >
                <Award className="w-4 h-4 shrink-0" style={{ color: 'var(--sec-accent-color, inherit)' }} />
                <span>Thành Tựu Nổi Bật</span>
              </h2>

              <div className="space-y-2" style={{ fontFamily: 'var(--sec-body-font, inherit)' }}>
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2.5 text-[11.5px] group hover:translate-x-1 transition-transform">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${colors.dotBg}`}
                      style={{ backgroundColor: 'var(--sec-accent-color)' }}
                    />
                    <div>
                      <span
                        className={`font-bold ${tc.title}`}
                        style={{ color: 'var(--sec-heading-color, inherit)' }}
                      >
                        {ach.title}
                      </span>
                      <span className={tc.meta}> ({ach.issuer}, {ach.year})</span>
                      {ach.description && (
                        <p
                          className={`text-[11px] ${tc.bodyMuted} mt-0.5`}
                          style={{ color: 'var(--sec-text-color, inherit)' }}
                        >
                          {ach.description}
                        </p>
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
