import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi, type Course } from '../../services/course.api';
import AsyncSectionState, { type AsyncStatus } from './AsyncSectionState';
import CourseProductCard from './CourseProductCard';
import { isPublishedCourse, toCourseCardViewModel } from './courseViewModel';
export const FEATURED_COURSE_LIMIT = 6;
export default function FeaturedCourses({ loadCourses = courseApi.getAllCourses }: { loadCourses?: () => Promise<Course[]> }) {
  const [status, setStatus] = useState<AsyncStatus>('loading'); const [courses, setCourses] = useState<Course[]>([]);
  const load = useCallback(async () => { setStatus('loading'); try { const result = await loadCourses(); const safe = Array.isArray(result) ? result.filter(isPublishedCourse) : []; setCourses(safe); setStatus(safe.length ? 'success' : 'empty'); } catch { setStatus('error'); } }, [loadCourses]);
  useEffect(() => { void load(); }, [load]);
  return <section id="courses" className="featured-courses landing-section-anchor" aria-labelledby="featured-courses-title"><div className="page-frame"><h2 id="featured-courses-title">Khóa học nổi bật</h2><p className="section-subtitle">So sánh thông tin thực có sẵn trước khi chọn khóa học.</p><AsyncSectionState status={status} title="Khóa học" onRetry={load} emptyAction={{ label: 'Xem tất cả khóa học', href: '/danh-muc-khoa-hoc' }}><div className="course-product-grid">{courses.slice(0, FEATURED_COURSE_LIMIT).map(toCourseCardViewModel).map((course) => <CourseProductCard key={course.id} course={course} />)}</div></AsyncSectionState><Link className="text-link section-link" to="/danh-muc-khoa-hoc">Xem tất cả khóa học</Link></div></section>;
}
