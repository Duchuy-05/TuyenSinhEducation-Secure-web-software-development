import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { uploadCourseImage } from '../middlewares/upload.middleware';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { handleUploadError } from '../middlewares/handleUploadError.middleware';

const postRouter: Router = Router();

postRouter.get('/posts', verifyToken, isAdmin, PostController.getAllPostPagination);
postRouter.get('/posts/published', PostController.getAllPublishedPost);
postRouter.get('/posts/:slugOrId', PostController.getPost);


postRouter.post('/posts', verifyToken, isAdmin, uploadCourseImage.single('thumbnail'), handleUploadError, PostController.createPost);
postRouter.put('/posts/:id', verifyToken, isAdmin, uploadCourseImage.single('thumbnail'), PostController.updatePost);
postRouter.delete('/posts/:id', verifyToken, isAdmin, PostController.deletePost);

export default postRouter;
