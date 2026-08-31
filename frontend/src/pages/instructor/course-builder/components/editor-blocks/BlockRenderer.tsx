import React, { useRef } from 'react';

interface BlockComponentProps {
  id: string;
  data?: any;
  onChange: (data: any) => void;
}

/* ==========================================================================
   1. TEXT BLOCK
   ========================================================================== */
const TextBlock = ({ data, onChange }: BlockComponentProps) => (
  <textarea
    className="w-full min-h-[120px] p-3 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-y"
    placeholder="Nhập nội dung văn bản, hướng dẫn cho bài học..."
    value={data?.content || ''}
    onChange={(e) => onChange({ ...data, content: e.target.value })}
  />
);

/* ==========================================================================
   2. VIDEO BLOCK (Hỗ trợ nhúng YouTube & Upload/URL trực tiếp)
   ========================================================================== */
const VideoBlock = ({ data, onChange }: BlockComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(data?.url || '');

  // Xử lý upload video file nội bộ/local
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      onChange({ ...data, url: localUrl, file });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          placeholder="Dán URL video (YouTube, MP4, Cloudinary...)"
          value={data?.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          📁 Tải file
        </button>
      </div>

      {/* Xem trước Video */}
      {embedUrl ? (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
          <iframe
            src={embedUrl}
            title="Video preview"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ) : data?.url ? (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
          <video src={data.url} controls className="max-h-full w-full object-contain" />
        </div>
      ) : null}
    </div>
  );
};

/* ==========================================================================
   3. IMAGE BLOCK (Hỗ trợ URL & Upload File)
   ========================================================================== */
const ImageBlock = ({ data, onChange }: BlockComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      onChange({ ...data, url: localUrl, file });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          placeholder="Dán URL hình ảnh..."
          value={data?.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          📁 Tải ảnh
        </button>
      </div>

      {data?.url && (
        <div className="relative group/img max-w-md mx-auto">
          <img
            src={data.url}
            alt="Preview"
            className="max-h-60 w-full object-cover rounded-lg border border-slate-200 shadow-sm"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   4. QUIZ BLOCK (Đã thêm tính năng Thêm/Xóa đáp án linh hoạt)
   ========================================================================== */
const QuizBlock = ({ id, data, onChange }: BlockComponentProps) => {
  const question = data?.question || '';
  const options: string[] = data?.options || ['', ''];
  const correctIndex = data?.correctIndex ?? 0;

  const updateOption = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    onChange({ ...data, question, options: newOptions, correctIndex });
  };

  const addOption = () => {
    if (options.length >= 6) return; // Giới hạn tối đa 6 đáp án
    onChange({ ...data, question, options: [...options, ''], correctIndex });
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return; // Tối thiểu phải có 2 lựa chọn
    const newOptions = options.filter((_, i) => i !== idx);
    let newCorrect = correctIndex;
    if (correctIndex === idx) newCorrect = 0;
    else if (correctIndex > idx) newCorrect -= 1;

    onChange({ ...data, question, options: newOptions, correctIndex: newCorrect });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full p-2.5 text-sm font-medium border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        placeholder="Nhập câu hỏi trắc nghiệm..."
        value={question}
        onChange={(e) => onChange({ ...data, question: e.target.value, options, correctIndex })}
      />

      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              name={`quiz-correct-${id}`}
              checked={correctIndex === idx}
              onChange={() => onChange({ ...data, question, options, correctIndex: idx })}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500 cursor-pointer"
            />
            <input
              type="text"
              className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder={`Đáp án ${idx + 1}`}
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="text-slate-400 hover:text-red-500 text-sm p-1"
                title="Xóa đáp án này"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-slate-400">Tích chọn ô tròn để đánh dấu đáp án đúng.</p>
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="text-xs text-orange-600 font-semibold hover:underline cursor-pointer"
          >
            + Thêm lựa chọn
          </button>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN RENDERER COMPONENT
   ========================================================================== */
const BLOCK_COMPONENTS: Record<string, React.FC<BlockComponentProps>> = {
  text: TextBlock,
  video: VideoBlock,
  image: ImageBlock,
  quiz: QuizBlock,
};

const BLOCK_LABELS: Record<string, { label: string; icon: string }> = {
  text: { label: 'Văn bản', icon: '📝' },
  video: { label: 'Video bài học', icon: '🎥' },
  image: { label: 'Hình ảnh', icon: '🖼️' },
  quiz: { label: 'Câu hỏi trắc nghiệm', icon: '❓' },
};

interface BlockProps {
  block: {
    id: string;
    type: string;
    data?: any;
  };
  onUpdateBlock: (data: any) => void;
  onDeleteBlock: () => void;
}

export default function BlockRenderer({ block, onUpdateBlock, onDeleteBlock }: BlockProps) {
  const Component = BLOCK_COMPONENTS[block?.type];
  const meta = BLOCK_LABELS[block?.type] || { label: 'Nội dung', icon: '📦' };

  if (!Component) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg text-sm">
        Loại nội dung "{block?.type}" chưa được hỗ trợ!
      </div>
    );
  }

  return (
    <div className="relative p-4 pt-8 mb-4 transition-all bg-white border border-slate-200 shadow-sm rounded-xl hover:shadow-md hover:border-orange-300 group">
      {/* Badge phân loại Block */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md select-none">
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </div>

      {/* Nút Xóa Block */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onDeleteBlock}
          className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors p-1 rounded-lg hover:bg-red-50"
          title="Xóa khối này"
        >
          🗑️
        </button>
      </div>

      <Component id={block?.id} data={block?.data} onChange={onUpdateBlock} />
    </div>
  );
}