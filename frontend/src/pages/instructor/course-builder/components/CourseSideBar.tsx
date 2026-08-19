import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore, Unit, Lesson } from '../store/useCourseStore';
import { FolderPlus, Plus, ChevronDown, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';


export default function CourseSidebar() {
  const navigate = useNavigate();
  
  const { courseData, activeLesson, setActiveLesson } = useCourseStore();
  const updateStoreState = useCourseStore.setState; // Hàm cập nhật nhanh state trong store

  // Quản lý đóng/mở các Unit cục bộ trên UI
  const [expandedUnits, setExpandedUnits] = useState<{ [key: string]: boolean}>({});

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // --- HÀM THÊM CHƯƠNG MỚI ---
  const handleAddUnit = async () => {
    const { value: title } = await Swal.fire({
      title: 'Thêm chương mới',
      input: 'text',
      inputPlaceholder: 'VD: Chương 1: Kiến thức nền tảng',
      showCancelButton: true,
      confirmButtonText: 'Thêm chương',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3b82f6', 
      cancelButtonColor: '#94a3b8',
    });

    if (title?.trim()) {
      const newUnit: Unit = {
        id: `unit_${Date.now()}`,
        title: title.trim(),
        items: []
      };
      
      // Cập nhật lại mảng dữ liệu khóa học trong store
      updateStoreState((state: any) => ({
        courseData: [...state.courseData, newUnit]
      }));
      
      setExpandedUnits(prev => ({ ...prev, [newUnit.id]: true }));
    }
  };

  // --- HÀM THÊM BÀI HỌC MỚI ---
  const handleAddLesson = async (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>, unitId: string) => {
    e.stopPropagation(); // Ngăn hành vi trigger toggle đóng mở Unit
    
    const { value: title } = await Swal.fire({
      title: 'Thêm bài học mới',
      input: 'text',
      inputPlaceholder: 'VD: Bài 1: Cài đặt môi trường',
      showCancelButton: true,
      confirmButtonText: 'Thêm bài',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#f97316', // Cam nổi bật cho hành động thêm
      cancelButtonColor: '#94a3b8',
    });

    if (title?.trim()) {
      const newLesson: Lesson = {
        id: `lesson_${Date.now()}`,
        title: title.trim(),
        isPreview: false,
        blocks: [] // Khởi tạo mảng block nội dung rỗng bên trong bài học
      };

      updateStoreState((state) => ({
        courseData: state.courseData.map((unit: Unit) => 
          unit.id === unitId ? { ...unit, items: [...unit.items, newLesson] } : unit
        )
      }));
    }
  };

  return (
    <div className="flex flex-col w-72 h-full bg-white border-r border-blue-100 shadow-sm shrink-0">
      
      {/* Tiêu đề và Nút quay lại danh sách */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-blue-50">
        <button 
          onClick={() => navigate('/instructor/courses')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} /> Danh sách
        </button>
        <button 
          onClick={handleAddUnit}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
        >
          <FolderPlus size={14} /> + Chương
        </button>
      </div>

      {/* Cấu trúc cây thư mục */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {courseData.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có nội dung. Hãy nhấn nút thêm chương để bắt đầu.
          </div>
        ) : (
          courseData.map((unit: Unit) => {
            const isExpanded = expandedUnits[unit.id];
            return (
              <div key={unit.id} className="border border-blue-50/50 rounded-xl overflow-hidden bg-slate-50/50">
                
                {/* Header hiển thị Chương */}
                <div 
                  onClick={() => toggleUnit(unit.id)}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                    <span className="text-xs font-bold text-blue-950 truncate">{unit.title}</span>
                  </div>
                  
                  {/* Nút thêm nhanh bài học lồng bên trong */}
                  <button 
                    onClick={(e) => handleAddLesson(e, unit.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-orange-500 hover:bg-white rounded-md transition-all border border-transparent hover:border-orange-100 shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Danh sách thêm các bài học thuộc chương */}
                {isExpanded && (
                  <div className="bg-white border-t border-blue-50 divide-y divide-blue-50/30">
                    {unit.items?.map((lesson: Lesson) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <div 
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`flex items-center justify-between px-4 py-2.5 text-xs cursor-pointer transition-all ${
                            isActive 
                              ? 'bg-blue-50/80 border-l-4 border-blue-600 text-blue-700 font-bold' 
                              : 'text-slate-600 hover:bg-orange-50/30 hover:text-orange-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <BookOpen size={13} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {lesson.isPreview && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold text-white bg-green-500 rounded shadow-sm scale-90">
                              FREE
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <div 
                      onClick={(e) => handleAddLesson(e, unit.id)}
                      className="p-2 pl-9 text-[11px] font-semibold text-slate-400 hover:text-blue-500 cursor-pointer transition-colors"
                    >
                      + Thêm bài học mới...
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}