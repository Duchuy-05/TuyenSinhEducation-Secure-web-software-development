import { create } from 'zustand';
import { instructorCourseApi } from '../../../../services/course.api';  
import Swal from 'sweetalert2';

export interface Lesson {
  id: string;
  title: string;
  isPreview: boolean;
  blocks?: any[];
}

export interface Unit {
  id: string;
  title: string;
  items: Lesson[];
}

export interface CourseDetails {
  title: string;
  shortDesc: string;
  imageUrl: string;
  target: string;
  category: string;
  format: string;
  price: number;
  frequency: string;
  lessonDuration: string;
}

interface CourseState {
  courseDetails: CourseDetails;
  courseData: Unit[]; // Chứa Units và Lessons
  blocksByLesson: Record<string, any[]>; // Chứa nội dung (Video, text, quiz) theo lessonId
  activeLesson: Lesson | null;
  isLoading: boolean;

  fetchDraftData: (courseId: string) => Promise<void>;
  saveDraft: (courseId: string) => Promise<void>;
  setActiveLesson: (lesson: Lesson) => void;
  updateCourseDetails: (patch: Partial<CourseDetails>) => void;

  addBlock: (lessonId: string, type: string) => void;
  updateBlockData: (lessonId: string, blockId: string, data: any) => void;
  deleteBlock: (lessonId: string, blockId: string) => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courseDetails: {
    title: '',
    shortDesc: '',
    target: '',
    category: '',
    imageUrl: '',
    format: 'online',
    price: 0,
    frequency: '',
    lessonDuration: '',
  },
  courseData: [],
  blocksByLesson: {},
  activeLesson: null,
  isLoading: false,

  fetchDraftData: async (courseId) => {
    set({ isLoading: true });
    try {
      const response = await instructorCourseApi.getDraft(courseId);
      const data = response.data.data;
      set({
        courseDetails: {
          title: data.title || '',
          shortDesc: data.shortDesc || '',
          target: data.target || '',
          category: data.category || '',
          imageUrl: data.imageUrl || '',
          format: data.format || 'online',
          price: Number(data.price) || 0,
          frequency: data.frequency || '',
          lessonDuration: data.lessonDuration || '',
        },
        courseData: data.courseData || [],
        blocksByLesson: data.blocks || {},
      });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bản nháp:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveDraft: async (courseId) => {
    const state = get();
    Swal.fire({ title: 'Đang lưu...', didOpen: () => Swal.showLoading() });
    try {
      await instructorCourseApi.updateDraft(courseId, {
        ...state.courseDetails,
        courseData: state.courseData,
        blocks: state.blocksByLesson,
      });
      Swal.fire('Thành công', 'Đã lưu bản nháp', 'success');
    } catch (error) {
      console.error('Lỗi khi lưu bản nháp:', error);
      Swal.fire('Lỗi', 'Không thể lưu', 'error');
    }
  },

  setActiveLesson: (lesson) => set({ activeLesson: lesson }),

  updateCourseDetails: (patch) =>
    set((state) => ({
      courseDetails: { ...state.courseDetails, ...patch },
    })),

  // ============ QUẢN LÝ NỘI DUNG BLOCK CỦA BÀI HỌC ============
  addBlock: (lessonId, type) =>
    set((state) => {
      const currentBlocks = state.blocksByLesson[lessonId] || [];
      const newBlock = {
        id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type,
        data: {},
      };
      return {
        blocksByLesson: {
          ...state.blocksByLesson,
          [lessonId]: [...currentBlocks, newBlock],
        },
      };
    }),

  updateBlockData: (lessonId, blockId, data) =>
    set((state) => {
      const currentBlocks = state.blocksByLesson[lessonId] || [];
      return {
        blocksByLesson: {
          ...state.blocksByLesson,
          [lessonId]: currentBlocks.map((b: any) =>
            b.id === blockId ? { ...b, data } : b
          ),
        },
      };
    }),

  deleteBlock: (lessonId, blockId) =>
    set((state) => {
      const currentBlocks = state.blocksByLesson[lessonId] || [];
      return {
        blocksByLesson: {
          ...state.blocksByLesson,
          [lessonId]: currentBlocks.filter((b: any) => b.id !== blockId),
        },
      };
    }),
}));