import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Tạo một hàm để tạo uploader với folder để phân loại ảnh theo loại (avatars, courses)
const createUploader = (folder: string) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: { // cho phép lưu ảnh từ image_url của khóa học
            folder: `tri-anh-education/${folder}`, // namespace rõ ràng theo tên dự án + loại ảnh
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 800, quality: 'auto' }],
        } as any,
    });

    return multer({
        storage, // cho phép lưu ảnh avatar_url của người dùng
        limits: { fileSize: 2 * 1024 * 1024 }, // giới hạn 2MB
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp)'));
            }
            cb(null, true);
        },
    });
};

export const uploadAvatar = createUploader('avatars');
export const uploadCourseImage = createUploader('courses');