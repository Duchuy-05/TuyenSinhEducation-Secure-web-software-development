import { apiClient } from './apiClient';

// ==========================================
// 1. TYPESCRIPT INTERFACES & TYPES
// ==========================================

export type CourseFormat = 'online' | 'offline' | string;
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string;
export type LessonType = 'video' | 'quiz' | 'document' | string;

export interface BlockContent {
  id: string;
  type: string;
  content: Record<string, unknown>;
  orderIndex?: number;
}

export interface Lesson {
  id: string | number;
  title: string;
  type?: LessonType;
  duration?: string;
  url?: string;
  orderIndex?: number;
  isPreview?: boolean;
  blocks?: BlockContent[];
}

export interface Unit {
  id: string | number;
  title: string;
  items?: Lesson[];
  orderIndex?: number;
}

export interface Chapter {
  id: string | number;
  title: string;
  orderIndex?: number;
  lessons: Lesson[];
  description?: string;
}

export interface Syllabus {
  id?: number | string;
  orderIndex?: number;
  title: string;
  description?: string;
  lessons?: Lesson[];
}

export type CourseCurriculum = Chapter[] | Unit[] | Syllabus[];

export interface CourseUser {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

export interface Course {
  id: number;
  courseGroupId?: string;
  category: string;
  title: string;
  shortDesc: string;
  target: string;
  imageUrl: string;
  duration?: string;
  sessionCount?: number;
  frequency?: string;
  lessonDuration?: string;
  classSize?: string;
  format: CourseFormat;
  price: number;
  discountPrice?: number | null;
  status: CourseStatus;
  teacher?: { fullName: string };
  user?: CourseUser;
  syllabus?: CourseCurriculum;
  courseData?: CourseCurriculum;
  blocks?: Record<string, any[]>;
  blocksByLesson?: Record<string, BlockContent[]>;
}

export interface CreateCourseDto {
  title: string;
  category?: string;
  shortDesc?: string;
  target?: string;
  price?: number;
  format?: CourseFormat;
}

export interface UpdateDraftCourseDto {
  title?: string;
  category?: string;
  shortDesc?: string;
  target?: string;
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
  format?: CourseFormat;
  frequency?: string;
  lessonDuration?: string;
  courseData?: CourseCurriculum;
  blocksByLesson?: Record<string, BlockContent[]>;
  blocks?: Record<string, BlockContent[]>;
  syllabus?: CourseCurriculum;
  chapters?: CourseCurriculum;
  status?: CourseStatus;
}

// Helper Unwrapper giúp chuẩn hóa dữ liệu Axios response
const unwrapData = <T>(response: any): T => {
  return response?.data?.data !== undefined ? response.data.data : response.data;
};

// ==========================================
// 2. PUBLIC / STUDENT COURSE APIs
// ==========================================

export const courseApi = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get('/courses');
    return unwrapData<Course[]>(response);
  },

  getCoursesPaginated: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/courses/pagination', {
      params: { page, limit }
    });
    return response.data;
  },

  getCourseById: async (id: string | number): Promise<Course> => {
    const response = await apiClient.get(`/courses/${id}`);
    const course = unwrapData<Course>(response);

    if (!course.syllabus && !course.courseData) {
      try {
        const syllabusRes = await apiClient.get(`/courses/${id}/syllabus`);
        course.syllabus = unwrapData<CourseCurriculum>(syllabusRes);
      } catch {
        course.syllabus = [];
      }
    }

    return course;
  },

  createCourse: async (data: CreateCourseDto): Promise<Course> => {
    const response = await apiClient.post('/courses', data);
    return unwrapData<Course>(response);
  },

  updateCourse: async (id: number, data: Partial<Course>): Promise<Course> => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return unwrapData<Course>(response);
  },

  deleteCourse: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/courses/${id}`);
    return unwrapData<{ success: boolean }>(response);
  },

  updateCourseSyllabus: async (courseId: number | string, data: { syllabus: CourseCurriculum }) => {
    const response = await apiClient.put(`/courses/${courseId}/syllabus`, data);
    return unwrapData(response);
  },

  createCourseSyllabus: async (courseId: number | string, data: { syllabus: CourseCurriculum }) => {
    const response = await apiClient.post(`/courses/${courseId}/syllabi/bulk`, data);
    return unwrapData(response);
  }
};

// ==========================================
// 3. INSTRUCTOR / LECTURER COURSE APIs
// Khớp 100% với Backend CourseController
// ==========================================

export const instructorCourseApi = {
  // 6. Lấy danh sách khóa học của Giảng viên
  getLecturerCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get('/courses/lecturer', {
      params: { _t: Date.now() },
    });
    return unwrapData<Course[]>(response);
  },

  // 1. Tạo mới bản nháp
  createDraft: async (title: string): Promise<Course> => {
    const response = await apiClient.post('/courses/draft', { title });
    return unwrapData<Course>(response);
  },

  // 2. Lấy thông tin bản nháp theo courseGroupId (Đã bọc Mapper chống mất ảnh)
  getDraft: async (courseGroupId: string): Promise<Course> => {
    const response = await apiClient.get(`/courses/draft/${courseGroupId}`);
    const data = unwrapData<any>(response);

    return {
      ...data,
      // 🟢 Bắt cả 'imageUrl' lẫn 'image' để không bị rỗng ảnh khi load lại
      imageUrl: data?.imageUrl || data?.image || '',
      // 🟢 Đồng bộ lộ trình bài học từ các nguồn field khác nhau
      syllabus: data?.syllabus || data?.courseData || data?.chapters || [],
      courseData: data?.courseData || data?.syllabus || data?.chapters || [],
      // 🟢 Map an toàn các trường văn bản
      shortDesc: data?.shortDesc || data?.description || '',
      target: data?.target || '',
    };
  },

  // 3. Cập nhật bản nháp
  updateDraft: async (courseGroupId: string, data: UpdateDraftCourseDto): Promise<Course> => {
    const normalizedData = {
      ...data,
      courseData: data.courseData || data.syllabus || data.chapters,
      syllabus: data.syllabus || data.courseData || data.chapters,
      chapters: data.chapters || data.courseData || data.syllabus,
      blocks: data.blocks || data.blocksByLesson,
      blocksByLesson: data.blocksByLesson || data.blocks,
    };

    const res = await apiClient.put(`/courses/draft/${courseGroupId}`, normalizedData);
    return unwrapData<Course>(res);
  },

  // Xuất bản khóa học: POST /courses/:courseGroupId/publish
  publishCourse: async (courseGroupId: string): Promise<Course> => {
    const response = await apiClient.post(`/courses/${courseGroupId}/publish`);
    return unwrapData<Course>(response);
  },

  // Gỡ khóa học về bản nháp: PATCH /courses/draft/:courseGroupId/unpublish
  unpublishCourse: async (courseGroupId: string): Promise<Course> => {
    const response = await apiClient.patch(`/courses/draft/${courseGroupId}/unpublish`);
    return unwrapData<Course>(response);
  },

  createChapter: async (courseGroupId: string, chapterTitle: string): Promise<Chapter> => {
    const response = await apiClient.post(`/courses/draft/${courseGroupId}/chapters`, { title: chapterTitle });
    return unwrapData<Chapter>(response);
  },

  updateChapter: async (courseGroupId: string, chapterId: string | number, chapterTitle: string): Promise<Chapter> => {
    const response = await apiClient.put(`/courses/draft/${courseGroupId}/chapters/${chapterId}`, { title: chapterTitle });
    return unwrapData<Chapter>(response);
  },

  deleteChapter: async (courseGroupId: string, chapterId: string | number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/courses/draft/${courseGroupId}/chapters/${chapterId}`);
    return unwrapData<{ success: boolean }>(response);
  },

  createLesson: async (courseGroupId: string, chapterId: string | number, lessonData: Omit<Lesson, 'id'>): Promise<Lesson> => {
    const response = await apiClient.post(`/courses/draft/${courseGroupId}/chapters/${chapterId}/lessons`, lessonData);
    return unwrapData<Lesson>(response);
  },

  updateLesson: async (
    courseGroupId: string,
    chapterId: string | number,
    lessonId: string | number,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> => {
    const response = await apiClient.put(`/courses/draft/${courseGroupId}/chapters/${chapterId}/lessons/${lessonId}`, lessonData);
    return unwrapData<Lesson>(response);
  },

  deleteLesson: async (courseGroupId: string, chapterId: string | number, lessonId: string | number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/courses/draft/${courseGroupId}/chapters/${chapterId}/lessons/${lessonId}`);
    return unwrapData<{ success: boolean }>(response);
  },

  // Đồng bộ toàn bộ danh sách Chương & Bài học về bản nháp
  syncSyllabus: async (courseGroupId: string, syllabusData: CourseCurriculum): Promise<Course> => {
    return instructorCourseApi.updateDraft(courseGroupId, {
      syllabus: syllabusData,
      courseData: syllabusData,
    });
  },
};