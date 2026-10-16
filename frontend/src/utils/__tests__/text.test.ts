import { describe, it, expect } from 'vitest';
import { stripHtml, truncateText, removeVietnameseTones } from '../text';

describe('text utility', () => {
  describe('stripHtml', () => {
    it('should return empty string for null, undefined, or empty string', () => {
      expect(stripHtml(null)).toBe('');
      expect(stripHtml(undefined)).toBe('');
      expect(stripHtml('')).toBe('');
    });

    it('should return original text if no HTML tags are present', () => {
      const text = 'Cử nhân Công nghệ Thông tin đam mê sư phạm';
      expect(stripHtml(text)).toBe(text);
    });

    it('should strip complex nested HTML tags and inline styles', () => {
      const rawHtml =
        '<p>Cử nhân Công nghệ Thông tin đam mê sâu sắc với<span style="color: rgb(15, 23, 42);"> sư phạm công nghệ </span>và phát triển web hiện đại.</p>';
      const cleaned = stripHtml(rawHtml);
      expect(cleaned).toBe(
        'Cử nhân Công nghệ Thông tin đam mê sâu sắc với sư phạm công nghệ và phát triển web hiện đại.'
      );
    });

    it('should preserve spacing between block elements without concatenating words', () => {
      const html = '<p>Đoạn 1</p><p>Đoạn 2</p>';
      expect(stripHtml(html)).toBe('Đoạn 1 Đoạn 2');
    });

    it('should decode HTML entities properly', () => {
      const html = 'Kinh nghiệm 5+ năm &amp; quản lý &lt;team&gt; &quot;quy mô lớn&quot;';
      expect(stripHtml(html)).toBe('Kinh nghiệm 5+ năm & quản lý <team> "quy mô lớn"');
    });
  });

  describe('truncateText', () => {
    it('should truncate string beyond maxLength', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate if length is within maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });
  });

  describe('removeVietnameseTones', () => {
    it('should normalize and remove tones accurately', () => {
      expect(removeVietnameseTones('Trần Anh Khôi')).toBe('tran anh khoi');
      expect(removeVietnameseTones('Nguyễn Lê Thanh Trúc')).toBe('nguyen le thanh truc');
      expect(removeVietnameseTones('Kỹ Sư Phần Mềm & AI')).toBe('ky su phan mem & ai');
    });

    it('should convert đ and Đ to d', () => {
      expect(removeVietnameseTones('Đà Nẵng & Đồng Nai')).toBe('da nang & dong nai');
    });

    it('should handle empty or null values', () => {
      expect(removeVietnameseTones('')).toBe('');
      expect(removeVietnameseTones(null)).toBe('');
      expect(removeVietnameseTones(undefined)).toBe('');
    });
  });
});
