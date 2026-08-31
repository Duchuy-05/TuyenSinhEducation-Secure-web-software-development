import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { instructorCourseApi, Course } from '../../../services/course.api';
import { CourseDetails, useCourseStore } from '../course-builder/store/useCourseStore';

export interface CourseListItem extends Omit<Partial<Course>, 'id'> {
  courseGroupId: string;
  id?: string | number;
  _id?: string;
  title: string;
  status: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number | null;
  isPublished?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

const PUBLISHED_STORAGE_KEY = 'instructor_published_courses';

const updateLocalStoragePublished = (groupId: string, isPublish: boolean) => {
  try {
    const raw = localStorage.getItem(PUBLISHED_STORAGE_KEY);
    let ids: string[] = raw ? JSON.parse(raw) : [];
    if (isPublish) {
      if (!ids.includes(groupId)) ids.push(groupId);
    } else {
      ids = ids.filter((id) => id !== groupId);
    }
    localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Lỗi cập nhật LocalStorage:', e);
  }
};

export const useInstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper hỗ trợ lấy ID chuẩn xác bất kể backend dùng id, _id hay courseGroupId
  const getNormalizedId = (course: Partial<CourseListItem> | string | undefined): string => {
    if (!course) return '';
    if (typeof course === 'string') return course.trim();
    return String(course.courseGroupId || course.id || course._id || '').trim();
  };

  // 1. Fetch danh sách khóa học với logic Deduplicate ưu tiên bản cập nhật mới nhất
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await instructorCourseApi.getLecturerCourses();
      const rawList: any[] = response?.data?.data || response?.data || (Array.isArray(response) ? response : []);
      const uniqueCoursesMap = new Map<string, CourseListItem>();

      rawList.forEach((course) => {
        const groupId = getNormalizedId(course);
        if (!groupId) return;

        const normalizedCourse: CourseListItem = {
          ...course,
          courseGroupId: groupId,
          id: course.id || course._id || groupId,
          title: course.title || 'Chưa đặt tên',
          status: course.status || 'DRAFT',
          price: Number(course.price) || 0,
          // 🟢 CHUẨN HÓA BẮT ẢNH: Tránh bị rỗng ảnh khi backend trả về 'image' thay vì 'imageUrl'
          imageUrl: course.imageUrl || course.image || '',
        };

        if (!uniqueCoursesMap.has(groupId)) {
          uniqueCoursesMap.set(groupId, normalizedCourse);
        } else {
          const existingCourse = uniqueCoursesMap.get(groupId)!;
          const newTime = new Date(course.updatedAt || course.createdAt || 0).getTime();
          const existingTime = new Date(existingCourse.updatedAt || existingCourse.createdAt || 0).getTime();

          if (newTime >= existingTime) {
            uniqueCoursesMap.set(groupId, normalizedCourse);
          }
        }
      });

      setCourses(Array.from(uniqueCoursesMap.values()));
    } catch (error: unknown) {
      console.error('Lỗi khi lấy danh sách khóa học:', error);
      const err = error as { response?: { status?: number; data?: { message?: string } } };

      if (err?.response?.status === 401) {
        Swal.fire({
          title: 'Phiên đăng nhập hết hạn',
          text: 'Vui lòng đăng nhập lại để tiếp tục.',
          icon: 'warning',
          confirmButtonText: 'Đăng nhập',
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      const message = err?.response?.data?.message || 'Không thể tải danh sách khóa học';
      Swal.fire('Lỗi', message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateCourse = async () => {
    const { value: title } = await Swal.fire({
      title: 'Tên khóa học mới',
      input: 'text',
      inputPlaceholder: 'Nhập tên khóa học...',
      showCancelButton: true,
      confirmButtonText: 'Tạo bản nháp',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Tên khóa học không được để trống!';
        }
        return null;
      },
    });

    if (title?.trim()) {
      Swal.fire({ title: 'Đang tạo bản nháp...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const response: any = await instructorCourseApi.createDraft(title.trim());
        const responseData = response?.data?.data || response?.data || response;
        const newCourseGroupId = getNormalizedId(responseData);

        Swal.close();

        if (newCourseGroupId) {
          const rawModules = responseData.courseData || responseData.syllabus || [];

          useCourseStore.setState({
            courseDetails: {
              title: responseData.title || title.trim(),
              shortDesc: responseData.shortDesc || '',
              target: responseData.target || '',
              category: responseData.category || '',
              imageUrl: responseData.imageUrl || responseData.image || '',
              format: responseData.format || 'online',
              frequency: responseData.frequency || '',
              lessonDuration: responseData.lessonDuration || '00:00',
              price: Number(responseData.price) || 0,
              status: 'DRAFT',
            },
            courseData: Array.isArray(rawModules) ? rawModules : [],
            blocksByLesson: (responseData.blocksByLesson || responseData.blocks) as Record<string, any> || {},
            activeLesson: null,
          });

          navigate(`/instructor/course-builder/${newCourseGroupId}`);
        } else {
          Swal.fire('Lỗi', 'Không lấy được ID khóa học từ Server', 'error');
        }
      } catch (error: unknown) {
        console.error('Lỗi khi tạo bản nháp:', error);
        const err = error as { response?: { data?: { message?: string } } };
        const message = err?.response?.data?.message || 'Không thể tạo bản nháp';
        Swal.fire('Lỗi', message, 'error');
      }
    }
  };

  // Xuất bản khóa học
  const handlePublish = async (courseGroupId: string) => {
    const targetId = getNormalizedId(courseGroupId);
    if (!targetId) {
      Swal.fire('Lỗi', 'ID khóa học không hợp lệ', 'error');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Xác nhận xuất bản?',
      text: 'Khóa học sẽ hiển thị công khai cho học viên.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xuất bản',
      cancelButtonText: 'Hủy',
    });

    if (confirm.isConfirmed) {
      Swal.fire({ title: 'Đang xuất bản...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        await instructorCourseApi.publishCourse(targetId);

        updateLocalStoragePublished(targetId, true);

        setCourses((prev) =>
          prev.map((c) => {
            const groupId = getNormalizedId(c);
            return groupId === targetId ? { ...c, status: 'PUBLISHED', isPublished: true } : c;
          })
        );

        await fetchCourses();
        Swal.fire('Thành công!', 'Khóa học đã được xuất bản thành công.', 'success');
      } catch (error: any) {
        console.error('Lỗi chi tiết từ Backend khi Publish:', error?.response);

        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          (Array.isArray(error?.response?.data?.message) ? error.response.data.message.join(', ') : null) ||
          'Không thể xuất bản khóa học. Vui lòng kiểm tra lại thông tin khóa học.';

        Swal.fire('Lỗi xuất bản!', backendMessage, 'error');
      }
    }
  };

  // Gỡ khóa học
  const handleUnpublish = async (courseGroupId: string) => {
    const targetId = getNormalizedId(courseGroupId);
    if (!targetId) {
      Swal.fire('Lỗi', 'ID khóa học không hợp lệ', 'error');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Gỡ khóa học?',
      text: 'Khóa học sẽ chuyển về trạng thái Bản nháp và tạm ẩn khỏi học viên.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xác nhận gỡ',
      cancelButtonText: 'Hủy',
    });

    if (confirm.isConfirmed) {
      Swal.fire({ title: 'Đang gỡ khóa học...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        await instructorCourseApi.unpublishCourse(targetId);

        updateLocalStoragePublished(targetId, false);

        setCourses((prev) =>
          prev.map((c) => {
            const groupId = getNormalizedId(c);
            return groupId === targetId ? { ...c, status: 'DRAFT', isPublished: false } : c;
          })
        );

        await fetchCourses();
        Swal.fire('Thành công!', 'Khóa học đã được chuyển về bản nháp.', 'success');
      } catch (error: any) {
        console.error('Lỗi chi tiết từ Backend khi Unpublish:', error?.response);

        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Không thể gỡ khóa học.';

        Swal.fire('Lỗi gỡ khóa học!', backendMessage, 'error');
      }
    }
  };

  // 🟢 CẬP NHẬT: Xử lý Edit mượt mà, đồng bộ dữ liệu vào Zustand Store trước khi chuyển trang
  const handleEditCourse = async (courseGroupId: string) => {
    const targetId = getNormalizedId(courseGroupId);
    if (!targetId) {
      Swal.fire('Lỗi', 'ID khóa học không hợp lệ', 'error');
      return;
    }

    Swal.fire({ title: 'Đang tải thông tin khóa học...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      // Tải thông tin chi tiết bản nháp từ Backend
      const courseData: any = await instructorCourseApi.getDraft(targetId);
      Swal.close();

      if (courseData) {
        const rawModules = courseData.courseData || courseData.syllabus || courseData.chapters || [];

        // Set lại dữ liệu chuẩn vào Zustand Store
        useCourseStore.setState({
          courseDetails: {
            title: courseData.title || '',
            shortDesc: courseData.shortDesc || courseData.description || '',
            target: courseData.target || '',
            category: courseData.category || '',
            imageUrl: courseData.imageUrl || courseData.image || '', // Đảm bảo lấy cả imageUrl lẫn image
            format: courseData.format || 'online',
            frequency: courseData.frequency || '',
            lessonDuration: courseData.lessonDuration || '00:00',
            price: Number(courseData.price) || 0,
            discountPrice: courseData.discountPrice ? Number(courseData.discountPrice) : null,
            status: courseData.status || 'DRAFT',
          } as CourseDetails,
          courseData: Array.isArray(rawModules) ? rawModules : [],
          blocksByLesson: (courseData.blocksByLesson || courseData.blocks) as Record<string, any> || {},
          activeLesson: null,
        });

        // Chuyển hướng sang trang Course Builder
        navigate(`/instructor/course-builder/${targetId}`);
      }
    } catch (error) {
      Swal.close();
      console.error('Lỗi khi tải chi tiết khóa học để sửa:', error);
      // Nếu không lấy được draft, vẫn cho phép chuyển trang để component con tự fetch
      navigate(`/instructor/course-builder/${targetId}`);
    }
  };

  return {
    courses,
    isLoading,
    fetchCourses,
    handleCreateCourse,
    handlePublish,
    handleUnpublish,
    handleEditCourse,
  };
};