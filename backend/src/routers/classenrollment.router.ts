import { Router } from 'express';
import { ClassEnrollmentController } from '../controllers/ClassEnrollmentController';
import { verifyToken, requireRoles } from '../middlewares/auth.middleware';
import { UserRole } from '../models/entities/User';

const classEnrollmentRouter: Router = Router();

classEnrollmentRouter.get('/class-enrollments/myclasses', verifyToken, ClassEnrollmentController.getMyClasses);
classEnrollmentRouter.get('/class-enrollments', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassEnrollmentController.getByClassId);

classEnrollmentRouter.post('/class-enrollments', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassEnrollmentController.create);
classEnrollmentRouter.post('/class-enrollments/bulk', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassEnrollmentController.bulkCreate);

classEnrollmentRouter.put('/class-enrollments/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassEnrollmentController.updateStatus);
classEnrollmentRouter.delete('/class-enrollments/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassEnrollmentController.remove);

export default classEnrollmentRouter;
