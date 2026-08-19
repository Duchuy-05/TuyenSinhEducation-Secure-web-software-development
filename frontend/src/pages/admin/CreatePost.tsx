import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { postApi } from '../../services/post.api';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
];

const CreatePost = () => {
  const navigate = useNavigate();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    shortDesc: '',
    authorName: '',
    status: 'draft',
  });
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('shortDesc', form.shortDesc);
      formData.append('authorName', form.authorName);
      formData.append('content', content);
      formData.append('status', status);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      await postApi.createPost(formData);
      navigate('/admin/posts');
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/posts');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-0">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="bg-none border-none cursor-pointer flex items-center text-slate-500 p-1 hover:text-slate-700"
              title="Quay lại"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Tạo bài viết mới</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={submitting}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Lưu nháp
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={submitting}
              className="px-5 py-2 rounded-lg border-none bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Đang đăng...' : 'Đăng bài'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Main content */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề bài viết..."
                value={form.title}
                onChange={handleChange}
                className="text-3xl font-bold text-slate-900 border-b-2 border-slate-300 bg-transparent p-2 outline-none focus:border-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col">
              <textarea
                name="shortDesc"
                placeholder="Mô tả ngắn (hiển thị ở trang danh sách)..."
                value={form.shortDesc}
                onChange={handleChange}
                className="resize-vertical border border-slate-300 rounded-lg p-3 text-sm text-slate-700 outline-none font-sans bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400"
                rows={3}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Nội dung</label>
              <div className="bg-white rounded-lg overflow-hidden border border-slate-300">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={{ toolbar: TOOLBAR_OPTIONS }}
                  placeholder="Viết nội dung bài viết tại đây..."
                  className="quill-wrapper"
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">

            {/* Thumbnail */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Ảnh thumbnail</h3>
              <div
                className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors bg-slate-50 flex items-center justify-center"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <span className="text-3xl">🖼</span>
                    <p className="text-xs">Nhấn để chọn ảnh</p>
                  </div>
                )}
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnail}
                className="hidden"
              />
              {thumbnailPreview && (
                <button
                  onClick={() => {
                    setThumbnailFile(null);
                    setThumbnailPreview('');
                  }}
                  className="mt-3 w-full py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  Xóa ảnh
                </button>
              )}
            </div>

            {/* Author */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Tác giả</h3>
              <input
                type="text"
                name="authorName"
                placeholder="Tên tác giả..."
                value={form.authorName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Trạng thái</h3>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
