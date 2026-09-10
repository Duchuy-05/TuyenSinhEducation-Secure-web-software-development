import { Router } from 'express';
import { CourseSyllabusController } from '../controllers/CourseSyllabusController';
import { requireRoles, verifyToken } from '../middlewares/auth.middleware';
import { UserRole } from '../models/entities/User';

const syllabusRouter: Router = Router();

syllabusRouter.get('/syllabi', CourseSyllabusController.getAllSyllabi)
syllabusRouter.get('/syllabi/:id', CourseSyllabusController.getSyllabusById)
syllabusRouter.get('/courses/:courseId/syllabi', CourseSyllabusController.getSyllabusByCourseId)

// bảo mật
syllabusRouter.post('/syllabi', verifyToken, requireRoles(UserRole.ADMIN), CourseSyllabusController.createSyllabus)
syllabusRouter.put('/syllabi/:id', verifyToken, requireRoles(UserRole.ADMIN), CourseSyllabusController.updateSyllabus)
syllabusRouter.post('/courses/:courseId/syllabi/bulk', verifyToken, requireRoles(UserRole.ADMIN), CourseSyllabusController.createSyllabusBulk);
syllabusRouter.put('/courses/:courseId/syllabus', verifyToken, requireRoles(UserRole.ADMIN), CourseSyllabusController.updateSyllabusBulk);
syllabusRouter.delete('/syllabi/:id', verifyToken, requireRoles(UserRole.ADMIN), CourseSyllabusController.deleteSyllabus)

export default syllabusRouter;
