import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Video,
  HelpCircle,
  X,
  BookOpen,
  Users,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

// ==========================================
// 1. TYPESCRIPT TYPES & INTERFACES
// ==========================================
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz';
  duration: string;
  url?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  status: 'Published' | 'Draft';
  studentsCount: number;
  chapters: Chapter[];
}

// ==========================================
// 2. MOCK DATA INITIAL STATE
// ==========================================
const INITIAL_COURSE_DATA: Course = {
  id: 'c1',
  title: 'Xây dựng ứng dụng React Native nâng cao',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
  status: 'Published',
  studentsCount: 1420,
  chapters: [
    {
      id: 'ch-1',
      title: 'Chương 1: Giới thiệu và Cấu hình Môi trường',
      lessons: [
        { id: 'l-1', title: 'Cài đặt React Native CLI', type: 'video', duration: '12:30' },
        { id: 'l-2', title: 'Bài kiểm tra kiến thức cài đặt', type: 'quiz', duration: '10 phút' }
      ]
    },
    {
      id: 'ch-2',
      title: 'Chương 2: Quản lý State với Redux Toolkit',
      lessons: [
        { id: 'l-3', title: 'Khái niệm về Store, Reducer và Slice', type: 'video', duration: '25:40' },
        { id: 'l-4', title: 'Tích hợp Redux vào ứng dụng', type: 'video', duration: '18:15' }
      ]
    }
  ]
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export const InstructorCourseDetailPage: React.FC = () => {
  const [course, setCourse] = useState<Course>(INITIAL_COURSE_DATA);
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['ch-1']);

  // Modal States
  const [isChapterModalOpen, setIsChapterModalOpen] = useState<boolean>(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterTitleInput, setChapterTitleInput] = useState<string>('');

  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);
  const [targetChapterId, setTargetChapterId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonFormData, setLessonFormData] = useState<{
    title: string;
    type: 'video' | 'quiz';
    duration: string;
  }>({
    title: '',
    type: 'video',
    duration: ''
  });

  // Hotkey listener (Close modal on Esc key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChapterModal();
        closeLessonModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ==========================================
  // PERFORMANCE OPTIMIZATION (useMemo)
  // ==========================================
  const totalLessons = useMemo(() => {
    return course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  }, [course.chapters]);

  // ==========================================
  // CHAPTER HANDLERS
  // ==========================================
  const toggleExpandChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const openAddChapterModal = () => {
    setEditingChapterId(null);
    setChapterTitleInput('');
    setIsChapterModalOpen(true);
  };

  const openEditChapterModal = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setChapterTitleInput(chapter.title);
    setIsChapterModalOpen(true);
  };

  const closeChapterModal = () => {
    setIsChapterModalOpen(false);
    setEditingChapterId(null);
    setChapterTitleInput('');
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitleInput.trim()) return;

    if (editingChapterId) {
      // Cập nhật chương
      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.map((ch) =>
          ch.id === editingChapterId ? { ...ch, title: chapterTitleInput.trim() } : ch
        )
      }));
    } else {
      // Thêm chương mới
      const newChapterId = `ch-${Date.now()}`;
      const newChapter: Chapter = {
        id: newChapterId,
        title: chapterTitleInput.trim(),
        lessons: []
      };
      setCourse((prev) => ({
        ...prev,
        chapters: [...prev.chapters, newChapter]
      }));
      setExpandedChapters((prev) => [...prev, newChapterId]);
    }

    closeChapterModal();
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa chương này cùng toàn bộ bài học bên trong?')) {
      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.filter((ch) => ch.id !== chapterId)
      }));
      setExpandedChapters((prev) => prev.filter((id) => id !== chapterId));
    }
  };

  // ==========================================
  // LESSON HANDLERS
  // ==========================================
  const openAddLessonModal = (chapterId: string) => {
    setTargetChapterId(chapterId);
    setEditingLessonId(null);
    setLessonFormData({ title: '', type: 'video', duration: '' });
    setIsLessonModalOpen(true);
  };

  const openEditLessonModal = (chapterId: string, lesson: Lesson) => {
    setTargetChapterId(chapterId);
    setEditingLessonId(lesson.id);
    setLessonFormData({
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration
    });
    setIsLessonModalOpen(true);
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
    setTargetChapterId(null);
    setEditingLessonId(null);
    setLessonFormData({ title: '', type: 'video', duration: '' });
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapterId || !lessonFormData.title.trim()) return;

    if (editingLessonId) {
      // Cập nhật bài học
      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.map((ch) => {
          if (ch.id === targetChapterId) {
            return {
              ...ch,
              lessons: ch.lessons.map((l) =>
                l.id === editingLessonId
                  ? { ...l, title: lessonFormData.title.trim(), type: lessonFormData.type, duration: lessonFormData.duration.trim() || '5 phút' }
                  : l
              )
            };
          }
          return ch;
        })
      }));
    } else {
      // Thêm bài học mới
      const newLesson: Lesson = {
        id: `l-${Date.now()}`,
        title: lessonFormData.title.trim(),
        type: lessonFormData.type,
        duration: lessonFormData.duration.trim() || '5 phút'
      };

      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.map((ch) => {
          if (ch.id === targetChapterId) {
            return { ...ch, lessons: [...ch.lessons, newLesson] };
          }
          return ch;
        })
      }));

      // Tự động mở chương nếu đang đóng
      if (!expandedChapters.includes(targetChapterId)) {
        setExpandedChapters((prev) => [...prev, targetChapterId]);
      }
    }

    closeLessonModal();
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bài học này?')) {
      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              lessons: ch.lessons.filter((l) => l.id !== lessonId)
            };
          }
          return ch;
        })
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách khóa học
          </button>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              course.status === 'Published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {course.status === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}
          </span>
        </div>

        {/* Course Card Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-center">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full md:w-48 h-32 object-cover rounded-lg border border-gray-100"
          />
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                {course.chapters.length} Chương
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {totalLessons} Bài học
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-600" />
                {course.studentsCount.toLocaleString('vi-VN')} Học viên
              </span>
            </div>
          </div>
          <button
            onClick={openAddChapterModal}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm chương mới
          </button>
        </div>

        {/* Course Curriculum Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Nội dung khóa học</h2>
          
          {course.chapters.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Chưa có chương học nào. Hãy bấm "Thêm chương mới" để bắt đầu.</p>
            </div>
          ) : (
            course.chapters.map((chapter) => {
              const isExpanded = expandedChapters.includes(chapter.id);
              return (
                <div
                  key={chapter.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition"
                >
                  {/* Chapter Header */}
                  <div
                    onClick={() => toggleExpandChapter(chapter.id)}
                    className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-100/60 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                      <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
                      <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {chapter.lessons.length} bài
                      </span>
                    </div>

                    {/* Chapter Quick Actions */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openAddLessonModal(chapter.id)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                        title="Thêm bài học"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditChapterModal(chapter)}
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-md transition"
                        title="Sửa chương"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Xóa chương"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List Under Chapter */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100 border-t border-gray-100">
                      {chapter.lessons.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-400 italic">
                          Chương này chưa có bài học nào.
                        </div>
                      ) : (
                        chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3.5 pl-10 hover:bg-gray-50 transition group"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' ? (
                                <Video className="w-4 h-4 text-blue-500" />
                              ) : (
                                <HelpCircle className="w-4 h-4 text-amber-500" />
                              )}
                              <span className="text-sm font-medium text-gray-700">
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-400">{lesson.duration}</span>
                              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                                <button
                                  onClick={() => openEditLessonModal(chapter.id, lesson)}
                                  className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-200 rounded transition"
                                  title="Sửa bài học"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                  title="Xóa bài học"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==========================================
          MODAL: THÊM / SỬA CHƯƠNG
         ========================================== */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingChapterId ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
              </h3>
              <button onClick={closeChapterModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveChapter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên chương..."
                  value={chapterTitleInput}
                  onChange={(e) => setChapterTitleInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeChapterModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: THÊM / SỬA BÀI HỌC
         ========================================== */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingLessonId ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
              </h3>
              <button onClick={closeLessonModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài học</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên bài học..."
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài học</label>
                <select
                  value={lessonFormData.type}
                  onChange={(e) =>
                    setLessonFormData({
                      ...lessonFormData,
                      type: e.target.value as 'video' | 'quiz'
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="video">Video bài giảng</option>
                  <option value="quiz">Bài kiểm tra (Quiz)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 15:30 hoặc 10 phút"
                  value={lessonFormData.duration}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, duration: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeLessonModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};