import React from 'react';
import { PlusCircle, Search, BookOpen } from 'lucide-react';
import CourseCard from './course-builder/components/CourseCard'; // Cập nhật lại đường dẫn tới CourseCard
import { useInstructorCourses } from './hooks/useInstructorCourses';

const CoursesPage: React.FC = () => {
  // Lấy toàn bộ data và hàm xử lý từ Custom Hook
  const { courses, isLoading, handleCreateCourse, handlePublish, handleEditCourse } = useInstructorCourses();

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto bg-slate-50">
      
      {/* Header và nút thêm mới */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Quản lý khóa học</h1>
          <p className="text-slate-500 mt-1 text-sm">Thiết kế, sửa đổi và xuất bản các khóa học của bạn</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm khóa học..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          <button 
            onClick={handleCreateCourse}
            className="flex items-center gap-2 px-5 py-2.5 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shrink-0 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <PlusCircle size={18} /> Tạo khóa học
          </button>
        </div>
      </div>

      {/* Hiển thị danh sách khóa học */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-blue-100 rounded-3xl text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={48} className="text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Chưa có khóa học nào</h3>
          <p className="text-slate-500 mb-6 max-w-md">Bắt đầu chia sẻ kiến thức của bạn bằng cách tạo một bản nháp khóa học mới và thiết kế nội dung.</p>
          <button 
            onClick={handleCreateCourse}
            className="px-6 py-2.5 font-bold text-orange-500 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors cursor-pointer"
          >
            Tạo khóa học ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            {courses.map(course => (
              <CourseCard 
                key={course.courseGroupId} 
                course={course} 
                onEdit={handleEditCourse}
                onPublish={handlePublish}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;
