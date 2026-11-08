import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi, type Course } from '../../services/course.api';
import AsyncSectionState, { type AsyncStatus } from './AsyncSectionState';
import CourseProductCard from './CourseProductCard';
import { isPublishedCourse, toCourseCardViewModel } from './courseViewModel';

export const FEATURED_COURSE_PAGE_SIZE = 3;

export function getFeaturedCoursePage<T>(items: T[], requestedPage: number, pageSize = FEATURED_COURSE_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;
  return { page, totalPages, items: items.slice(start, start + pageSize) };
}

export default function FeaturedCourses({ loadCourses = courseApi.getAllCourses, onSettled }: { loadCourses?: () => Promise<Course[]>; onSettled?: () => void }) {
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const load = useCallback(async () => { setStatus('loading'); try { const result = await loadCourses(); const safe = Array.isArray(result) ? result.filter(isPublishedCourse) : []; setCourses(safe); setPage(1); setStatus(safe.length ? 'success' : 'empty'); } catch { setStatus('error'); } finally { onSettled?.(); } }, [loadCourses, onSettled]);
  useEffect(() => { void load(); }, [load]);
  const coursePage = getFeaturedCoursePage(courses, page);
  const hasMultiplePages = status === 'success' && coursePage.totalPages > 1;
  return <section id="courses" className="featured-courses landing-section-anchor" aria-labelledby="featured-courses-title"><div className="featured-courses-title-band"><div className="page-frame"><h2 id="featured-courses-title">Khóa học nổi bật</h2></div></div><div className="page-frame featured-courses-content"><AsyncSectionState status={status} title="Khóa học" onRetry={load} emptyAction={{ label: 'Xem tất cả khóa học', href: '/danh-muc-khoa-hoc' }}><div className="featured-course-page" key={coursePage.page}><div className="course-product-grid">{coursePage.items.map(toCourseCardViewModel).map((course) => <CourseProductCard key={course.id} course={course} />)}</div></div>{hasMultiplePages && <nav className="featured-course-pagination" aria-label="Phân trang khóa học nổi bật"><button type="button" className="featured-course-arrow" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={coursePage.page === 1} aria-label="Khóa học trước">←</button><p className="featured-course-page-status" aria-live="polite">Trang {coursePage.page} / {coursePage.totalPages}</p><button type="button" className="featured-course-arrow" onClick={() => setPage((current) => Math.min(coursePage.totalPages, current + 1))} disabled={coursePage.page === coursePage.totalPages} aria-label="Khóa học tiếp theo">→</button></nav>}</AsyncSectionState><Link className="text-link section-link" to="/danh-muc-khoa-hoc">Xem tất cả khóa học</Link></div></section>;
}
