import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import { verifyToken, requireRoles } from '../middlewares/auth.middleware';
import { UserRole } from '../models/entities/User';

const scheduleRouter: Router = Router();

scheduleRouter.get('/schedules/my-upcoming', verifyToken, ScheduleController.getMyUpcoming);
scheduleRouter.get('/schedules', verifyToken, ScheduleController.getByClassId);
scheduleRouter.get('/schedules/:id', ScheduleController.getById);

scheduleRouter.post('/schedules', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ScheduleController.create);
scheduleRouter.post('/schedules/bulk', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ScheduleController.bulkCreate);

scheduleRouter.put('/schedules/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ScheduleController.update);
scheduleRouter.delete('/schedules/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), ScheduleController.remove);

export default scheduleRouter;
