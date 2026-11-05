import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import fallbackImage from '../../assets/course-fallback.svg';
import type { CourseCardViewModel } from './courseViewModel';

export default function CourseProductCard({ course }: { course: CourseCardViewModel }) {
  return (
    <article className="course-product-card">
      <img src={course.imageUrl || fallbackImage} alt={`Khóa học ${course.title}`} onError={(event) => { event.currentTarget.src = fallbackImage; }} />
      <div>
        <h3><Link to={`/khoa-hoc/${course.id}`}>{course.title}</Link></h3>
        {(course.outcome || course.description) && <p>{course.outcome || course.description}</p>}
        <dl>
          {course.category && <Fragment><dt>Danh mục</dt><dd>{course.category}</dd></Fragment>}
          {course.duration && <Fragment><dt>Thời lượng</dt><dd>{course.duration}</dd></Fragment>}
          {course.curriculumCount > 0 && <Fragment><dt>Nội dung</dt><dd>{course.curriculumCount} chương</dd></Fragment>}
          {course.teacherName && <Fragment><dt>Giảng viên</dt><dd>{course.teacherName}</dd></Fragment>}
        </dl>
        {course.priceLabel && <p className="course-price">{course.priceLabel} {course.originalPriceLabel && <del>{course.originalPriceLabel}</del>}</p>}
        <Link className="text-link" to={`/khoa-hoc/${course.id}`}>Xem khóa học</Link>
      </div>
    </article>
  );
}
