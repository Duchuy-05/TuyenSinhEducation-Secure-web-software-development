import React from 'react';

interface BlockComponentProps {
  data?: any;
  onChange: (data: any) => void;
}

const TextBlock = ({ data, onChange }: BlockComponentProps) => (
  <textarea
    className="w-full min-h-[100px] p-3 text-sm text-slate-700 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-y"
    placeholder="Nhập nội dung cho bài học..."
    value={data?.content || ''}
    onChange={(e) => onChange({ ...data, content: e.target.value })}
  />
);

const VideoBlock = ({ data, onChange }: BlockComponentProps) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
      placeholder="Dán URL video (YouTube, Video...)"
      value={data?.url || ''}
      onChange={(e) => onChange({ ...data, url: e.target.value })}
    />
  </div>
);

const ImageBlock = ({ data, onChange }: BlockComponentProps) => (
  <div className="space-y-2">
    <input
      type="text"
      className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
      placeholder="Dán URL hình ảnh..."
      value={data?.url || ''}
      onChange={(e) => onChange({ ...data, url: e.target.value })}
    />
    {data?.url && (
      <img src={data.url} alt="preview" className="max-h-48 rounded-lg border border-slate-100" />
    )}
  </div>
);

const QuizBlock = ({ data, onChange }: BlockComponentProps) => {
  const question = data?.question || '';
  const options: string[] = data?.options || ['', '', '', ''];
  const correctIndex = data?.correctIndex ?? 0;

  const updateOption = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    onChange({ ...data, question, options: newOptions, correctIndex });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        placeholder="Nhập câu hỏi..."
        value={question}
        onChange={(e) => onChange({ ...data, question: e.target.value, options, correctIndex })}
      />
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="radio"
            name={`quiz-correct-${data?.id || 'q'}`}
            checked={correctIndex === idx}
            onChange={() => onChange({ ...data, question, options, correctIndex: idx })}
          />
          <input
            type="text"
            className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            placeholder={`Đáp án ${idx + 1}`}
            value={opt}
            onChange={(e) => updateOption(idx, e.target.value)}
          />
        </div>
      ))}
      <p className="text-xs text-slate-400">Chọn ô tròn cạnh đáp án đúng</p>
    </div>
  );
};

const BLOCK_COMPONENTS: Record<string, React.FC<BlockComponentProps>> = {
  text: TextBlock,
  video: VideoBlock,
  image: ImageBlock,
  quiz: QuizBlock,
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

  if (!Component) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Loại nội dung không hỗ trợ!</div>;
  }

  return (
    <div className="relative p-4 mb-4 transition-all bg-white border border-blue-100 shadow-sm rounded-xl hover:shadow-md hover:border-orange-300 group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDeleteBlock}
          className="text-slate-400 hover:text-orange-500 cursor-pointer transition-colors p-1 rounded-lg hover:bg-slate-100"
          title="Xóa khối này"
        >
          🗑️
        </button>
      </div>

      <Component data={block?.data} onChange={onUpdateBlock} />
    </div>
  );
}