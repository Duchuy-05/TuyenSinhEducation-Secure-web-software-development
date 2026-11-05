import type { Course } from '../../services/course.api';
import { formatPriceOrFree, formatVND } from '../../utils/format.util';

export type CourseCardViewModel = {
  id: number; title: string; description: string | null; outcome: string | null;
  category: string | null; duration: string | null; curriculumCount: number;
  teacherName: string | null; imageUrl: string | null; priceLabel: string | null; originalPriceLabel: string | null;
};

export const isPublishedCourse = (course: Course): boolean => String(course.status).toLowerCase() === 'published';
export const getCurriculumCount = (course: Course): number => {
  const curriculum = Array.isArray(course.courseData) ? course.courseData : Array.isArray(course.syllabus) ? course.syllabus : [];
  return curriculum.length;
};
export const toCourseCardViewModel = (course: Course): CourseCardViewModel => {
  const price = Number(course.price);
  const discount = Number(course.discountPrice);
  const discounted = Number.isFinite(discount) && discount > 0 && Number.isFinite(price) && discount < price;
  return {
    id: course.id, title: course.title || 'Khóa học', description: course.shortDesc || null, outcome: course.target || null,
    category: course.category || null, duration: course.duration || null, curriculumCount: getCurriculumCount(course),
    teacherName: course.user?.fullName || course.teacher?.fullName || null, imageUrl: course.imageUrl || null,
    priceLabel: Number.isFinite(price) ? formatPriceOrFree(discounted ? discount : price) : null,
    originalPriceLabel: discounted ? formatVND(price) : null,
  };
};
