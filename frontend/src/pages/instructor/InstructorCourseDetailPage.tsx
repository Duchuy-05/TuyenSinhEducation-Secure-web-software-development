import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   ArrowLeft, Plus, Settings, Edit, Trash2,
   X, ChevronDown, ChevronRight, Video, HelpCircle,
   MoreVertical, Save, LayoutDashboard
} from 'lucide-react';

// --- MOCK DATA (Should be fetched from API based on courseId) ---
const mockCoursesData = [
   {
      id: 'c1',
      title: 'ReactJS Từ Cơ Bản Đến Nâng Cao',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      status: 'Published',
      studentsCount: 1540,
      chapters: [
         {
            id: 'ch1', title: 'Chương 1: Khởi đầu với React', lessons: [
               { id: 'l1', title: 'Cài đặt môi trường Node.js', type: 'video', duration: '12:05' },
               { id: 'l2', title: 'Tạo dự án React đầu tiên', type: 'video', duration: '20:15' },
               { id: 'q1', title: 'Quiz: Kiến thức cơ bản', type: 'quiz', duration: '10 Câu hỏi' }
            ]
         },
         {
            id: 'ch2', title: 'Chương 2: Hooks và State Management', lessons: [
               { id: 'l3', title: 'Hiểu sâu về useState', type: 'video', duration: '15:30' },
               { id: 'l4', title: 'useEffect và Lifecycle', type: 'video', duration: '25:00' }
            ]
         }
      ]
   },
   {
      id: 'c2',
      title: 'UI/UX Design Cơ Bản Cho Lập Trình Viên',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
      status: 'Draft',
      studentsCount: 0,
      chapters: [
         {
            id: 'ch3', title: 'Chương 1: Nguyên lý thiết kế', lessons: [
               { id: 'l5', title: 'Màu sắc và Typography', type: 'video', duration: '30:00' }
            ]
         }
      ]
   }
];

const InstructorCourseDetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();

   // --- STATES ---
   const [course, setCourse] = useState<any>(null);
   const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
   const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
   const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
   const [activeChapterIdForNewLesson, setActiveChapterIdForNewLesson] = useState<string | null>(null);

   const [newChapterTitle, setNewChapterTitle] = useState('');
   const [newLessonData, setNewLessonData] = useState({ title: '', type: 'video', url: '' });

   // Load mock data on mount
   useEffect(() => {
      const foundCourse = mockCoursesData.find(c => c.id === id);
      if (foundCourse) {
         setCourse(foundCourse);
         if (foundCourse.chapters.length > 0) {
            setExpandedChapters([foundCourse.chapters[0].id]);
         }
      }
   }, [id]);

   if (!course) {
      return <div className="p-8 text-center text-gray-500">Đang tải khóa học...</div>;
   }

   // --- HANDLERS ---
   const toggleChapter = (chapterId: string) => {
      setExpandedChapters(prev =>
         prev.includes(chapterId) ? prev.filter(cId => cId !== chapterId) : [...prev, chapterId]
      );
   };

   const handleSaveChapter = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newChapterTitle.trim()) return;

      const newChapter = {
         id: `ch_${Date.now()}`,
         title: newChapterTitle,
         lessons: []
      };

      const updatedCourse = { ...course, chapters: [...course.chapters, newChapter] };
      setCourse(updatedCourse);
      setNewChapterTitle('');
      setIsChapterModalOpen(false);
      setExpandedChapters([...expandedChapters, newChapter.id]);
   };

   const handleSaveLesson = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLessonData.title.trim() || !activeChapterIdForNewLesson) return;

      const newLesson = {
         id: `l_${Date.now()}`,
         title: newLessonData.title,
         type: newLessonData.type,
         duration: newLessonData.type === 'video' ? '00:00' : '5 Câu hỏi'
      };

      const updatedCourse = {
         ...course,
         chapters: course.chapters.map((ch: any) => {
            if (ch.id === activeChapterIdForNewLesson) {
               return { ...ch, lessons: [...ch.lessons, newLesson] };
            }
            return ch;
         })
      };

      setCourse(updatedCourse);
      setNewLessonData({ title: '', type: 'video', url: '' });
      setIsLessonModalOpen(false);
      setActiveChapterIdForNewLesson(null);
   };

   return (
      <div className="p-4 lg:p-8 mx-auto min-h-[calc(100vh-72px)] bg-[#F5F7FA]">

         {/* Top Navigation */}
         <div className="mb-6">
            <button
               onClick={() => navigate('/instructor/courses')}
               className="flex items-center gap-2 text-gray-500 hover:text-[#E5664B] transition-colors text-sm font-medium"
            >
               <ArrowLeft size={16} /> Quay lại Danh sách Khóa học
            </button>
         </div>

         {/* Header */}
         <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
               <img src={course.thumbnail} alt="Thumbnail" className="w-32 h-20 object-cover rounded-xl shadow-sm" />
               <div>
                  <h1 className="text-2xl font-bold text-[#1F2937] mb-2">{course.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                     <span className="flex items-center gap-1.5"><LayoutDashboard size={16} /> {course.chapters.length} Chương</span>
                     <span className="flex items-center gap-1.5"><Video size={16} /> {course.chapters.reduce((a: any, c: any) => a + c.lessons.length, 0)} Bài học</span>
                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${course.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {course.status === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}
                     </span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center gap-2">
                  <Settings size={18} /> Cài đặt khóa học
               </button>
               <button className="bg-[#E5664B] hover:bg-[#d6553a] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2">
                  <Save size={18} /> Lưu thay đổi
               </button>
            </div>
         </div>

         {/* Course Builder Content */}
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">Chương trình giảng dạy (Syllabus)</h2>
            <button
               onClick={() => setIsChapterModalOpen(true)}
               className="bg-orange-50 text-[#E5664B] hover:bg-[#E5664B] hover:text-white font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-2 text-sm border border-orange-100 hover:border-transparent"
            >
               <Plus size={18} /> Thêm Chương mới
            </button>
         </div>

         <div className="space-y-4">
            {course.chapters.map((chapter: any) => {
               const isExpanded = expandedChapters.includes(chapter.id);
               return (
                  <div key={chapter.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden transition-all duration-200 hover:border-gray-300">
                     {/* Chapter Header */}
                     <div
                        className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors select-none"
                        onClick={() => toggleChapter(chapter.id)}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-orange-100 text-[#E5664B]' : 'bg-gray-100 text-gray-500'}`}>
                              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                           </div>
                           <h3 className="font-bold text-[#1F2937] text-lg">{chapter.title}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {chapter.lessons.length} bài học
                           </span>
                           <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                 <Edit size={18} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </div>
                     </div>

                     {/* Chapter Body (Lessons) */}
                     {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                           <div className="space-y-2">
                              {chapter.lessons.map((lesson: any) => (
                                 <div key={lesson.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 transition-all group">
                                    <div className="flex items-center gap-4">
                                       <div className={`p-2.5 rounded-xl ${lesson.type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                          {lesson.type === 'video' ? <Video size={18} /> : <HelpCircle size={18} />}
                                       </div>
                                       <div>
                                          <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                                          <p className="text-xs text-gray-500 font-medium mt-1">{lesson.duration}</p>
                                       </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"><Edit size={16} /></button>
                                       <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                       <button className="p-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                 </div>
                              ))}

                              {/* Add Lesson Button inside Chapter */}
                              <button
                                 onClick={() => {
                                    setActiveChapterIdForNewLesson(chapter.id);
                                    setIsLessonModalOpen(true);
                                 }}
                                 className="w-full flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-500 border-2 border-dashed border-gray-300 hover:border-[#E5664B] hover:text-[#E5664B] hover:bg-orange-50 rounded-xl transition-colors mt-3"
                              >
                                 <Plus size={18} /> Thêm bài học mới
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>

         {/* MODALS */}
         {/* 1. Modal Thêm Chương */}
         {isChapterModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-gray-800">Thêm Chương mới</h2>
                     <button onClick={() => setIsChapterModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSaveChapter}>
                     <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề Chương</label>
                        <input
                           type="text"
                           autoFocus
                           placeholder="Ví dụ: Chương 1: Kiến thức cơ bản..."
                           value={newChapterTitle}
                           onChange={(e) => setNewChapterTitle(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium"
                        />
                     </div>
                     <div className="flex gap-3">
                        <button type="button" onClick={() => setIsChapterModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={!newChapterTitle.trim()} className="flex-1 py-3 bg-[#E5664B] hover:bg-[#d6553a] text-white font-bold rounded-xl transition-colors disabled:opacity-50">Lưu Chương</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* 2. Modal Thêm Bài học */}
         {isLessonModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-gray-800">Thêm Bài học mới</h2>
                     <button onClick={() => setIsLessonModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSaveLesson} className="space-y-5">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Loại nội dung</label>
                        <div className="flex gap-4">
                           <label className={`flex-1 flex flex-col items-center gap-2 p-4 border rounded-2xl cursor-pointer transition-all ${newLessonData.type === 'video' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <input type="radio" name="lessonType" value="video" checked={newLessonData.type === 'video'} onChange={(e) => setNewLessonData({ ...newLessonData, type: e.target.value })} className="sr-only" />
                              <Video size={24} />
                              <span className="text-sm font-bold">Video Bài giảng</span>
                           </label>
                           <label className={`flex-1 flex flex-col items-center gap-2 p-4 border rounded-2xl cursor-pointer transition-all ${newLessonData.type === 'quiz' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <input type="radio" name="lessonType" value="quiz" checked={newLessonData.type === 'quiz'} onChange={(e) => setNewLessonData({ ...newLessonData, type: e.target.value })} className="sr-only" />
                              <HelpCircle size={24} />
                              <span className="text-sm font-bold">Bài Tập / Quiz</span>
                           </label>
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên bài học</label>
                        <input
                           type="text"
                           placeholder="Nhập tên bài học..."
                           value={newLessonData.title}
                           onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium"
                        />
                     </div>

                     {newLessonData.type === 'video' && (
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Link Video (Youtube/Vimeo)</label>
                           <input
                              type="url"
                              placeholder="https://..."
                              value={newLessonData.url}
                              onChange={(e) => setNewLessonData({ ...newLessonData, url: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                           />
                        </div>
                     )}

                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsLessonModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={!newLessonData.title.trim()} className="flex-1 py-3 bg-[#E5664B] hover:bg-[#d6553a] text-white font-bold rounded-xl transition-colors disabled:opacity-50">Lưu Bài học</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default InstructorCourseDetailPage;
