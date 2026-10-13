import { describe, it, expect } from 'vitest';
import { getCVByIdOrSlug, searchProfiles, mockProfilesList } from '../mockProfiles';

describe('mockProfiles utilities', () => {
  it('test_not_found_routing_unknown_id: should return undefined for non-existent id or slug', () => {
    expect(getCVByIdOrSlug('non-existent-id-999')).toBeUndefined();
    expect(getCVByIdOrSlug('fake-slug-xyz')).toBeUndefined();
    expect(getCVByIdOrSlug('')).toBeUndefined();
  });

  it('should find profile by exact ID or slug', () => {
    const first = mockProfilesList[0];
    expect(getCVByIdOrSlug(first.id)?.id).toBe(first.id);
    expect(getCVByIdOrSlug(first.slug)?.id).toBe(first.id);
  });

  it('test_search_filter_logic_homepage: should filter profiles by search keyword', () => {
    const results = searchProfiles('Thanh Trúc');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].personalInfo.fullName).toContain('Thanh Trúc');
  });

  it('should return empty array for search keywords that match nothing', () => {
    const results = searchProfiles('__non_matching_search_query_999__');
    expect(results).toEqual([]);
  });
});
