import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  PRESET_AVATARS,
  MAX_UPLOAD_FILE_SIZE_MB,
} from '../image';

describe('image.ts utilities', () => {
  describe('validateImageFile', () => {
    it('returns error when file is null or undefined', () => {
      // @ts-expect-error testing invalid input
      const result = validateImageFile(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Vui lòng chọn một tệp ảnh');
    });

    it('approves valid image formats (jpg, png, webp)', () => {
      const jpgFile = new File(['fake-content'], 'avatar.jpg', { type: 'image/jpeg' });
      const pngFile = new File(['fake-content'], 'photo.png', { type: 'image/png' });
      const webpFile = new File(['fake-content'], 'me.webp', { type: 'image/webp' });

      expect(validateImageFile(jpgFile).valid).toBe(true);
      expect(validateImageFile(pngFile).valid).toBe(true);
      expect(validateImageFile(webpFile).valid).toBe(true);
    });

    it('rejects unsupported file formats like pdf or text', () => {
      const pdfFile = new File(['pdf-content'], 'document.pdf', { type: 'application/pdf' });
      const txtFile = new File(['text-content'], 'notes.txt', { type: 'text/plain' });

      const pdfResult = validateImageFile(pdfFile);
      expect(pdfResult.valid).toBe(false);
      expect(pdfResult.error).toContain('Định dạng tệp không được hỗ trợ');

      const txtResult = validateImageFile(txtFile);
      expect(txtResult.valid).toBe(false);
    });

    it('rejects files exceeding max size limit', () => {
      // Create a 10MB fake file
      const largeSize = (MAX_UPLOAD_FILE_SIZE_MB + 2) * 1024 * 1024;
      const oversizedFile = new File(['x'.repeat(100)], 'huge.jpg', { type: 'image/jpeg' });
      Object.defineProperty(oversizedFile, 'size', { value: largeSize });

      const result = validateImageFile(oversizedFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`Dung lượng ảnh vượt quá giới hạn ${MAX_UPLOAD_FILE_SIZE_MB}MB`);
    });
  });

  describe('PRESET_AVATARS collection', () => {
    it('contains at least 6 diverse professional avatars', () => {
      expect(PRESET_AVATARS.length).toBeGreaterThanOrEqual(6);
      PRESET_AVATARS.forEach((preset) => {
        expect(preset.id).toBeTruthy();
        expect(preset.label).toBeTruthy();
        expect(preset.url).toMatch(/^https:\/\//);
        expect(['female', 'male']).toContain(preset.gender);
      });
    });
  });
});
