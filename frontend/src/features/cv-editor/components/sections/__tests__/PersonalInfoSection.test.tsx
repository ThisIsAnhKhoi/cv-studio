import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalInfoSection } from '../PersonalInfoSection';
import { mockCVData } from '../../../../../data/mockCVData';
import { getNormalizedSocialLinks } from '../../../utils/socialPlatforms';
import { PersonalInfo } from '../../../../../types/cv';

describe('socialPlatforms utils', () => {
  it('returns legacy links when socialLinks is undefined', () => {
    const legacyInfo: PersonalInfo = {
      fullName: 'Test User',
      title: 'Dev',
      email: 'test@example.com',
      phone: '0123456789',
      location: 'Hà Nội',
      avatarUrl: 'https://example.com/avatar.jpg',
      website: 'https://test.dev',
      github: 'github.com/test',
      linkedin: 'linkedin.com/in/test',
    };
    const links = getNormalizedSocialLinks(legacyInfo, false);
    expect(links.length).toBe(3);
    expect(links.map((l) => l.platform)).toEqual(['website', 'github', 'linkedin']);
  });

  it('preserves empty draft link when filterEmpty is false (for editor)', () => {
    const infoWithDraft: PersonalInfo = {
      fullName: 'Test User',
      title: 'Dev',
      email: 'test@example.com',
      phone: '0123456789',
      location: 'Hà Nội',
      avatarUrl: 'https://example.com/avatar.jpg',
      socialLinks: [
        { id: '1', platform: 'github', url: 'https://github.com/abc' },
        { id: '2', platform: 'facebook', url: '' }, // empty draft
      ],
    };
    const editorLinks = getNormalizedSocialLinks(infoWithDraft, false);
    expect(editorLinks.length).toBe(2);
    expect(editorLinks[1].platform).toBe('facebook');
    expect(editorLinks[1].url).toBe('');
  });

  it('filters out empty draft link when filterEmpty is true (for templates)', () => {
    const infoWithDraft: PersonalInfo = {
      fullName: 'Test User',
      title: 'Dev',
      email: 'test@example.com',
      phone: '0123456789',
      location: 'Hà Nội',
      avatarUrl: 'https://example.com/avatar.jpg',
      socialLinks: [
        { id: '1', platform: 'github', url: 'https://github.com/abc' },
        { id: '2', platform: 'facebook', url: '' }, // empty draft
      ],
    };
    const templateLinks = getNormalizedSocialLinks(infoWithDraft, true);
    expect(templateLinks.length).toBe(1);
    expect(templateLinks[0].platform).toBe('github');
  });

  it('respects initialized empty array and does not fall back to legacy fields', () => {
    const clearedInfo: PersonalInfo = {
      fullName: 'Test User',
      title: 'Dev',
      email: 'test@example.com',
      phone: '0123456789',
      location: 'Hà Nội',
      avatarUrl: 'https://example.com/avatar.jpg',
      website: 'https://old.dev',
      socialLinks: [], // User explicitly deleted all links
    };
    const links = getNormalizedSocialLinks(clearedInfo, false);
    expect(links.length).toBe(0);
  });
});

describe('PersonalInfoSection Component', () => {
  it('renders all personal info inputs and social channels', () => {
    const onChange = vi.fn();
    render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

    expect(screen.getByDisplayValue(mockCVData.personalInfo.fullName)).toBeDefined();
    expect(screen.getByDisplayValue(mockCVData.personalInfo.title)).toBeDefined();
    expect(screen.getByText(/Thêm Kênh/i)).toBeDefined();
  });

  it('calls onChange with a new social link when clicking "Thêm Kênh"', () => {
    const onChange = vi.fn();
    render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

    const addBtn = screen.getByRole('button', { name: /thêm kênh/i });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.socialLinks).toBeDefined();
    // Initially mockCVData has 3 links, so clicking add should result in 4 links
    expect(callArgs.socialLinks.length).toBe(4);
    expect(callArgs.socialLinks[3].platform).toBe('github');
    expect(callArgs.socialLinks[3].url).toBe('');
  });

  it('removes a channel when clicking the delete button', () => {
    const onChange = vi.fn();
    const infoWithLinks: PersonalInfo = {
      ...mockCVData.personalInfo,
      socialLinks: [
        { id: 'link-1', platform: 'github', url: 'https://github.com/user' },
        { id: 'link-2', platform: 'linkedin', url: 'https://linkedin.com/in/user' },
      ],
    };

    render(<PersonalInfoSection personalInfo={infoWithLinks} onChange={onChange} />);

    const removeBtns = screen.getAllByTitle(/xóa kênh này/i);
    expect(removeBtns.length).toBe(2);

    fireEvent.click(removeBtns[0]);
    expect(onChange).toHaveBeenCalled();
    const callArgs = onChange.mock.calls[0][0];
    expect(callArgs.socialLinks.length).toBe(1);
    expect(callArgs.socialLinks[0].platform).toBe('linkedin');
  });

  it('updates birthday via date picker input', () => {
    const onChange = vi.fn();
    render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

    // Date inputs are of type="date"
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput).not.toBeNull();

    fireEvent.change(dateInput, { target: { value: '2000-05-20' } });
    expect(onChange).toHaveBeenCalledWith('birthday', '20/05/2000');
  });

  describe('Avatar Upload & Customization features', () => {
    it('renders avatar upload controls and action buttons', () => {
      const onChange = vi.fn();
      render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

      expect(screen.getByRole('button', { name: /Tải Ảnh Từ Máy/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Chọn Mẫu Có Sẵn/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Dán Link URL/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Xóa ảnh/i })).toBeDefined();
    });

    it('opens preset avatars gallery and triggers onChange on preset click', () => {
      const onChange = vi.fn();
      render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

      const presetBtn = screen.getByRole('button', { name: /chọn mẫu có sẵn/i });
      fireEvent.click(presetBtn);

      expect(screen.getByText(/Chọn avatar mẫu chuyên nghiệp:/i)).toBeDefined();

      const femalePreset = screen.getByTitle(/Nữ Doanh Nhân \/ Quản Lý/i);
      fireEvent.click(femalePreset);

      expect(onChange).toHaveBeenCalledWith('avatarUrl', expect.stringContaining('https://images.unsplash.com'));
    });

    it('clears avatar when clicking "Xóa ảnh"', () => {
      const onChange = vi.fn();
      render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

      const removeBtn = screen.getByRole('button', { name: /xóa ảnh/i });
      fireEvent.click(removeBtn);

      expect(onChange).toHaveBeenCalledWith('avatarUrl', '');
    });

    it('toggles direct URL input when clicking "Dán Link URL"', () => {
      const onChange = vi.fn();
      render(<PersonalInfoSection personalInfo={mockCVData.personalInfo} onChange={onChange} />);

      const urlToggleBtn = screen.getByRole('button', { name: /dán link url/i });
      fireEvent.click(urlToggleBtn);

      const urlInput = screen.getByPlaceholderText(/https:\/\/images.unsplash.com/i) as HTMLInputElement;
      expect(urlInput).toBeDefined();

      fireEvent.change(urlInput, { target: { value: 'https://mywebsite.com/new-avatar.png' } });
      expect(onChange).toHaveBeenCalledWith('avatarUrl', 'https://mywebsite.com/new-avatar.png');
    });
  });
});

