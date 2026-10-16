import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareDropdown } from '../ShareDropdown';
import { mockCVData } from '../../../data/mockCVData';

describe('ShareDropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button and remains closed initially', () => {
    render(<ShareDropdown cv={mockCVData} />);
    const trigger = screen.getByRole('button', { name: /chia sẻ/i });
    expect(trigger).toBeDefined();
    expect(screen.queryByText(/sao chép đường dẫn/i)).toBeNull();
  });

  it('opens menu when clicking the trigger button', () => {
    render(<ShareDropdown cv={mockCVData} />);
    const trigger = screen.getByRole('button', { name: /chia sẻ/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/sao chép đường dẫn/i)).toBeDefined();
    expect(screen.getByText(/chia sẻ qua email/i)).toBeDefined();
    expect(screen.getByText(/xuất file pdf/i)).toBeDefined();
    expect(screen.getByText(/in ra giấy a4/i)).toBeDefined();
  });

  it('displays "Đang phát triển" badge for disabled PDF and Print options', () => {
    render(<ShareDropdown cv={mockCVData} />);
    fireEvent.click(screen.getByRole('button', { name: /chia sẻ/i }));

    const devBadges = screen.getAllByText(/đang phát triển/i);
    expect(devBadges.length).toBe(2);
  });

  it('toggles visibility and notifies callback when clicking toggle button', () => {
    const onUpdateVisibility = vi.fn();
    const publicCV = { ...mockCVData, isPublic: true };

    render(
      <ShareDropdown
        cv={publicCV}
        isOwner={true}
        onUpdateVisibility={onUpdateVisibility}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /chia sẻ/i }));

    // Toggle button should say "Để Cá Nhân" when currently public
    const toggleBtn = screen.getByRole('button', { name: /để cá nhân/i });
    expect(toggleBtn).toBeDefined();

    fireEvent.click(toggleBtn);
    expect(onUpdateVisibility).toHaveBeenCalledWith(false);
  });

  it('copies link to clipboard when clicking copy link', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ShareDropdown cv={mockCVData} />);
    fireEvent.click(screen.getByRole('button', { name: /chia sẻ/i }));

    const copyBtn = screen.getByRole('button', { name: /sao chép đường dẫn/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
  });

  it('displays toast when clicking disabled PDF export', () => {
    render(<ShareDropdown cv={mockCVData} />);
    fireEvent.click(screen.getByRole('button', { name: /chia sẻ/i }));

    const pdfItem = screen.getByText(/xuất file pdf/i).closest('div');
    expect(pdfItem).not.toBeNull();
    if (pdfItem) {
      fireEvent.click(pdfItem);
    }

    expect(
      screen.getByText(/tính năng "xuất file pdf" đang được hoàn thiện/i)
    ).toBeDefined();
  });
});
