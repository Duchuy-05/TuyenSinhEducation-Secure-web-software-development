import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { uploadCourseImage } from '../middlewares/upload.middleware';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
const courseRouter: Router = Router();

// =======================================================================
// NHÓM 1 CÁC API ĐẶC THÙ ĐẶT LÊN TRÊN
// =======================================================================

// 1. API lấy danh sách khóa học của riêng giảng viên đó
courseRouter.get('/courses/lecturer', verifyToken, CourseController.getLecturerCourses);

// 2. Nhóm API Quản lý Khóa học đa phương tiện
courseRouter.post('/courses/draft', verifyToken, CourseController.createDraft);
courseRouter.get('/courses/draft/:courseGroupId', verifyToken, CourseController.getDraft);
courseRouter.put('/courses/draft/:courseGroupId', verifyToken, CourseController.updateDraft);
courseRouter.post('/courses/:courseGroupId/publish', verifyToken, CourseController.publishCourse);


// =======================================================================
// NHÓM 2: CÁC API CÓ THAM SỐ ĐỘNG (:id) - BẮT BUỘC PHẢI ĐẶT XUỐNG DƯỚI
// =======================================================================

courseRouter.get('/courses', CourseController.getAllCourses);
courseRouter.get('/courses/pagination', CourseController.getAllCoursesPagination);
courseRouter.get('/courses/:id', CourseController.getCourseById);
courseRouter.post('/courses', verifyToken, isAdmin, uploadCourseImage.single('image'), CourseController.createCourse);
courseRouter.put('/courses/:id', verifyToken, isAdmin, uploadCourseImage.single('image'), CourseController.updateCourse);
courseRouter.delete('/courses/:id', verifyToken, isAdmin, CourseController.deleteCourse);

export default courseRouter;
