import React from 'react';
import { useParams } from 'react-router-dom';
import BuilderLayout from './components/BuilderLayout';
import CourseSidebar from './components/CourseSideBar';
import CourseSettings from './components/CourseSettings';
import BlockRenderer from './components/editor-blocks/BlockRenderer';
import { useCourseStore } from './store/useCourseStore';
import { PlusCircle, Play, Image as ImageIcon, HelpCircle, Save } from 'lucide-react';

export default function CourseEditorPage() {
  const params = useParams<any>();
  const courseId = params.id || params.courseId;

  const activeLesson = useCourseStore((state) => state.activeLesson);
  const blocksByLesson = useCourseStore((state) => state.blocksByLesson);
  const addBlock = useCourseStore((state) => state.addBlock);
  const updateBlockData = useCourseStore((state) => state.updateBlockData);
  const deleteBlock = useCourseStore((state) => state.deleteBlock);
  const saveDraft = useCourseStore((state) => state.saveDraft);

  const blocks = activeLesson ? blocksByLesson[activeLesson.id] || [] : [];

  const handleAddBlock = (type: string) => {
    if (!activeLesson) return;
    addBlock(activeLesson.id, type);
  };

  const handleSaveContent = async () => {
    if (!courseId) return;
    await saveDraft(courseId);
  };

  return (
    <BuilderLayout
      sidebar={<CourseSidebar />}
      settings={<CourseSettings />}
    >
      <div className="flex flex-col h-full bg-slate-50">
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-blue-100 shrink-0">
          <h2 className="text-xl font-bold text-blue-900">
            {activeLesson ? activeLesson.title : 'Vui lòng chọn bài học'}
          </h2>
          {activeLesson && (
            <button
              onClick={handleSaveContent}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Save size={16} /> Lưu bài học
            </button>
          )}
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeLesson ? (
            <div className="max-w-3xl mx-auto">

              {blocks.map((block: any) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  onUpdateBlock={(data) => updateBlockData(activeLesson.id, block.id, data)}
                  onDeleteBlock={() => deleteBlock(activeLesson.id, block.id)}
                />
              ))}

              <div className="flex items-center justify-center gap-4 p-6 mt-8 border-3 rounded-xl border-blue-200 bg-blue-50/50">

                <button
                  onClick={() => handleAddBlock('text')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors bg-white rounded-lg shadow-sm hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  <PlusCircle size={16} /> Văn bản
                </button>
                <button
                  onClick={() => handleAddBlock('video')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors bg-white rounded-lg shadow-sm hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  <Play size={16} /> Video
                </button>
                <button
                  onClick={() => handleAddBlock('image')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors bg-white rounded-lg shadow-sm hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  <ImageIcon size={16} /> Hình ảnh
                </button>
                <button
                  onClick={() => handleAddBlock('quiz')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-500 transition-colors bg-white rounded-lg shadow-sm hover:bg-orange-500 hover:text-white cursor-pointer"
                >
                  <HelpCircle size={16} /> Quiz
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-blue-300">
              <span className="text-6xl mb-4 opacity-50">📖</span>
              <p className="text-lg font-medium">Chọn một bài học ở cột trái để bắt đầu thiết kế</p>
            </div>
          )}
        </div>
      </div>
    </BuilderLayout>
  );
}