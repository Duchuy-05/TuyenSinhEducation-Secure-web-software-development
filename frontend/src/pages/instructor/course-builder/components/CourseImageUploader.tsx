// file upload image Course
import React from 'react';
import { Loader2, ImagePlus } from 'lucide-react';

interface CourseImageUploaderProps {
    imageUrl: string;
    isUploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onOpenFilePicker: () => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CourseImageUploader: React.FC<CourseImageUploaderProps> = ({
    imageUrl,
    isUploading,
    fileInputRef,
    onOpenFilePicker,
    onFileSelect,
}) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-bold text-slate-600">Hình ảnh bìa</label>

            <button
                type="button"
                onClick={onOpenFilePicker}
                disabled={isUploading}
                className="relative w-full aspect-video max-w-sm rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-orange-300"
            >
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt="Ảnh bìa khóa học"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-bold text-sm">
                                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                                {isUploading ? 'Đang tải lên...' : 'Đổi ảnh bìa'}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-orange-500 transition-colors">
                        {isUploading ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
                        <span className="text-sm font-bold">
                            {isUploading ? 'Đang tải lên...' : 'Chọn ảnh bìa'}
                        </span>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={onFileSelect}
                />
            </button>

            <p className="text-xs text-slate-400 mt-1.5">Ảnh JPG, JPEG, PNG hoặc WEBP. Tối đa 5MB.</p>
        </div>
    );
};