import { Router } from 'express';
import { RegistrationController } from '../controllers/RegistrationController';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const registrationRouter: Router = Router();

registrationRouter.get('/registrations', verifyToken, isAdmin, RegistrationController.getAllRegistrations);
registrationRouter.get('/registrations/:id', verifyToken, isAdmin, RegistrationController.getRegistrationById);
registrationRouter.patch('/registrations/:id/status', verifyToken, isAdmin, RegistrationController.updateRegistrationStatus);
registrationRouter.post('/registrations', RegistrationController.createRegistration);
registrationRouter.put('/registrations/:id', verifyToken, isAdmin, RegistrationController.updateRegistration);
registrationRouter.delete('/registrations/:id', verifyToken, isAdmin, RegistrationController.deleteRegistration);

export default registrationRouter;
