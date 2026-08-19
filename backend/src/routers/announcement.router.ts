import { Router } from 'express';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { verifyToken, requireRoles } from '../middlewares/auth.middleware';
import { UserRole } from '../models/entities/User';

const announcementRouter: Router = Router();

announcementRouter.get('/announcements/my', verifyToken, AnnouncementController.getMyAnnouncements);
announcementRouter.get('/announcements', AnnouncementController.getByClassId);
announcementRouter.get('/announcements/:id', AnnouncementController.getById);

announcementRouter.post('/announcements', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), AnnouncementController.create);

announcementRouter.put('/announcements/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), AnnouncementController.update);
announcementRouter.delete('/announcements/:id', verifyToken, requireRoles(UserRole.ADMIN, UserRole.TEACHER), AnnouncementController.remove);

export default announcementRouter;
