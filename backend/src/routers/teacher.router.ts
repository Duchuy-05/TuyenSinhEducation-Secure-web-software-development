import { Router } from 'express';
import { TeacherController } from '../controllers/TeacherController';
import { uploadAvatar } from '../middlewares/upload.middleware';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
const teacherRouter: Router = Router();

teacherRouter.get('/teachers', TeacherController.getAllTeachers);
teacherRouter.get('/teachers/pagination', TeacherController.getAllTeachersPagination)
teacherRouter.get('/teachers/:id', TeacherController.getTeacherById);

teacherRouter.post('/teachers', verifyToken, isAdmin, TeacherController.createTeacher);
teacherRouter.delete('/teachers/:id', verifyToken, isAdmin, TeacherController.deleteTeacher);
teacherRouter.put('/teachers/:id', verifyToken, isAdmin, TeacherController.updateTeacher);
teacherRouter.post('/upload', verifyToken, isAdmin, uploadAvatar.single('image'), TeacherController.uploadAvatar);

export default teacherRouter;
