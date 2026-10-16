import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ExplorePage } from '../../../pages/ExplorePage';
import * as cvStorageService from '../../../services/cvStorageService';
import { mockProfilesList } from '../../../data/mockProfiles';

describe('ExplorePage Component', () => {
  beforeEach(() => {
    vi.spyOn(cvStorageService, 'getExploreCVs').mockResolvedValue({
      cvs: mockProfilesList,
      lastVisible: null,
      hasMore: false,
    });
  });

  it('renders page header and search input', async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Khám Phá Hồ Sơ & Portfolio')).toBeDefined();
    expect(
      screen.getByPlaceholderText(/Tìm kiếm theo họ tên, chức danh/i)
    ).toBeDefined();
  });

  it('renders all category pills', async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Tất Cả Ngành Nghề')).toBeDefined();
    expect(screen.getByText('CNTT & Phần mềm')).toBeDefined();
    expect(screen.getByText('Thiết kế & UI/UX')).toBeDefined();
    expect(screen.getByText('Dữ liệu & AI')).toBeDefined();
    expect(screen.getByText('Marketing & Media')).toBeDefined();
  });

  it('renders profile cards returned by getExploreCVs', async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trần Anh Khôi')).toBeDefined();
      expect(screen.getByText('Nguyễn Lê Thanh Trúc')).toBeDefined();
    });
  });

  it('filters profiles dynamically when typing in search input (tone-insensitive)', async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trần Anh Khôi')).toBeDefined();
    });

    const input = screen.getByPlaceholderText(/Tìm kiếm theo họ tên, chức danh/i);
    // Typing without tone accents
    fireEvent.change(input, { target: { value: 'khoi' } });

    expect(screen.getByText('Trần Anh Khôi')).toBeDefined();
    expect(screen.queryByText('Nguyễn Lê Thanh Trúc')).toBeNull();
  });

  it('shows empty state when no profiles match', async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trần Anh Khôi')).toBeDefined();
    });

    const input = screen.getByPlaceholderText(/Tìm kiếm theo họ tên, chức danh/i);
    fireEvent.change(input, { target: { value: 'khongcotrongdanhba99999' } });

    expect(
      screen.getByText('Không tìm thấy hồ sơ nào phù hợp')
    ).toBeDefined();
  });

  it('calls getExploreCVs with updated sort when clicking Mới Cập Nhật', async () => {
    const spy = vi.spyOn(cvStorageService, 'getExploreCVs');
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    const newestBtn = screen.getByText('Mới Cập Nhật');
    fireEvent.click(newestBtn);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'newest' })
      );
    });
  });
});
