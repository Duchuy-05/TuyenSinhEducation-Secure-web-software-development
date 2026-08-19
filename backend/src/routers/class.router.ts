import { Router } from 'express';
import { ClassController } from '../controllers/ClassController';
import { verifyToken, requireRoles } from '../middlewares/auth.middleware';
import { UserRole } from '../models/entities/User';

const classRouter: Router = Router();

classRouter.get('/classes', ClassController.getAllClasses);
classRouter.get('/classes/:id', ClassController.getClassById);
classRouter.post('/classes', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassController.createClass);
classRouter.put('/classes/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ClassController.updateClass);

export default classRouter;
