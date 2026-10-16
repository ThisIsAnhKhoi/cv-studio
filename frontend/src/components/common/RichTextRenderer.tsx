import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  content?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

// Allowed HTML tags and attributes for CV rendering (strict whitelist against XSS)
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'span',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'ul',
    'ol',
    'li',
    'br',
    'a',
  ],
  ALLOWED_ATTR: ['style', 'class', 'href', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Checks whether the given string contains actual HTML tags.
 */
function isHTML(str: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(str);
}

/**
 * Safe Rich Text Renderer with strict DOMPurify sanitization.
 * Seamlessly supports both legacy plain text and new rich HTML content.
 */
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className = '',
  style,
}) => {
  if (!content) return null;

  // If plain text (no HTML tags), render directly to preserve whitespace and maximize performance
  if (!isHTML(content)) {
    return (
      <span className={`whitespace-pre-line ${className}`} style={style}>
        {content}
      </span>
    );
  }

  // Sanitize rich HTML
  const sanitizedHTML = useMemo(() => {
    return DOMPurify.sanitize(content, SANITIZE_CONFIG);
  }, [content]);

  return (
    <div
      className={`rich-text-content ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default RichTextRenderer;
