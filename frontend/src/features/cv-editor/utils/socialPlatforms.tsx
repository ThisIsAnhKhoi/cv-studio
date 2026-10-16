import React from 'react';
import {
  Github,
  Linkedin,
  Facebook,
  Twitter,
  Dribbble,
  Youtube,
  Globe,
  Link2,
  Code2,
  Figma,
  BookOpen,
  Send,
  GitBranch,
} from 'lucide-react';
import { SocialLink, SocialPlatformId, PersonalInfo } from '../../../types/cv';

export interface SocialPlatformMeta {
  id: SocialPlatformId;
  name: string;
  placeholder: string;
  defaultLabel: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
}

// Custom clean SVG icons for platforms without standard Lucide icons
const BehanceIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-4 h-4',
  style,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M7.8 12.3c.7-.2 1.2-.6 1.6-1.1.4-.5.6-1.2.6-2 0-.8-.2-1.5-.6-2-.4-.5-1-.9-1.7-1.1-.7-.2-1.6-.3-2.6-.3H0v12.4h5.4c1.1 0 2-.1 2.8-.4.8-.3 1.4-.7 1.9-1.4.5-.7.7-1.5.7-2.5 0-1-.3-1.8-.8-2.4-.4-.6-1.1-.9-1.9-1.1h-.3zm-4.7-4h1.7c.8 0 1.4.1 1.7.3.3.2.5.6.5 1.1s-.2.9-.5 1.1c-.3.2-.9.3-1.7.3H3.1V8.3zm2.2 7.5H3.1v-3.4h2.2c.9 0 1.5.1 1.9.4.4.3.6.7.6 1.3 0 .6-.2 1.1-.6 1.3-.4.3-1.1.4-1.9.4zm10.7-7.7c-1.3 0-2.4.4-3.2 1.3-.8.9-1.3 2-1.3 3.5 0 1.5.4 2.7 1.3 3.6.9.9 2 1.3 3.4 1.3 1.2 0 2.1-.3 2.8-.8.7-.5 1.2-1.2 1.4-2h-2.5c-.1.3-.3.6-.6.8-.3.2-.8.3-1.3.3-.7 0-1.2-.2-1.6-.6-.4-.4-.6-1-.6-1.8h6.8v-.6c0-1.5-.4-2.6-1.2-3.5-.7-.9-1.8-1.5-3.1-1.5zm-1.8 3.7c.1-.5.3-.9.6-1.2.3-.3.8-.5 1.3-.5.6 0 1 .2 1.3.5.3.3.5.7.5 1.2h-3.7zM14 5.3h4.3v1.4H14V5.3z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-4 h-4',
  style,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

const ZaloIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-4 h-4',
  style,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.86 7.07-.17 1.13-.77 2.76-1.78 3.84 1.83-.2 3.88-.93 5.09-1.83.9.23 1.84.36 2.83.36 5.52 0 10-4.03 10-9s-4.48-9-10-9zm-4.7 12.2h-1.5l3.2-5.4H6.2V7.4h4.1v1.4l-3 5.4zm3.9 0v-6.8h1.4v6.8h-1.4zm6.5 0h-1.5V7.4h1.5v4.8h2.3v1.4h-2.3z" />
  </svg>
);

export const SOCIAL_PLATFORMS: SocialPlatformMeta[] = [
  {
    id: 'github',
    name: 'GitHub',
    placeholder: 'https://github.com/username',
    defaultLabel: 'GitHub',
    icon: Github,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    defaultLabel: 'LinkedIn',
    icon: Linkedin,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    placeholder: 'https://facebook.com/username',
    defaultLabel: 'Facebook',
    icon: Facebook,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    placeholder: 'https://x.com/username',
    defaultLabel: 'X',
    icon: Twitter,
  },
  {
    id: 'behance',
    name: 'Behance',
    placeholder: 'https://behance.net/username',
    defaultLabel: 'Behance',
    icon: BehanceIcon,
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    placeholder: 'https://dribbble.com/username',
    defaultLabel: 'Dribbble',
    icon: Dribbble,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
    defaultLabel: 'YouTube',
    icon: Youtube,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    placeholder: 'https://tiktok.com/@username',
    defaultLabel: 'TikTok',
    icon: TikTokIcon,
  },
  {
    id: 'zalo',
    name: 'Zalo',
    placeholder: 'https://zalo.me/0912345678',
    defaultLabel: 'Zalo',
    icon: ZaloIcon,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    placeholder: 'https://t.me/username',
    defaultLabel: 'Telegram',
    icon: Send,
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    placeholder: 'https://gitlab.com/username',
    defaultLabel: 'GitLab',
    icon: GitBranch,
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    placeholder: 'https://leetcode.com/username',
    defaultLabel: 'LeetCode',
    icon: Code2,
  },
  {
    id: 'figma',
    name: 'Figma Community',
    placeholder: 'https://figma.com/@username',
    defaultLabel: 'Figma',
    icon: Figma,
  },
  {
    id: 'medium',
    name: 'Medium / Blog',
    placeholder: 'https://medium.com/@username',
    defaultLabel: 'Medium',
    icon: BookOpen,
  },
  {
    id: 'website',
    name: 'Website / Portfolio',
    placeholder: 'https://yourportfolio.dev',
    defaultLabel: 'Website',
    icon: Globe,
  },
  {
    id: 'other',
    name: 'Liên Kết Khác',
    placeholder: 'https://example.com/profile',
    defaultLabel: 'Link',
    icon: Link2,
  },
];

/**
 * Returns metadata and icon for a given platform identifier
 */
export function getPlatformMeta(platformId?: string): SocialPlatformMeta {
  const found = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
  if (found) return found;
  return SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1]; // fallback to 'other'
}

/**
 * Renders the matching icon component for a given platform with currentColor
 */
export const SocialIcon: React.FC<{
  platform?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ platform, className = 'w-3.5 h-3.5', style }) => {
  const meta = getPlatformMeta(platform);
  const IconComponent = meta.icon;
  return <IconComponent className={className} style={style} />;
};

/**
 * Normalizes PersonalInfo social links with 100% backward compatibility.
 * @param filterEmpty - If true, only returns links with non-empty URLs (for CV templates/views).
 *                      If false (default), returns all links including empty drafts (for CV Editor).
 */
export function getNormalizedSocialLinks(
  info?: PersonalInfo | null,
  filterEmpty: boolean = false
): SocialLink[] {
  if (!info) return [];

  // If socialLinks array has been initialized (even if empty [])
  if (Array.isArray(info.socialLinks)) {
    if (filterEmpty) {
      return info.socialLinks.filter((l) => Boolean(l && l.url && l.url.trim()));
    }
    return info.socialLinks;
  }

  // Fallback for legacy profiles where socialLinks array was never defined
  const legacy: SocialLink[] = [];
  if (info.website && info.website.trim()) {
    legacy.push({
      id: 'legacy-website',
      platform: 'website',
      url: info.website.trim(),
      label: 'Website',
    });
  }
  if (info.github && info.github.trim()) {
    legacy.push({
      id: 'legacy-github',
      platform: 'github',
      url: info.github.trim(),
      label: 'GitHub',
    });
  }
  if (info.linkedin && info.linkedin.trim()) {
    legacy.push({
      id: 'legacy-linkedin',
      platform: 'linkedin',
      url: info.linkedin.trim(),
      label: 'LinkedIn',
    });
  }

  return legacy;
}

/**
 * Synchronizes legacy fields (website, github, linkedin) from dynamic socialLinks array
 * to maintain complete compatibility across all legacy consumers and database schemas.
 */
export function syncLegacySocialFields(links: SocialLink[]): {
  website: string;
  github: string;
  linkedin: string;
} {
  const website = links.find((l) => l.platform === 'website')?.url || '';
  const github = links.find((l) => l.platform === 'github')?.url || '';
  const linkedin = links.find((l) => l.platform === 'linkedin')?.url || '';
  return { website, github, linkedin };
}
