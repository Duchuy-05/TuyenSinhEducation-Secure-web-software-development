import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../services/course.api';

interface CourseCardProps {
    course: Course;
    formatVND: (price: number) => string;
    formatPriceOrFree: (price: number) => string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, formatVND, formatPriceOrFree }) => {
    return (
        <Link
            to={`/khoa-hoc/${course.id}`}
            className="bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:shadow-xl hover:border-orange-200/50 transition-all duration-300 overflow-hidden flex flex-col group"
        >
            <div className="relative aspect-video w-full bg-gray-50 overflow-hidden">
                <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            {/* Thân thẻ nội dung */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 group-hover:text-[#e15f41] transition-colors leading-snug">
                        {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {course.shortDesc || 'Chưa cập nhật mô tả ngắn.'}
                    </p>
                </div>

                {/* Phần Chân Card (Giảng viên và Giá tiền) */}
                <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Giảng viên</div>
                        <div className="text-xs font-bold text-black-600 mt-0.5 truncate max-w-[120px]">
                            {course.user?.fullName || course.teacher?.fullName || 'Đang cập nhật'}
                        </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        {course.discountPrice ? (
                            <>
                                <span className="text-base font-extrabold text-blue-600 leading-tight whitespace-nowrap">
                                    {formatVND(course.discountPrice)}
                                </span>
                                <span className="text-xs text-slate-400 line-through whitespace-nowrap">
                                    {formatVND(Number(course.price) || 0)}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-extrabold text-orange-600 whitespace-nowrap">
                                {formatPriceOrFree(Number(course.price) || 0)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};