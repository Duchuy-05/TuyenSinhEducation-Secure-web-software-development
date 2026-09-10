import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkOrigin } from '../middlewares/checkOrigin.middleware';

const paymentRouter: Router = Router();

paymentRouter.post('/payments/payos-webhook', PaymentController.handlePayOSWebhook);

paymentRouter.post('/payments/courses/:courseId/create-link', verifyToken, checkOrigin, PaymentController.createCoursePaymentLink);
paymentRouter.get('/payments/orders/:orderCode', verifyToken, PaymentController.getOrderByCode);

export default paymentRouter;
