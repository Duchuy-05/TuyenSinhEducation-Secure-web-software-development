import React from 'react';
import { BookOpen, User, Tag } from 'lucide-react';
import { CourseListItem } from '../../hooks/useInstructorCourses';

// --- ĐỊNH NGHĨA PROPS ---
interface CourseCardProps {
  course: CourseListItem; // Tái sử dụng Interface từ hook
  onEdit: (courseGroupId: string) => void;
  onPublish: (courseGroupId: string) => void;
}

export default function CourseCard({ course, onEdit, onPublish }: CourseCardProps) {
  const isDraft = course.status === 'draft';

  return (
    <div className="flex flex-col bg-white border border-blue-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group relative">

      {/* Huy hiệu Trạng thái */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
          isDraft ? 'bg-blue-100 text-gray-600' : 'bg-orange-100 text-orange-600'
        }`}>
          {isDraft ? 'Bản nháp' : course.status === 'archived' ? 'Lưu trữ' : 'Xuất bản'}
        </span>
      </div>

      {/* Hình ảnh */}
      <div className="h-48 bg-slate-100 overflow-hidden relative">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300">
             <BookOpen size={48} />
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-blue-950 mb-2 line-clamp-2" title={course.title}>
          {course.title || 'Chưa có tên'}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex flex-col items-end w-full">
            {course.discountPrice ? (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}
                </span>
                <span className="text-lg font-bold text-orange-500">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-blue-600 w-full text-right">
                {(course.price && course.price > 0) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price) : 'Miễn phí'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nút thao tác */}
      <div className="flex gap-2 p-4 pt-0">
        <button
          onClick={() => onEdit(course.courseGroupId)}
          className="flex-1 py-2.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={() => onPublish(course.courseGroupId)}
          className="flex-1 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Xuất bản
        </button>
      </div>
    </div>
  );
}