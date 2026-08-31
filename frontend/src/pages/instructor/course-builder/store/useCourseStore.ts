import { create } from 'zustand';
import Swal from 'sweetalert2';
import { instructorCourseApi, Course } from '../../../../services/course.api';

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  isPreview: boolean;
  type?: string;
  duration?: string;
}

export interface Unit {
  id: string;
  title: string;
  items: Lesson[];
}

export interface Block {
  id: string;
  type: string;
  data: Record<string, unknown>;
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
  status?: string;
}

interface CourseState {
  courseDetails: CourseDetails;
  courseData: Unit[];
  blocksByLesson: Record<string, Block[]>;
  activeLesson: Lesson | null;
  isLoading: boolean;

  fetchDraftData: (courseId: string) => Promise<void>;
  saveDraft: (courseId: string) => Promise<boolean>;
  publishCourse: (courseId: string) => Promise<boolean>;
  unpublishCourse: (courseId: string) => Promise<boolean>;
  resetStore: () => void;

  setActiveLesson: (lesson: Lesson | null) => void;
  updateCourseDetails: (patch: Partial<CourseDetails>) => void;

  // Quản lý Unit & Lesson
  addUnit: (title: string) => void;
  updateUnitTitle: (unitId: string, title: string) => void;
  deleteUnit: (unitId: string) => void;

  addLesson: (unitId: string, title: string) => void;
  updateLesson: (unitId: string, lessonId: string, patch: Partial<Lesson>) => void;
  deleteLesson: (unitId: string, lessonId: string) => void;

  // Quản lý Block
  addBlock: (lessonId: string, type: string) => void;
  updateBlockData: (lessonId: string, blockId: string, data: Record<string, unknown>) => void;
  deleteBlock: (lessonId: string, blockId: string) => void;
}

// ==========================================
// 2. HELPER UTILS
// ==========================================

const PUBLISHED_STORAGE_KEY = 'instructor_published_courses';

const getLocalPublishedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(PUBLISHED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const addLocalPublishedId = (groupId: string) => {
  try {
    const ids = getLocalPublishedIds();
    if (!ids.includes(groupId)) {
      ids.push(groupId);
      localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Lỗi ghi LocalStorage:', e);
  }
};

const removeLocalPublishedId = (groupId: string) => {
  try {
    const ids = getLocalPublishedIds().filter((id) => id !== groupId);
    localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Lỗi xóa LocalStorage:', e);
  }
};

const initialCourseDetails: CourseDetails = {
  title: '',
  shortDesc: '',
  target: '',
  category: '',
  imageUrl: '',
  format: 'online',
  price: 0,
  frequency: '',
  lessonDuration: '',
  status: 'DRAFT',
};

const generateUniqueId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
};

const buildFormattedSyllabus = (courseData: Unit[], blocksByLesson: Record<string, Block[]>) => {
  return courseData.map((unit, index) => {
    const lessonsWithBlocks = (unit.items || []).map((lesson) => ({
      ...lesson,
      blocks: blocksByLesson[lesson.id] || [],
    }));

    return {
      orderIndex: index + 1,
      title: unit.title,
      description: JSON.stringify(lessonsWithBlocks),
      lessons: lessonsWithBlocks,
      items: lessonsWithBlocks,
    };
  });
};

// ==========================================
// 3. ZUSTAND STORE
// ==========================================

export const useCourseStore = create<CourseState>((set, get) => ({
  courseDetails: initialCourseDetails,
  courseData: [],
  blocksByLesson: {},
  activeLesson: null,
  isLoading: false,

  resetStore: () => {
    set({
      courseDetails: initialCourseDetails,
      courseData: [],
      blocksByLesson: {},
      activeLesson: null,
      isLoading: false,
    });
  },

  fetchDraftData: async (courseId) => {
    set({ isLoading: true });
    try {
      const data: Course = await instructorCourseApi.getDraft(courseId);

      const publishedIds = getLocalPublishedIds();
      const isLocallyPublished = publishedIds.includes(String(courseId).trim());

      const rawUnits = data?.courseData || data?.syllabus || [];
      const normalizedCourseData: Unit[] = Array.isArray(rawUnits)
        ? (rawUnits as Record<string, any>[]).map((unit, idx: number) => {
          let items: Record<string, any>[] = [];

          if (Array.isArray(unit.items)) {
            items = unit.items;
          } else if (Array.isArray(unit.lessons)) {
            items = unit.lessons;
          } else if (typeof unit.description === 'string' && unit.description.trim().startsWith('[')) {
            try {
              items = JSON.parse(unit.description);
            } catch {
              items = [];
            }
          }

          return {
            id: String(unit.id || generateUniqueId(`unit_${idx}`)),
            title: String(unit.title || `Chương ${idx + 1}`),
            items: items.map((lesson, lIdx: number) => ({
              id: String(lesson.id || generateUniqueId(`lesson_${lIdx}`)),
              title: String(lesson.title || `Bài ${lIdx + 1}`),
              isPreview: Boolean(lesson.isPreview),
              type: (lesson.type as string) || 'video',
              duration: (lesson.duration as string) || '',
            })),
          };
        })
        : [];

      const rawBlocks = data?.blocks || data?.blocksByLesson || {};
      const normalizedBlocks: Record<string, Block[]> = {};

      Object.keys(rawBlocks).forEach((lessonId) => {
        const list = rawBlocks[lessonId] || [];
        normalizedBlocks[lessonId] = Array.isArray(list)
          ? list.map((b: any) => ({
            id: String(b.id || generateUniqueId('block')),
            type: String(b.type || 'text'),
            data: b.data || b.content || {}, // Tự động nhận diện data hoặc content từ backend
          }))
          : [];
      });

      // Mặc định chọn bài học đầu tiên nếu có
      const firstLesson = normalizedCourseData[0]?.items[0] || null;

      set({
        courseDetails: {
          title: data?.title || '',
          shortDesc: data?.shortDesc || '',
          target: data?.target || '',
          category: data?.category || '',
          imageUrl: data?.imageUrl || '',
          format: data?.format || 'online',
          price: Number(data?.price) || 0,
          frequency: data?.frequency || '',
          lessonDuration: data?.lessonDuration || '',
          status: isLocallyPublished ? 'PUBLISHED' : data?.status || 'DRAFT',
        },
        courseData: normalizedCourseData,
        blocksByLesson: normalizedBlocks,
        activeLesson: firstLesson,
      });
    } catch (error: unknown) {
      console.error('Lỗi khi tải dữ liệu bản nháp:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Không thể tải dữ liệu khóa học';
      Swal.fire('Lỗi', message, 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  saveDraft: async (courseId) => {
    const state = get();
    Swal.fire({ title: 'Đang lưu bản nháp...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const formattedSyllabus = buildFormattedSyllabus(state.courseData, state.blocksByLesson);

      // Ép kiểu payload thành any để bỏ qua kiểm tra strict type của API cho các trường mở rộng
      const payload: any = {
        ...state.courseDetails,
        courseData: state.courseData,
        syllabus: formattedSyllabus,
        blocksByLesson: state.blocksByLesson,
        blocks: state.blocksByLesson,
      };

      await instructorCourseApi.updateDraft(courseId, payload);

      Swal.fire('Thành công', 'Đã lưu bản nháp thành công', 'success');
      return true;
    } catch (error: unknown) {
      console.error('Lỗi khi lưu bản nháp:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Không thể lưu bản nháp';
      Swal.fire('Lỗi', message, 'error');
      return false;
    }
  },

  publishCourse: async (courseId) => {
    const state = get();
    Swal.fire({ title: 'Đang xuất bản khóa học...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const formattedSyllabus = buildFormattedSyllabus(state.courseData, state.blocksByLesson);

      const payload: any = {
        ...state.courseDetails,
        status: 'PUBLISHED',
        courseData: state.courseData,
        syllabus: formattedSyllabus,
        blocksByLesson: state.blocksByLesson,
        blocks: state.blocksByLesson,
      };

      await instructorCourseApi.updateDraft(courseId, payload);
      await instructorCourseApi.publishCourse(courseId);

      addLocalPublishedId(String(courseId).trim());

      set((prevState) => ({
        courseDetails: {
          ...prevState.courseDetails,
          status: 'PUBLISHED',
        },
      }));

      Swal.fire('Thành công', 'Khóa học đã được xuất bản thành công!', 'success');
      return true;
    } catch (error: unknown) {
      console.error('Lỗi khi xuất bản:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Không thể xuất bản khóa học';
      Swal.fire('Lỗi', message, 'error');
      return false;
    }
  },

  unpublishCourse: async (courseId) => {
    Swal.fire({ title: 'Đang gỡ khóa học...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      await instructorCourseApi.unpublishCourse(courseId);

      removeLocalPublishedId(String(courseId).trim());

      set((prevState) => ({
        courseDetails: {
          ...prevState.courseDetails,
          status: 'DRAFT',
        },
      }));

      Swal.fire('Thành công', 'Khóa học đã chuyển về bản nháp!', 'success');
      return true;
    } catch (error: unknown) {
      console.error('Lỗi khi hủy xuất bản:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Không thể gỡ khóa học';
      Swal.fire('Lỗi', message, 'error');
      return false;
    }
  },

  setActiveLesson: (lesson) => set({ activeLesson: lesson }),

  updateCourseDetails: (patch) =>
    set((state) => ({
      courseDetails: { ...state.courseDetails, ...patch },
    })),

  // ================= Quản lý Unit =================
  addUnit: (title) =>
    set((state) => ({
      courseData: [
        ...state.courseData,
        {
          id: generateUniqueId('unit'),
          title,
          items: [],
        },
      ],
    })),

  updateUnitTitle: (unitId, title) =>
    set((state) => ({
      courseData: state.courseData.map((unit) =>
        unit.id === unitId ? { ...unit, title } : unit
      ),
    })),

  deleteUnit: (unitId) =>
    set((state) => {
      const unitToDelete = state.courseData.find((u) => u.id === unitId);
      const lessonIdsToRemove = new Set(unitToDelete?.items.map((i) => i.id) || []);

      const updatedBlocks = { ...state.blocksByLesson };
      lessonIdsToRemove.forEach((id) => delete updatedBlocks[id]);

      const isCurrentActiveRemoved =
        state.activeLesson && lessonIdsToRemove.has(state.activeLesson.id);

      return {
        courseData: state.courseData.filter((unit) => unit.id !== unitId),
        blocksByLesson: updatedBlocks,
        activeLesson: isCurrentActiveRemoved ? null : state.activeLesson,
      };
    }),

  // ================= Quản lý Lesson =================
  addLesson: (unitId, title) =>
    set((state) => ({
      courseData: state.courseData.map((unit) => {
        if (unit.id === unitId) {
          return {
            ...unit,
            items: [
              ...unit.items,
              { id: generateUniqueId('lesson'), title, isPreview: false },
            ],
          };
        }
        return unit;
      }),
    })),

  updateLesson: (unitId, lessonId, patch) =>
    set((state) => {
      const updatedCourseData = state.courseData.map((unit) => {
        if (unit.id === unitId) {
          return {
            ...unit,
            items: unit.items.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, ...patch } : lesson
            ),
          };
        }
        return unit;
      });

      const isEditingActive = state.activeLesson?.id === lessonId;
      const updatedActiveLesson: Lesson | null =
        isEditingActive && state.activeLesson
          ? { ...state.activeLesson, ...patch }
          : state.activeLesson;

      return {
        courseData: updatedCourseData,
        activeLesson: updatedActiveLesson,
      };
    }),

  deleteLesson: (unitId, lessonId) =>
    set((state) => {
      const updatedBlocks = { ...state.blocksByLesson };
      delete updatedBlocks[lessonId];

      return {
        courseData: state.courseData.map((unit) => {
          if (unit.id === unitId) {
            return {
              ...unit,
              items: unit.items.filter((lesson) => lesson.id !== lessonId),
            };
          }
          return unit;
        }),
        blocksByLesson: updatedBlocks,
        activeLesson: state.activeLesson?.id === lessonId ? null : state.activeLesson,
      };
    }),

  // ================= Quản lý Block =================
  addBlock: (lessonId, type) =>
    set((state) => {
      const currentBlocks = state.blocksByLesson[lessonId] || [];
      const newBlock: Block = {
        id: generateUniqueId('block'),
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
          [lessonId]: currentBlocks.map((b) =>
            b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b
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
          [lessonId]: currentBlocks.filter((b) => b.id !== blockId),
        },
      };
    }),
}));