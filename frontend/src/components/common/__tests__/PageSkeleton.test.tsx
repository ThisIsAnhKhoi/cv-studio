import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PageSkeleton } from '../PageSkeleton';

describe('PageSkeleton Component', () => {
  it('should render loading status with accessible role and label', () => {
    render(<PageSkeleton />);
    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeDefined();
    expect(statusElement.getAttribute('aria-label')).toBe('Đang tải trang...');
    expect(screen.getByText('Đang tải giao diện Studio...')).toBeDefined();
  });
});
