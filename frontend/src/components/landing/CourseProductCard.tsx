import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import fallbackImage from '../../assets/course-fallback.svg';
import type { CourseCardViewModel } from './courseViewModel';

export default function CourseProductCard({ course }: { course: CourseCardViewModel }) {
  return (
    <article className="course-product-card">
      <img className="course-card-image" src={course.imageUrl || fallbackImage} alt={`Khóa học ${course.title}`} onError={(event) => { event.currentTarget.src = fallbackImage; }} />
      <div className="course-card-content">
        {course.category && <p className="course-category">{course.category}</p>}
        <h3><Link to={`/khoa-hoc/${course.id}`}>{course.title}</Link></h3>
        {(course.outcome || course.description) && <p>{course.outcome || course.description}</p>}
        <dl>
          {course.duration && <Fragment><dt>Thời lượng</dt><dd>{course.duration}</dd></Fragment>}
          {course.curriculumCount > 0 && <Fragment><dt>Nội dung</dt><dd>{course.curriculumCount} chương</dd></Fragment>}
          {course.teacherName && <Fragment><dt>Giảng viên</dt><dd>{course.teacherName}</dd></Fragment>}
        </dl>
        {course.priceLabel && <p className="course-price">{course.priceLabel} {course.originalPriceLabel && <del>{course.originalPriceLabel}</del>}</p>}
        <Link className="text-link course-card-cta" to={`/khoa-hoc/${course.id}`}>Xem khóa học <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
