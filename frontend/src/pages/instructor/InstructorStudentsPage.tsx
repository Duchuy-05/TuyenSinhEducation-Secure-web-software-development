import React, { useState } from 'react';
import { 
    Search, Filter, Phone, Video, MoreVertical, 
    Paperclip, Image as ImageIcon, Mic, Smile, Send, 
    Download, Info, ChevronLeft, Check, CheckCircle2,
    Activity, BookOpen, X, MessageSquare
} from 'lucide-react';
import { mockInstructorData } from '../../data/mockInstructorData';

const InstructorStudentsPage: React.FC = () => {
    const studentChats = mockInstructorData?.studentChats || [];
    
    // UI State
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [showProfileDrawer, setShowProfileDrawer] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const selectedStudent = studentChats.find(s => s.id === selectedStudentId);

    return (
        <div className="h-[calc(100vh-72px)] bg-[#F8FAFC] flex flex-col overflow-hidden">
            
            {/* Header Area */}
            <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-[#1F2937]">Học viên</h1>
                    <p className="text-sm text-gray-500">Quản lý học viên và trao đổi trực tiếp.</p>
                </div>
                <div className="flex gap-3">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download size={16} /> Xuất danh sách
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#E5664B] text-white rounded-lg text-sm font-medium hover:bg-[#d6553a] transition-colors shadow-sm">
                        + Tin nhắn mới
                    </button>
                </div>
            </div>

            {/* Main 3-Column Layout */}
            <div className="flex-1 flex overflow-hidden p-2 lg:p-4 gap-4">
                
                {/* Left Panel: Student List (Always visible or full width on mobile if no student selected) */}
                <div className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden w-full lg:w-[320px] flex-shrink-0 transition-all ${selectedStudentId ? 'hidden lg:flex' : 'flex'}`}>
                    
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative group mb-3">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm học viên..." 
                                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E5664B] focus:bg-white transition-all"
                            />
                            <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B]" />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                                Lớp học <ChevronLeft size={14} className="-rotate-90" />
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                                <Filter size={14} /> Lọc
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {studentChats.map(student => (
                            <button 
                                key={student.id}
                                onClick={() => setSelectedStudentId(student.id)}
                                className={`w-full text-left p-4 border-b border-gray-50 flex gap-3 transition-colors hover:bg-gray-50 relative ${selectedStudentId === student.id ? 'bg-[#FFF4F1] border-l-4 border-l-[#E5664B] hover:bg-[#FFF4F1]' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${student.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="font-bold text-[#1F2937] text-sm truncate">{student.name}</h4>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{student.lastMessageTime}</span>
                                    </div>
                                    <p className="text-xs text-[#E5664B] font-medium mb-1 truncate">{student.className}</p>
                                    <p className={`text-xs truncate ${student.unread > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                                        {student.lastMessage}
                                    </p>
                                </div>
                                {student.unread > 0 && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                        {student.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Panel: Chat Window */}
                <div className={`flex-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden relative transition-all ${!selectedStudentId ? 'hidden lg:flex' : 'flex'}`}>
                    {selectedStudent ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[72px] border-b border-gray-100 px-4 md:px-6 flex justify-between items-center flex-shrink-0 bg-white z-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <button 
                                        onClick={() => setSelectedStudentId(null)}
                                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="relative">
                                        <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-10 h-10 rounded-full" />
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${selectedStudent.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-[#1F2937] leading-tight">{selectedStudent.name}</h2>
                                        <p className="text-xs text-gray-500">
                                            {selectedStudent.className} • {selectedStudent.status === 'online' ? <span className="text-emerald-500 font-medium">Đang hoạt động</span> : 'Ngoại tuyến'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <button className="p-2 text-gray-500 hover:text-[#E5664B] hover:bg-orange-50 rounded-full transition-colors hidden sm:block">
                                        <Phone size={20} />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-[#E5664B] hover:bg-orange-50 rounded-full transition-colors hidden sm:block">
                                        <Video size={20} />
                                    </button>
                                    <button 
                                        onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                                        className={`p-2 rounded-full transition-colors lg:hidden ${showProfileDrawer ? 'text-[#E5664B] bg-orange-50' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <Info size={20} />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 space-y-6">
                                {selectedStudent.messages.map((msg, idx) => {
                                    const isTeacher = msg.sender === 'teacher';
                                    return (
                                        <div key={msg.id} className={`flex ${isTeacher ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isTeacher ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {!isTeacher && (
                                                    <img src={selectedStudent.avatar} alt="Avatar" className="w-8 h-8 rounded-full flex-shrink-0 mt-auto" />
                                                )}
                                                <div className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl ${isTeacher ? 'bg-[#E5664B] text-white rounded-br-sm' : 'bg-[#F3F4F6] text-[#1F2937] rounded-bl-sm'}`}>
                                                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-medium">
                                                        <span>{msg.time}</span>
                                                        {isTeacher && msg.seen && <span className="text-[#E5664B] ml-1 flex items-center"><Check size={12} className="mr-0.5"/> Đã xem</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Composer Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-[#E5664B] focus-within:bg-white transition-colors shadow-sm">
                                    <textarea 
                                        rows={1}
                                        placeholder="Nhập tin nhắn..." 
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        className="w-full bg-transparent resize-none outline-none text-sm px-3 py-2 text-gray-800 placeholder-gray-400 max-h-32"
                                    ></textarea>
                                    <div className="flex justify-between items-center px-2 pt-2">
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <button className="p-1.5 hover:text-[#E5664B] hover:bg-orange-50 rounded-lg transition-colors"><Paperclip size={18} /></button>
                                            <button className="p-1.5 hover:text-[#E5664B] hover:bg-orange-50 rounded-lg transition-colors"><ImageIcon size={18} /></button>
                                            <button className="p-1.5 hover:text-[#E5664B] hover:bg-orange-50 rounded-lg transition-colors"><Mic size={18} /></button>
                                            <button className="p-1.5 hover:text-[#E5664B] hover:bg-orange-50 rounded-lg transition-colors"><Smile size={18} /></button>
                                        </div>
                                        <button className="w-9 h-9 flex items-center justify-center bg-[#E5664B] hover:bg-[#d6553a] text-white rounded-xl transition-transform hover:scale-105 shadow-sm">
                                            <Send size={16} className="-ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State for Chat Window */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
                            <div className="w-48 h-48 mb-6 relative">
                                <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse opacity-50"></div>
                                <div className="absolute inset-4 bg-white rounded-full shadow-sm flex items-center justify-center">
                                    <MessageSquare size={64} className="text-[#E5664B] opacity-50" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Chọn học viên để bắt đầu</h2>
                            <p className="text-gray-500 max-w-md">Bạn có thể hỗ trợ học viên, giải đáp thắc mắc và theo dõi tiến độ học tập ngay tại đây.</p>
                        </div>
                    )}
                </div>

                {/* Right Panel: Student Profile (CRM) */}
                <div className={`
                    fixed inset-y-0 right-0 z-40 w-[320px] xl:w-[360px] bg-white border-l border-[#E5E7EB] shadow-2xl transform transition-transform duration-300
                    xl:static xl:shadow-sm xl:border xl:rounded-2xl xl:transform-none xl:translate-x-0
                    ${showProfileDrawer ? 'translate-x-0' : 'translate-x-full'} 
                    ${selectedStudent ? 'flex flex-col' : 'hidden'}
                `}>
                    {selectedStudent && (
                        <div className="h-full overflow-y-auto scrollbar-hide">
                            {/* Mobile Drawer Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-100 lg:hidden">
                                <h3 className="font-bold text-gray-800">Hồ sơ học viên</h3>
                                <button onClick={() => setShowProfileDrawer(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
                            </div>

                            {/* Profile Header */}
                            <div className="p-6 text-center border-b border-gray-100">
                                <img src={selectedStudent.avatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover" />
                                <h2 className="text-xl font-bold text-[#1F2937]">{selectedStudent.name}</h2>
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                    Học viên
                                </span>
                            </div>

                            {/* CRM Stats Grid */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 mb-1">Điểm danh</p>
                                        <p className="font-bold text-[#1F2937] text-lg">{selectedStudent.profile.attendance}%</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 mb-1">Tiến độ</p>
                                        <p className="font-bold text-[#1F2937] text-lg text-[#E5664B]">{selectedStudent.profile.progress}%</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 mb-1">Đã nộp</p>
                                        <p className="font-bold text-[#1F2937] text-lg">{selectedStudent.profile.assignments}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 mb-1">Điểm TB</p>
                                        <p className="font-bold text-[#1F2937] text-lg text-emerald-600">{selectedStudent.profile.averageScore}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-[#1F2937] mb-3 flex items-center gap-2"><Activity size={16} className="text-[#E5664B]"/> Tiến độ học tập</h3>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Đã hoàn thành</span>
                                    <span className="text-xs font-bold text-gray-700">{selectedStudent.profile.lessonsCompleted} bài</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
                                    <div className="bg-[#E5664B] h-2 rounded-full" style={{ width: `${selectedStudent.profile.progress}%` }}></div>
                                </div>

                                <h4 className="text-sm font-bold text-gray-700 mb-2 mt-4">Lớp đang tham gia</h4>
                                <div className="space-y-2">
                                    {selectedStudent.profile.classes.map((cls, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 border border-gray-100">
                                            <span className="font-medium text-gray-700">{cls.name}</span>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${cls.status === 'Đang học' ? 'bg-orange-100 text-[#E5664B]' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {cls.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-6 pb-20 lg:pb-6">
                                <h3 className="font-bold text-[#1F2937] mb-4 flex items-center gap-2"><BookOpen size={16} className="text-[#E5664B]"/> Hoạt động gần đây</h3>
                                <div className="relative border-l-2 border-gray-100 ml-2 space-y-4">
                                    {selectedStudent.profile.timeline.map((act, i) => (
                                        <div key={i} className="relative pl-4">
                                            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></span>
                                            <p className="text-sm text-gray-700">{act.action}</p>
                                            <span className="text-xs text-gray-400 mt-0.5 block">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default InstructorStudentsPage;
