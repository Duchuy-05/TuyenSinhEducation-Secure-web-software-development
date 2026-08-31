import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, BookOpen, Filter, XCircle } from 'lucide-react';
import CourseCard from './course-builder/components/CourseCard';
import { useInstructorCourses } from './hooks/useInstructorCourses';

const CoursesPage: React.FC = () => {
  const { 
    courses, 
    isLoading, 
    handleCreateCourse, 
    handlePublish, 
    handleUnpublish, 
    handleEditCourse 
  } = useInstructorCourses();

  // --- STATE TÌM KIẾM & BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');

  // --- TÍNH SỐ LƯỢNG CHO MỖI TRẠNG THÁI ---
  const counts = useMemo(() => {
    return courses.reduce(
      (acc, course) => {
        const status = course.status?.toUpperCase();
        if (status === 'DRAFT') acc.draft++;
        if (status === 'PUBLISHED') acc.published++;
        return acc;
      },
      { all: courses.length, draft: 0, published: 0 }
    );
  }, [courses]);

  // --- LỌC DANH SÁCH KHÓA HỌC ---
  const filteredCourses = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch = !keyword || course.title?.toLowerCase().includes(keyword);
      const courseStatus = course.status?.toUpperCase();

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'DRAFT' && courseStatus === 'DRAFT') ||
        (statusFilter === 'PUBLISHED' && courseStatus === 'PUBLISHED');

      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full overflow-y-auto bg-slate-50 min-h-screen">
      {/* Header và Thanh Thao Tác */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý khóa học
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Thiết kế, sửa đổi và xuất bản các khóa học của bạn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc theo Trạng thái */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Tất cả <span className="ml-1 opacity-75">({counts.all})</span>
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'DRAFT'
                  ? 'bg-amber-50 text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Bản nháp <span className="ml-1 opacity-75">({counts.draft})</span>
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'PUBLISHED'
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Đã xuất bản <span className="ml-1 opacity-75">({counts.published})</span>
            </button>
          </div>

          {/* Ô Tìm kiếm */}
          <div className="relative flex-1 md:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm khóa học..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Xóa tìm kiếm"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>

          {/* Nút Tạo Khóa Học */}
          <button
            onClick={handleCreateCourse}
            className="flex items-center gap-2 px-5 py-2 hover:bg-blue-700 bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 shrink-0 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <PlusCircle size={18} /> Tạo khóa học
          </button>
        </div>
      </div>

      {/* HIỂN THỊ DANH SÁCH KHÓA HỌC */}
      {isLoading ? (
        /* Skeleton Loading */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
              <div className="aspect-video bg-slate-100 rounded-xl" />
              <div className="h-5 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-10 bg-slate-100 rounded-xl pt-2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        /* Trạng thái chưa có khóa học nào */
        <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center my-8">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có khóa học nào</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-md">
            Bắt đầu chia sẻ kiến thức của bạn bằng cách tạo bản nháp khóa học mới và thiết kế nội dung bài học.
          </p>
          <button
            onClick={handleCreateCourse}
            className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Tạo khóa học ngay
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        /* Trạng thái lọc không ra kết quả */
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl text-center my-8 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
            <Filter size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Không tìm thấy khóa học phù hợp</h3>
          <p className="text-slate-500 text-xs mb-4">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc trạng thái.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        /* Grid danh sách khóa học */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          {filteredCourses.map((course) => {
            const courseKey = course.courseGroupId || course.id || course._id;
            return (
              <CourseCard
                key={courseKey}
                course={course}
                onEdit={handleEditCourse}
                onPublish={handlePublish}
                onUnpublish={handleUnpublish}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;