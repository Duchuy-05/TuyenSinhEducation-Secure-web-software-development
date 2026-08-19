import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Filter, MoreVertical, Paperclip, 
    Send, Phone, Video, MessageSquare, ChevronDown
} from 'lucide-react';

// --- MOCK DATA ---
const mockInstructors = [
    {
        id: 'inst1',
        name: 'Nguyễn Văn A',
        className: 'ReactJS K15',
        avatar: 'https://ui-avatars.com/api/?name=Van+A&background=0D8ABC&color=fff',
        lastMessage: 'Em đã hoàn thành bài tập rồi ạ.',
        time: '10 phút trước',
        unread: 2,
        isOnline: true
    },
    {
        id: 'inst2',
        name: 'Trần Thị B',
        className: 'Canva K34',
        avatar: 'https://ui-avatars.com/api/?name=Thi+B&background=E5664B&color=fff',
        lastMessage: 'Cảm ơn thầy ạ.',
        time: '2 giờ trước',
        unread: 0,
        isOnline: false
    },
    {
        id: 'inst3',
        name: 'Lê Minh C',
        className: 'AI Beginner K07',
        avatar: 'https://ui-avatars.com/api/?name=Minh+C&background=10B981&color=fff',
        lastMessage: 'Em muốn xin phép nghỉ học hôm nay...',
        time: 'Vừa xong',
        unread: 1,
        isOnline: true
    }
];

const mockChatHistory: Record<string, any[]> = {
    'inst1': [
        { id: 1, sender: 'instructor', text: 'Chào em, bài tập về nhà môn ReactJS em làm đến đâu rồi?', time: '09:00 AM' },
        { id: 2, sender: 'student', text: 'Dạ em đang làm phần Redux Toolkit ạ. Hơi khó hiểu một chút.', time: '09:15 AM' },
        { id: 3, sender: 'instructor', text: 'Nếu có phần nào vướng mắc em cứ hỏi nhé, thầy sẽ hỗ trợ.', time: '09:20 AM' },
        { id: 4, sender: 'student', text: 'Em đã hoàn thành bài tập rồi ạ.', time: '10 phút trước' }
    ],
    'inst2': [
        { id: 1, sender: 'instructor', text: 'Tài liệu buổi học hôm nay thầy đã up lên hệ thống nhé.', time: 'Hôm qua' },
        { id: 2, sender: 'student', text: 'Cảm ơn thầy ạ.', time: '2 giờ trước' }
    ],
    'inst3': [
        { id: 1, sender: 'student', text: 'Em muốn xin phép nghỉ học hôm nay...', time: 'Vừa xong' }
    ]
};

const StudentContactInstructor: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInstId, setSelectedInstId] = useState<string | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const filteredInstructors = mockInstructors.filter(inst => 
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedInstructor = mockInstructors.find(inst => inst.id === selectedInstId);

    // Cập nhật messages khi chọn giảng viên khác
    useEffect(() => {
        if (selectedInstId) {
            setChatMessages(mockChatHistory[selectedInstId] || []);
        }
    }, [selectedInstId]);

    // Cuộn xuống dòng tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !selectedInstId) return;

        const newMessage = {
            id: Date.now(),
            sender: 'student',
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages([...chatMessages, newMessage]);
        setChatInput('');
    };

    return (
        <div className="flex h-[calc(100vh-72px)] bg-[#F5F7FA] overflow-hidden p-4 lg:p-6 gap-6 max-w-screen-2xl mx-auto w-full">
            
            {/* Cột Trái: Danh sách Giảng viên */}
            <div className={`w-full lg:w-[380px] bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex flex-col flex-shrink-0 ${selectedInstId ? 'hidden lg:flex' : 'flex'}`}>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#1F2937]">Hỏi đáp giảng viên</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý trao đổi và hỗ trợ học tập.</p>
                </div>

                {/* Search & Filter */}
                <div className="p-4 space-y-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm giảng viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B]" />
                    </div>
                    
                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            Lớp học <ChevronDown size={14} />
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            <Filter size={14} /> Lọc
                        </button>
                    </div>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    {filteredInstructors.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {filteredInstructors.map(inst => (
                                <div 
                                    key={inst.id}
                                    onClick={() => setSelectedInstId(inst.id)}
                                    className={`p-4 flex gap-4 cursor-pointer transition-colors border-l-4 ${
                                        selectedInstId === inst.id 
                                            ? 'bg-orange-50 border-[#E5664B]' 
                                            : 'hover:bg-gray-50 border-transparent'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <img src={inst.avatar} alt={inst.name} className="w-full h-full rounded-full border border-gray-200 object-cover" />
                                        {inst.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-gray-800 truncate pr-2">{inst.name}</h4>
                                            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{inst.time}</span>
                                        </div>
                                        <p className="text-xs text-[#E5664B] font-medium mb-1">{inst.className}</p>
                                        <p className="text-sm text-gray-500 truncate">{inst.lastMessage}</p>
                                    </div>

                                    {/* Unread Badge */}
                                    {inst.unread > 0 && (
                                        <div className="flex flex-col items-end justify-center">
                                            <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                                {inst.unread}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            Không tìm thấy kết quả phù hợp.
                        </div>
                    )}
                </div>

            </div>

            {/* Cột Phải: Khung Chat */}
            <div className={`flex-1 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex flex-col overflow-hidden relative ${!selectedInstId ? 'hidden lg:flex' : 'flex'}`}>
                
                {!selectedInstructor ? (
                    // Trạng thái trống (Empty State)
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
                            <MessageSquare size={40} className="text-[#E5664B]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Chọn giảng viên để bắt đầu</h2>
                        <p className="text-gray-500 max-w-sm">Bạn có thể hỏi bài, giải đáp thắc mắc và trao đổi trực tiếp với giảng viên phụ trách lớp học của mình tại đây.</p>
                    </div>
                ) : (
                    // Trạng thái đang Chat
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-gray-100 px-6 flex items-center justify-between bg-white z-10 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                {/* Back button for mobile */}
                                <button 
                                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                    onClick={() => setSelectedInstId(null)}
                                >
                                    <ChevronDown className="rotate-90" size={24} />
                                </button>
                                
                                <div className="relative">
                                    <img src={selectedInstructor.avatar} alt={selectedInstructor.name} className="w-11 h-11 rounded-full border border-gray-200" />
                                    {selectedInstructor.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{selectedInstructor.name}</h3>
                                    <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                        Giảng viên lớp {selectedInstructor.className}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors hidden sm:block">
                                    <Phone size={20} />
                                </button>
                                <button className="p-2.5 text-gray-500 hover:bg-purple-50 hover:text-purple-600 rounded-full transition-colors hidden sm:block">
                                    <Video size={20} />
                                </button>
                                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body (Messages) */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC] scrollbar-thin scrollbar-thumb-gray-200">
                            {/* Date Separator */}
                            <div className="flex justify-center">
                                <span className="bg-white border border-gray-200 text-gray-500 text-xs font-medium px-4 py-1 rounded-full shadow-sm">
                                    Hôm nay
                                </span>
                            </div>

                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white shadow-sm mt-auto">
                                        {msg.sender === 'instructor' 
                                            ? <img src={selectedInstructor.avatar} alt="GV" />
                                            : <img src="https://ui-avatars.com/api/?name=Student&background=1F2937&color=fff" alt="Me" />
                                        }
                                    </div>
                                    
                                    {/* Message Bubble */}
                                    <div className={`flex flex-col max-w-[70%] sm:max-w-[60%] ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3.5 text-[15px] shadow-sm leading-relaxed ${
                                            msg.sender === 'student' 
                                                ? 'bg-[#E5664B] text-white rounded-2xl rounded-br-sm' 
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-400 mt-1 px-1">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Footer (Input) */}
                        <div className="p-4 sm:p-5 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                                <button type="button" className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                    <Paperclip size={20} />
                                </button>
                                
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-[#E5664B] focus-within:ring-2 focus-within:ring-[#E5664B]/20 transition-all flex items-center">
                                    <input 
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="w-full bg-transparent border-none py-3 px-4 focus:outline-none focus:ring-0 text-sm"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={!chatInput.trim()}
                                    className="p-3 rounded-full bg-[#E5664B] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#d6553a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    <Send size={18} className="ml-1" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default StudentContactInstructor;
