import React, { useState } from 'react';
import { BookOpen, CheckCircle, Edit3, Globe, Lock, Loader2 } from 'lucide-react';
import { CourseListItem } from '../../hooks/useInstructorCourses';

export interface CourseCardProps {
  course: CourseListItem;
  onEdit: (courseGroupId: string) => void;
  onPublish: (courseGroupId: string) => void;
  onUnpublish?: (courseGroupId: string) => void;
  isLoading?: boolean;
}

// Format tiền tệ tối ưu performance
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const CourseCard = React.memo(({
  course,
  onEdit,
  onPublish,
  onUnpublish,
  isLoading = false
}: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  // 1. Lấy ID an toàn
  const targetGroupId = String(course.courseGroupId || course.id || '');

  // 2. Chuẩn hóa status chính xác
  const rawStatus = String(course.status || '').toLowerCase().trim();

  // ƯU TIÊN KIỂM TRA DRAFT TRƯỚC
  const isDraft = rawStatus === 'draft' || rawStatus === 'unpublished' || course.isPublished === false;

  const isPublished =
    !isDraft &&
    (rawStatus === 'published' ||
      rawStatus === '1' ||
      rawStatus === 'active' ||
      rawStatus === 'true' ||
      course.isPublished === true);

  const isArchived = rawStatus === 'archived' || rawStatus === '2';

  return (
    <div className="flex flex-col bg-white border border-slate-200/80 hover:border-blue-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      
      {/* Badge Trạng thái */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md transition-all ${
            isPublished
              ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-200'
              : isArchived
              ? 'bg-gray-100/90 text-gray-700 border border-gray-200'
              : 'bg-amber-100/90 text-amber-800 border border-amber-200'
          }`}
        >
          {isPublished ? (
            <>
              <CheckCircle size={12} className="text-emerald-600" />
              Đã xuất bản
            </>
          ) : isArchived ? (
            'Lưu trữ'
          ) : (
            'Bản nháp'
          )}
        </span>
      </div>

      {/* Ảnh Khóa học */}
      <div className="h-48 bg-slate-100 overflow-hidden relative">
        {course.imageUrl && !imageError ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50 select-none">
            <BookOpen size={40} className="mb-1 opacity-50 stroke-[1.5]" />
            <span className="text-xs text-slate-400 font-medium">Chưa có ảnh bìa</span>
          </div>
        )}
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
          title={course.title}
        >
          {course.title || 'Chưa có tên khóa học'}
        </h3>

        {/* Khối hiển thị giá */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex flex-col items-end w-full">
            {course.discountPrice && course.discountPrice > 0 ? (
              <>
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(course.price || 0)}
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(course.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-blue-600 w-full text-right">
                {course.price && course.price > 0 ? formatCurrency(course.price) : 'Miễn phí'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nút Thao tác */}
      <div className="flex gap-2 p-4 pt-0">
        <button
          onClick={() => onEdit(targetGroupId)}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
          Chỉnh sửa
        </button>

        {!isPublished ? (
          <button
            onClick={() => onPublish(targetGroupId)}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm shadow-orange-200"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
            Xuất bản
          </button>
        ) : (
          onUnpublish && (
            <button
              onClick={() => onUnpublish(targetGroupId)}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Gỡ xuống
            </button>
          )
        )}
      </div>
    </div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;