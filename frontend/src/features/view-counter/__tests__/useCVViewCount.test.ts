import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useCVViewCount,
  VIEW_DEDUPE_WINDOW_MS,
  getDedupeStorageKey,
} from '../useCVViewCount';
import * as cvStorageService from '../../../services/cvStorageService';

describe('useCVViewCount hook', () => {
  let incrementSpy: any;

  beforeEach(() => {
    sessionStorage.clear();
    incrementSpy = vi.spyOn(cvStorageService, 'incrementCVViewCount').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not increment if cvId is undefined', () => {
    renderHook(() => useCVViewCount({ cvId: undefined, isOwner: false, isPublic: true }));
    expect(incrementSpy).not.toHaveBeenCalled();
  });

  it('should not increment if viewer is the owner of the CV', () => {
    renderHook(() => useCVViewCount({ cvId: 'cv-123', isOwner: true, isPublic: true }));
    expect(incrementSpy).not.toHaveBeenCalled();
  });

  it('should not increment if the CV is private', () => {
    renderHook(() => useCVViewCount({ cvId: 'cv-123', isOwner: false, isPublic: false }));
    expect(incrementSpy).not.toHaveBeenCalled();
  });

  it('should increment view count for a valid public visitor and record timestamp in sessionStorage', () => {
    const cvId = 'cv-valid-01';
    renderHook(() => useCVViewCount({ cvId, isOwner: false, isPublic: true }));

    expect(incrementSpy).toHaveBeenCalledTimes(1);
    expect(incrementSpy).toHaveBeenCalledWith(cvId);

    const storedKey = getDedupeStorageKey(cvId);
    const storedVal = sessionStorage.getItem(storedKey);
    expect(storedVal).not.toBeNull();
    expect(Number(storedVal)).toBeGreaterThan(0);
  });

  it('should deduplicate within 30-minute window and not increment again', () => {
    const cvId = 'cv-dedupe-test';
    const recentTime = Date.now() - 5 * 60 * 1000; // 5 minutes ago
    sessionStorage.setItem(getDedupeStorageKey(cvId), String(recentTime));

    renderHook(() => useCVViewCount({ cvId, isOwner: false, isPublic: true }));
    expect(incrementSpy).not.toHaveBeenCalled();
  });

  it('should increment if previous view was older than 30 minutes', () => {
    const cvId = 'cv-expired-window';
    const oldTime = Date.now() - (VIEW_DEDUPE_WINDOW_MS + 1000); // 30 mins 1 sec ago
    sessionStorage.setItem(getDedupeStorageKey(cvId), String(oldTime));

    renderHook(() => useCVViewCount({ cvId, isOwner: false, isPublic: true }));
    expect(incrementSpy).toHaveBeenCalledTimes(1);
    expect(incrementSpy).toHaveBeenCalledWith(cvId);
  });

  it('should not fire twice in double render (StrictMode simulation)', () => {
    const cvId = 'cv-strictmode';
    const { rerender } = renderHook(
      (props) => useCVViewCount(props),
      {
        initialProps: { cvId, isOwner: false, isPublic: true },
      }
    );

    rerender({ cvId, isOwner: false, isPublic: true });
    expect(incrementSpy).toHaveBeenCalledTimes(1);
  });
});
