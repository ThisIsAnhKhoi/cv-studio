import { useEffect, useRef } from 'react';
import { incrementCVViewCount } from '../../services/cvStorageService';

export const VIEW_DEDUPE_WINDOW_MS = 30 * 60 * 1000; // 30 phút

export function getDedupeStorageKey(cvId: string): string {
  return `cv_studio_viewed_${cvId}`;
}

export function isBotUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent || '';
  return /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(ua);
}

export interface UseCVViewCountOptions {
  cvId: string | undefined;
  isOwner: boolean;
  isPublic: boolean;
}

/**
 * Custom hook to record and debounce valid CV views.
 * - Deduplicates views within 30 minutes using sessionStorage.
 * - Ignores visits from CV owner (isOwner === true).
 * - Ignores private/draft CVs (isPublic === false).
 * - Filters out automated crawlers and bots.
 * - Immune to React 18 StrictMode double-invocations.
 */
export function useCVViewCount({ cvId, isOwner, isPublic }: UseCVViewCountOptions): void {
  const hasIncrementedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!cvId || isOwner || !isPublic) return;
    if (hasIncrementedRef.current) return;
    if (isBotUserAgent()) return;

    if (typeof sessionStorage !== 'undefined') {
      try {
        const storageKey = getDedupeStorageKey(cvId);
        const storedTimestamp = sessionStorage.getItem(storageKey);

        if (storedTimestamp) {
          const lastViewedAt = parseInt(storedTimestamp, 10);
          if (!isNaN(lastViewedAt) && Date.now() - lastViewedAt < VIEW_DEDUPE_WINDOW_MS) {
            // Already viewed within the last 30 minutes
            return;
          }
        }

        // Mark as incremented for this component lifecycle
        hasIncrementedRef.current = true;
        sessionStorage.setItem(storageKey, String(Date.now()));

        // Trigger atomic Firestore increment
        incrementCVViewCount(cvId).catch((err) => {
          console.warn('Lỗi khi kích hoạt đếm view:', err);
        });
      } catch (err) {
        console.warn('Lỗi khi đọc/ghi sessionStorage cho view counter:', err);
      }
    }
  }, [cvId, isOwner, isPublic]);
}
