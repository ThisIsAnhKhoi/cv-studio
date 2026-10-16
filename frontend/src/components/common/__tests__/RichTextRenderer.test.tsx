import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RichTextRenderer } from '../RichTextRenderer';

describe('RichTextRenderer Component', () => {
  it('returns null when content is null, undefined, or empty string', () => {
    const { container: c1 } = render(<RichTextRenderer content={null} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<RichTextRenderer content={undefined} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<RichTextRenderer content="" />);
    expect(c3.firstChild).toBeNull();
  });

  it('renders legacy plain text inside a whitespace-pre-line span preserving Vietnamese accents', () => {
    const plainText =
      'Kỹ sư phần mềm Fullstack với hơn 4 năm kinh nghiệm tại TP.HCM.\nChuyên về React 18, TypeScript và Node.js.';
    const { container } = render(<RichTextRenderer content={plainText} />);

    const span = container.querySelector('span');
    expect(span).not.toBeNull();
    expect(span?.className).toContain('whitespace-pre-line');
    expect(span?.textContent).toBe(plainText);
  });

  it('renders rich HTML formatting correctly with allowed tags and custom styles', () => {
    const richHTML =
      '<p><strong>Lập trình viên</strong> <em>Frontend</em> <span style="color: rgb(13, 148, 136);">Chuyên nghiệp</span></p>';
    const { container } = render(<RichTextRenderer content={richHTML} />);

    const wrapper = container.querySelector('.rich-text-content');
    expect(wrapper).not.toBeNull();

    const strong = screen.getByText('Lập trình viên');
    expect(strong.tagName.toLowerCase()).toBe('strong');

    const em = screen.getByText('Frontend');
    expect(em.tagName.toLowerCase()).toBe('em');

    const styledSpan = screen.getByText('Chuyên nghiệp');
    expect(styledSpan.tagName.toLowerCase()).toBe('span');
  });

  it('renders bullet and numbered lists properly', () => {
    const listHTML = '<ul><li>Kỹ năng 1: Tối ưu web</li><li>Kỹ năng 2: Clean code</li></ul>';
    const { container } = render(<RichTextRenderer content={listHTML} />);

    const ul = container.querySelector('ul');
    expect(ul).not.toBeNull();
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe('Kỹ năng 1: Tối ưu web');
    expect(items[1].textContent).toBe('Kỹ năng 2: Clean code');
  });

  it('sanitizes and strips malicious <script> tags (Anti-XSS)', () => {
    const maliciousHTML =
      '<p>Nội dung hợp lệ <script>alert("HACKED")</script> kết thúc</p>';
    const { container } = render(<RichTextRenderer content={maliciousHTML} />);

    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('Nội dung hợp lệ');
    expect(container.textContent).toContain('kết thúc');
    expect(container.textContent).not.toContain('alert');
  });

  it('sanitizes malicious event handlers such as onerror and onclick', () => {
    const maliciousHTML =
      '<p><span onclick="alert(1)">Bấm vào đây</span><img src="invalid-src" onerror="alert(2)" /></p>';
    const { container } = render(<RichTextRenderer content={maliciousHTML} />);

    const span = container.querySelector('span');
    expect(span?.getAttribute('onclick')).toBeNull();
    // img tag is not in ALLOWED_TAGS so it should be stripped
    expect(container.querySelector('img')).toBeNull();
  });

  it('neutralizes malicious javascript: URI links', () => {
    const maliciousLink =
      '<p><a href="javascript:alert(\'xss\')">Liên kết độc hại</a></p>';
    const { container } = render(<RichTextRenderer content={maliciousLink} />);

    const anchor = container.querySelector('a');
    // DOMPurify removes javascript: href
    expect(anchor?.getAttribute('href')).not.toBe('javascript:alert(\'xss\')');
  });
});
