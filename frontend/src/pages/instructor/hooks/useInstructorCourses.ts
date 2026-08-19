import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { instructorCourseApi } from '../../../services/course.api';
import { useCourseStore } from '../course-builder/store/useCourseStore';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
export interface CourseListItem {
  courseGroupId: string;
  title: string;
  status: 'draft' | 'archived' | 'published' | string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
  [key: string]: any;
}

export const useInstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await instructorCourseApi.getLecturerCourses();
      const allCourses: CourseListItem[] = response.data?.data || [];
      
      const uniqueCoursesMap = new Map<string, CourseListItem>();

      const getStatusWeight = (status: string) => {
        if (status === 'UNPUBLISHED') return 3;
        if (status === 'DRAFT') return 2;
        return 1; 
      };

      allCourses.forEach(course => {
        if (course.status === 'published') return;
        const groupId = course.courseGroupId;

        if (!uniqueCoursesMap.has(groupId)) {
          uniqueCoursesMap.set(groupId, course);
        } else {
          const existingCourse = uniqueCoursesMap.get(groupId)!;
          if (getStatusWeight(course.status) > getStatusWeight(existingCourse.status)) {
            uniqueCoursesMap.set(groupId, course);
          }
        }
      });

      setCourses(Array.from(uniqueCoursesMap.values()));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      cancelButtonText: 'Hủy'
    });

    if (title?.trim()) {
      Swal.fire({ title: 'Đang tạo...', didOpen: () => Swal.showLoading() });
      try {
        const response = await instructorCourseApi.createDraft(title.trim());
        const newDraft = response.data?.data || response.data;
        const newCourseGroupId = response.data?.courseGroupId || response.data?.data?.courseGroupId || response.data?.id; 
        
        Swal.close();
        if (newCourseGroupId) {
          useCourseStore.setState({
          courseDetails: {
            title: newDraft.title || title.trim(),
            shortDesc: newDraft.shortDesc || '',
            target: newDraft.target || '',
            category: newDraft.category || '',
            imageUrl: newDraft.imageUrl || '',
            format: newDraft.format || 'online',
            frequency: newDraft.frequency || '',
            lessonDuration: newDraft.lessonDuration || '00:00',
            price: Number(newDraft.price) || 0,
          },
          courseData: newDraft.courseData || [],
          blocksByLesson: newDraft.blocks || {},
          activeLesson: null,
        });
          navigate(`/instructor/course-builder/${newCourseGroupId}`);
        } else {
          Swal.fire('Lỗi', 'Không lấy được ID khóa học từ Server', 'error');
        }
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể tạo bản nháp', 'error');
      }
    }
  };

  const handlePublish = async (courseGroupId: string) => {
    const confirm = await Swal.fire({
      title: 'Xác nhận xuất bản?',
      text: 'Khóa học sẽ hiển thị công khai cho học viên. Bản cũ sẽ được lưu trữ.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Xuất bản'
    });

    if (confirm.isConfirmed) {
      Swal.fire({ title: 'Đang xuất bản...', didOpen: () => Swal.showLoading() });
      try {
        await instructorCourseApi.publishCourse(courseGroupId);
        Swal.fire('Thành công!', 'Khóa học đã được đưa lên sóng.', 'success');
        fetchCourses(); 
      } catch (error) {
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xuất bản.', 'error');
      }
    }
  };

  const handleEditCourse = (courseGroupId: string) => {
    navigate(`/instructor/course-builder/${courseGroupId}`);
  };

  return { courses, isLoading, handleCreateCourse, handlePublish, handleEditCourse };
};