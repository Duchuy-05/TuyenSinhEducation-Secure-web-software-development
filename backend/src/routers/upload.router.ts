import { Router } from 'express';
import { uploadAvatar, uploadCourseImage } from '../middlewares/upload.middleware';
import { verifyToken } from '../middlewares/auth.middleware'; // middleware xác thực đã có sẵn trong dự án
import { handleUploadError } from '../middlewares/handleUploadError.middleware';
import { UploadController } from '../controllers/UploadController';

const router = Router();

router.post('/upload/avatar', verifyToken, uploadAvatar.single('image'), handleUploadError, UploadController.uploadAvatar);
router.post('/upload/course-image', verifyToken, uploadCourseImage.single('image'), handleUploadError, UploadController.uploadCourseImage);

export default router;