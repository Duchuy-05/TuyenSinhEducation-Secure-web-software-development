import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { courseApi } from '../services/course.api';
import type { Course } from '../services/course.api';

const CourseGrid: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
    const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const data = await courseApi.getAllCourses();
                // Chỉ hiển thị khóa học đã published ra công khai
                const activeCourses = data.filter(c => c.status === 'published');
                setCourses(activeCourses);
            } catch (err) {
                console.error("Lỗi khi tải khóa học:", err);
                setError("Không thể tải dữ liệu khóa học lúc này.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const updateArrowState = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        updateArrowState();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateArrowState, { passive: true });
        window.addEventListener('resize', updateArrowState);
        return () => {
            el.removeEventListener('scroll', updateArrowState);
            window.removeEventListener('resize', updateArrowState);
        };
    }, [courses, updateArrowState]);

    const scrollByCard = (direction: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const firstCard = el.querySelector<HTMLElement>('.course-slide');
        const gap = 24; // khớp với gap-6 (24px) ở track
        const step = (firstCard?.offsetWidth || 300) + gap;
        el.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    if (isLoading) return <div className="max-w-7xl mx-auto py-12 text-center text-slate-500">Đang tải danh sách khóa học...</div>;
    if (error) return <div className="max-w-7xl mx-auto py-12 text-center text-red-500">{error}</div>;

    return (
        <section id="courses" className="bg-orange-50/50 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-orange-600 bg-orange-100 px-4 py-1.5 rounded-full mb-3">
                        Khóa học nổi bật
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
                        Khai phá tiềm năng của bạn
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Khám phá các khóa học thực chiến được thiết kế riêng cho bạn
                    </p>
                </div>

                {courses.length === 0 ? (
                    <p className="text-center text-slate-400 py-10">Hiện chưa có khóa học nào được xuất bản.</p>
                ) : (
                    <div className="relative">

                        {/* Nút mũi tên trái */}
                        <button
                            type="button"
                            aria-label="Xem khóa học trước"
                            onClick={() => scrollByCard(-1)}
                            className={`group absolute left-0 sm:-left-5 top-[42%] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-orange-100 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 cursor-pointer ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                        >
                            <svg className="w-5 h-5 stroke-orange-500 group-hover:stroke-white transition-colors" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 6l-6 6 6 6" />
                            </svg>
                        </button>

                        {/* Track cuộn ngang */}
                        <div
                            ref={trackRef}
                            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-5 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto"
                        >
                            {courses.map((course, index) => (
                                <Link
                                    to={`/khoa-hoc/${course.id}`}
                                    key={course.id}
                                    className="course-slide group/card shrink-0 snap-start block no-underline
                                        w-[calc(100%/1.2)] sm:w-[calc(100%/2.2)] lg:w-[calc(100%/3.2)] xl:w-[calc(100%/4.2)]"
                                >
                                    <div className="relative bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden h-full flex flex-col transition-all duration-300 group-hover/card:-translate-y-1.5 group-hover/card:shadow-xl group-hover/card:border-orange-400">

                                        <span className="absolute top-2.5 left-3 z-10 text-[11px] font-extrabold text-white bg-slate-800/60 px-2.5 py-0.5 rounded-full tracking-wide">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {/* Ảnh tỉ lệ 16:9 */}
                                        <div className="aspect-video bg-orange-50 overflow-hidden">
                                            <img
                                                src={course.imageUrl || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500'}
                                            />
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 leading-snug">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-2 flex-1">
                                                {course.shortDesc || 'Đang cập nhật mô tả...'}
                                            </p>

                                            {/* chia thành 2 cột */}
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs text-slate-500 mb-1.5">
                                                        Giảng viên:{' '}
                                                        <span className="font-semibold text-black-600 text-sm">
                                                            {course.user?.fullName || course.teacher?.fullName || 'Đang cập nhật'}
                                                        </span>
                                                    </p>

                                                    <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                                                        <Layers size={13} className="text-orange-500" />
                                                        {course.courseData?.length ?? course.syllabus?.length ?? 0} chương
                                                    </p>
                                                </div>

                                                {/* <div className="flex flex-col items-end shrink-0">
                                                    {course.discountPrice ? (
                                                        <>
                                                            <span className="text-base font-extrabold text-orange-600 leading-tight whitespace-nowrap">
                                                                {formatVND(course.discountPrice)}
                                                            </span>
                                                            <span className="text-xs text-slate-400 line-through whitespace-nowrap">
                                                                {formatVND(Number(course.price) || 0)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-base font-extrabold text-blue-600 whitespace-nowrap">
                                                            {formatPriceOrFree(Number(course.price) || 0)}
                                                        </span>
                                                    )}
                                                </div> */}
                                            </div>

                                            <div className="mt-auto flex items-center gap-2 text-orange-600 font-bold text-sm">
                                                <span className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center transition-all duration-300 group-hover/card:bg-orange-500 group-hover/card:translate-x-0.5">
                                                    <svg
                                                        className="w-3.5 h-3.5 stroke-orange-600 group-hover/card:stroke-white transition-colors"
                                                        viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                                    >
                                                        <path d="M5 12h14"></path>
                                                        <path d="m12 5 7 7-7 7"></path>
                                                    </svg>
                                                </span>
                                                Xem chi tiết
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Nút mũi tên phải */}
                        <button
                            type="button"
                            aria-label="Xem khóa học tiếp theo"
                            onClick={() => scrollByCard(1)}
                            className={`group absolute right-0 sm:-right-5 top-[42%] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-orange-100 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-orange-500 hover:border-orange-500 cursor-pointer ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                        >
                            <svg className="w-5 h-5 stroke-orange-500 group-hover:stroke-white transition-colors" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CourseGrid;