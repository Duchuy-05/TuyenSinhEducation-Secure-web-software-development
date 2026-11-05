import { describe, expect, it } from 'vitest';
import { getCurriculumCount, isPublishedCourse, toCourseCardViewModel } from './courseViewModel';

const course = { id: 1, title: 'React', category: 'Frontend', shortDesc: 'Build UI', target: 'Portfolio', imageUrl: '', price: 0, status: 'PUBLISHED', format: 'online' } as any;

describe('course landing view model', () => {
  it('accepts published status in either case and normalizes incomplete data honestly', () => {
    expect(isPublishedCourse(course)).toBe(true);
    expect(isPublishedCourse({ ...course, status: 'published' })).toBe(true);
    expect(isPublishedCourse({ ...course, status: 'DRAFT' })).toBe(false);
    expect(toCourseCardViewModel(course)).toMatchObject({ id: 1, priceLabel: 'Miễn phí', imageUrl: null, teacherName: null });
  });

  it('counts only valid curriculum arrays and only shows a real discount', () => {
    expect(getCurriculumCount({ ...course, courseData: [{ title: 'A' }, { title: 'B' }] })).toBe(2);
    expect(getCurriculumCount({ ...course, syllabus: 'bad' })).toBe(0);
    expect(toCourseCardViewModel({ ...course, price: 100000, discountPrice: 50000 })).toMatchObject({ priceLabel: '50.000₫', originalPriceLabel: '100.000₫' });
  });
});
