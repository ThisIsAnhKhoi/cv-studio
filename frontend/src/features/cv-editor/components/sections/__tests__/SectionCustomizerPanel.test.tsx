import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SectionCustomizerPanel } from '../SectionCustomizerPanel';
import { ThemeConfig } from '../../../../../types/cv';

describe('SectionCustomizerPanel Component', () => {
  const baseThemeConfig: ThemeConfig = {
    templateId: 'template-classic-teal',
    primaryColor: '#0E7C6B',
    primaryColorPreset: 'teal',
    accentColor: '#E86C50',
    fontHeading: 'Be Vietnam Pro',
    fontBody: 'Be Vietnam Pro',
    darkMode: false,
    sectionStyles: {},
  };

  it('renders section selector pills with all 9 sections', () => {
    render(<SectionCustomizerPanel themeConfig={baseThemeConfig} />);

    expect(screen.getByRole('button', { name: /Họ Tên & Tiêu Đề/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Thông Tin Liên Hệ/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Tóm Tắt Bản Thân/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Kinh Nghiệm/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Học Vấn/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Kỹ Năng/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Dự Án/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Thành Tựu/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Chứng Chỉ/i })).toBeDefined();
  });

  it('switches the active section when clicking a section pill', () => {
    render(<SectionCustomizerPanel themeConfig={baseThemeConfig} />);

    const expButton = screen.getByText('Kinh Nghiệm');
    fireEvent.click(expButton);

    expect(screen.getByText('Khối đang chọn:')).toBeDefined();
    expect(screen.getAllByText('Kinh Nghiệm').length).toBeGreaterThan(0);
  });

  it('calls onUpdateSectionStyle with sanitized hex color on color input change', () => {
    const handleUpdate = vi.fn();
    render(
      <SectionCustomizerPanel
        themeConfig={baseThemeConfig}
        onUpdateSectionStyle={handleUpdate}
      />
    );

    const headingInput = screen.getByPlaceholderText('#0E7C6B');
    fireEvent.change(headingInput, { target: { value: '#123456' } });

    expect(handleUpdate).toHaveBeenCalledWith('header', {
      headingColor: '#123456',
    });
  });

  it('displays WCAG contrast badge when custom colors are applied', () => {
    const customizedTheme: ThemeConfig = {
      ...baseThemeConfig,
      sectionStyles: {
        header: {
          headingColor: '#000000', // high contrast on white paper
        },
      },
    };

    render(<SectionCustomizerPanel themeConfig={customizedTheme} />);

    expect(screen.getByText('Tương phản Tiêu đề:')).toBeDefined();
    expect(screen.getByText(/WCAG AAA|WCAG AA/i)).toBeDefined();
  });

  it('triggers onResetSectionStyle when clicking reset this section', () => {
    const handleReset = vi.fn();
    const customizedTheme: ThemeConfig = {
      ...baseThemeConfig,
      sectionStyles: {
        header: {
          headingColor: '#FF0000',
        },
      },
    };

    render(
      <SectionCustomizerPanel
        themeConfig={customizedTheme}
        onResetSectionStyle={handleReset}
      />
    );

    const resetButton = screen.getByText('Đặt lại khối này');
    fireEvent.click(resetButton);

    expect(handleReset).toHaveBeenCalledWith('header');
  });

  it('triggers onApplyStyleToAllSections when clicking apply to all', () => {
    const handleApplyAll = vi.fn();
    const activeHeaderStyle = {
      headingColor: '#1A56DB',
      textColor: '#1E293B',
    };

    const customizedTheme: ThemeConfig = {
      ...baseThemeConfig,
      sectionStyles: {
        header: activeHeaderStyle,
      },
    };

    render(
      <SectionCustomizerPanel
        themeConfig={customizedTheme}
        onApplyStyleToAllSections={handleApplyAll}
      />
    );

    const applyAllButton = screen.getByText('Áp dụng cho tất cả khối');
    fireEvent.click(applyAllButton);

    expect(handleApplyAll).toHaveBeenCalledWith(activeHeaderStyle);
  });
});
