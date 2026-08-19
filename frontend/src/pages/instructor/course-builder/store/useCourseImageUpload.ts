import { useRef, useState } from 'react';
import { uploadApi } from '../../../../services/upload.api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UseCourseImageUploadOptions {
    onUploaded: (imageUrl: string) => void;
}

export const useCourseImageUpload = ({ onUploaded }: UseCourseImageUploadOptions) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const openFilePicker = () => fileInputRef.current?.click();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert('Ảnh vượt quá 5MB, vui lòng chọn ảnh khác.');
            return;
        }

        setIsUploading(true);
        try {
            const imageUrl = await uploadApi.uploadCourseImage(file);
            onUploaded(imageUrl);
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Tải ảnh lên thất bại, vui lòng thử lại.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return { fileInputRef, isUploading, openFilePicker, handleFileSelect };
};