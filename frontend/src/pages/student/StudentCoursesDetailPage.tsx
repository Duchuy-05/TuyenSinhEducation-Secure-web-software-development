// import React, { useState } from 'react';
// import { 
//     PlayCircle, CheckCircle, Lock, 
//     FileText, MessageCircle, FileQuestion, 
//     ChevronDown, ChevronUp, Play 
// } from 'lucide-react';

// // --- MOCK DATA ---
// const courseData = {
//     title: "21 Ngày Thành Thạo Canva Thiết Kế Chuyên Nghiệp",
//     progress: 45,
//     chapters: [
//         {
//             id: 'ch1',
//             title: "Chương 1: Giới thiệu chung",
//             lessons: [
//                 { id: 'l1', title: "Bài 1: Làm quen với giao diện", type: 'video', duration: '12:00', status: 'completed' },
//                 { id: 'l2', title: "Bài 2: Các công cụ cơ bản", type: 'video', duration: '15:30', status: 'completed' },
//             ]
//         },
//         {
//             id: 'ch2',
//             title: "Chương 2: Thực hành thiết kế",
//             lessons: [
//                 { id: 'l3', title: "Bài 3: Thiết kế banner Facebook", type: 'video', duration: '20:15', status: 'playing' },
//                 { id: 'l4', title: "Bài tập thực hành", type: 'quiz', duration: '10 câu', status: 'locked' },
//                 { id: 'l5', title: "Bài 4: Thiết kế Instagram Post", type: 'video', duration: '18:00', status: 'locked' },
//             ]
//         },
//         {
//             id: 'ch3',
//             title: "Chương 3: Nâng cao & Mẹo hay",
//             lessons: [
//                 { id: 'l6', title: "Bài 5: Hiệu ứng chữ", type: 'video', duration: '14:20', status: 'locked' },
//                 { id: 'l7', title: "Bài 6: Xóa nền và bóng", type: 'video', duration: '22:10', status: 'locked' },
//                 { id: 'l8', title: "Kiểm tra cuối khóa", type: 'quiz', duration: '20 câu', status: 'locked' },
//             ]
//         }
//     ]
// };

// const tabs = [
//     { id: 'content', label: 'Nội dung', icon: <FileText size={18} /> },
//     { id: 'documents', label: 'Tài liệu', icon: <FileText size={18} /> },
//     { id: 'quiz', label: 'Quiz', icon: <FileQuestion size={18} /> },
//     { id: 'discussion', label: 'Thảo luận', icon: <MessageCircle size={18} /> },
// ];

// const StudentCoursesDetailPage: React.FC = () => {
//     const [activeTab, setActiveTab] = useState('content');
//     const [expandedChapters, setExpandedChapters] = useState<string[]>(['ch1', 'ch2']); // Mặc định mở 2 chương đầu
//     const [activeLesson, setActiveLesson] = useState('l3'); // Bài đang học

//     const toggleChapter = (chapterId: string) => {
//         setExpandedChapters(prev => 
//             prev.includes(chapterId) 
//                 ? prev.filter(id => id !== chapterId)
//                 : [...prev, chapterId]
//         );
//     };

//     return (
//         <div className="bg-[#F5F7FA] min-h-screen">
//             {/* Vùng Content chính */}
//             <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
                
//                 {/* Header Tiêu đề (Chỉ hiện ở mobile, desktop ẩn đi nhường chỗ) */}
//                 <div className="mb-4 lg:hidden">
//                     <h1 className="text-xl font-bold text-gray-800">{courseData.title}</h1>
//                 </div>

//                 {/* Grid Layout (75% - 25%) */}
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
//                     {/* ========================================================== */}
//                     {/* CỘT TRÁI (75%) - VIDEO & TABS CONTENT                      */}
//                     {/* ========================================================== */}
//                     <div className="lg:col-span-3 space-y-6">
                        
//                         {/* 1. Trình phát Video (Video Player) */}
//                         <div className="bg-black w-full aspect-video rounded-2xl overflow-hidden relative group shadow-lg">
//                             {/* Nền cover mô phỏng */}
//                             <img 
//                                 src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1600" 
//                                 alt="Video Thumbnail" 
//                                 className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300"
//                             />
                            
//                             {/* Nút Play siêu to */}
//                             <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
//                                 <div className="w-20 h-20 bg-[#E5664B] bg-opacity-90 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(229,102,75,0.4)]">
//                                     <Play size={36} className="ml-2" fill="currentColor" />
//                                 </div>
//                             </div>

//                             {/* Tiêu đề bài học overlay */}
//                             <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
//                                 <h2 className="text-white font-medium text-lg">Bài 3: Thiết kế banner Facebook</h2>
//                             </div>
//                         </div>

//                         {/* 2. Tabs Navigation */}
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                             <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
//                                 {tabs.map(tab => (
//                                     <button
//                                         key={tab.id}
//                                         onClick={() => setActiveTab(tab.id)}
//                                         className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
//                                             activeTab === tab.id 
//                                                 ? 'border-[#E5664B] text-[#E5664B]' 
//                                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                                         }`}
//                                     >
//                                         {tab.icon}
//                                         {tab.label}
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* 3. Nội dung của Tab */}
//                             <div className="p-6">
//                                 {activeTab === 'content' && (
//                                     <div className="space-y-4">
//                                         <h3 className="text-xl font-bold text-gray-800">Mô tả bài học</h3>
//                                         <p className="text-gray-600 leading-relaxed">
//                                             Trong bài học này, chúng ta sẽ áp dụng các công cụ cơ bản đã học ở chương 1 để thực hành tạo ra một Banner quảng cáo hoàn chỉnh cho nền tảng Facebook. Bạn sẽ học được tư duy bố cục, cách chọn màu sắc đồng nhất và những quy chuẩn kích thước quan trọng của Facebook.
//                                         </p>
//                                     </div>
//                                 )}
//                                 {activeTab === 'documents' && (
//                                     <div className="space-y-3">
//                                         <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:border-[#E5664B] cursor-pointer group transition-colors">
//                                             <div className="flex items-center gap-3">
//                                                 <FileText className="text-gray-400 group-hover:text-[#E5664B]" />
//                                                 <span className="font-medium text-gray-700 group-hover:text-[#E5664B]">Slide_Bai3_BannerFB.pdf</span>
//                                             </div>
//                                             <span className="text-sm text-gray-500">2.4 MB</span>
//                                         </div>
//                                         <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:border-[#E5664B] cursor-pointer group transition-colors">
//                                             <div className="flex items-center gap-3">
//                                                 <FileText className="text-gray-400 group-hover:text-[#E5664B]" />
//                                                 <span className="font-medium text-gray-700 group-hover:text-[#E5664B]">TaiNguyenHinhAnh.zip</span>
//                                             </div>
//                                             <span className="text-sm text-gray-500">15 MB</span>
//                                         </div>
//                                     </div>
//                                 )}
//                                 {activeTab === 'quiz' && (
//                                     <div className="text-center py-8">
//                                         <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E5664B]">
//                                             <FileQuestion size={32} />
//                                         </div>
//                                         <h3 className="text-lg font-bold text-gray-800">Chưa có bài tập</h3>
//                                         <p className="text-gray-500 mt-2">Bài học này không có bài tập trắc nghiệm đính kèm.</p>
//                                     </div>
//                                 )}
//                                 {activeTab === 'discussion' && (
//                                     <div className="text-center py-8">
//                                         <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
//                                             <MessageCircle size={32} />
//                                         </div>
//                                         <h3 className="text-lg font-bold text-gray-800">Thảo luận bài học</h3>
//                                         <p className="text-gray-500 mt-2 mb-6">Hãy đặt câu hỏi nếu bạn gặp khó khăn nhé!</p>
//                                         <button className="bg-[#E5664B] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors">
//                                             Đặt câu hỏi mới
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                     </div>

//                     {/* ========================================================== */}
//                     {/* CỘT PHẢI (25%) - PROGRESS & CURRICULUM                     */}
//                     {/* ========================================================== */}
//                     <div className="lg:col-span-1 space-y-6">
                        
//                         {/* 1. Thanh Tiến Độ (Progress Widget) */}
//                         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                             <h3 className="font-bold text-gray-800 mb-4 hidden lg:block">{courseData.title}</h3>
//                             <div className="flex justify-between items-center text-sm mb-2">
//                                 <span className="text-gray-600 font-medium">Tiến độ hoàn thành</span>
//                                 <span className="text-[#E5664B] font-bold">{courseData.progress}%</span>
//                             </div>
//                             <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
//                                 <div 
//                                     className="bg-[#E5664B] h-2.5 rounded-full transition-all duration-1000" 
//                                     style={{ width: `${courseData.progress}%` }}
//                                 ></div>
//                             </div>
//                             <p className="text-xs text-gray-500 text-center">Đã hoàn thành 2/8 bài học</p>
//                         </div>

//                         {/* 2. Danh sách Bài học (Curriculum Accordion) */}
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
//                             <div className="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
//                                 <h3 className="font-bold text-gray-800">Nội dung khóa học</h3>
//                             </div>

//                             {/* Khu vực cuộn (Scrollable area) */}
//                             <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
//                                 {courseData.chapters.map((chapter) => {
//                                     const isExpanded = expandedChapters.includes(chapter.id);
//                                     return (
//                                         <div key={chapter.id} className="border-b border-gray-100 last:border-0">
                                            
//                                             {/* Tiêu đề Chương (Accordion Header) */}
//                                             <button 
//                                                 onClick={() => toggleChapter(chapter.id)}
//                                                 className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
//                                             >
//                                                 <span className="font-bold text-sm text-gray-800 text-left pr-4">
//                                                     {chapter.title}
//                                                 </span>
//                                                 <span className="text-gray-400 flex-shrink-0">
//                                                     {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                                 </span>
//                                             </button>

//                                             {/* Danh sách bài học trong Chương */}
//                                             {isExpanded && (
//                                                 <div className="bg-gray-50/50 pb-2">
//                                                     {chapter.lessons.map(lesson => {
//                                                         const isActive = activeLesson === lesson.id;
//                                                         return (
//                                                             <div 
//                                                                 key={lesson.id}
//                                                                 onClick={() => {
//                                                                     if(lesson.status !== 'locked') setActiveLesson(lesson.id);
//                                                                 }}
//                                                                 className={`px-4 py-3 flex gap-3 group transition-colors ${
//                                                                     isActive 
//                                                                         ? 'bg-orange-50 cursor-default' 
//                                                                         : lesson.status === 'locked'
//                                                                             ? 'opacity-60 cursor-not-allowed'
//                                                                             : 'hover:bg-gray-100 cursor-pointer'
//                                                                 }`}
//                                                             >
//                                                                 {/* Icon trạng thái bài học */}
//                                                                 <div className="flex-shrink-0 mt-0.5">
//                                                                     {lesson.status === 'completed' && <CheckCircle size={18} className="text-green-500" />}
//                                                                     {lesson.status === 'playing' && <PlayCircle size={18} className="text-[#E5664B]" />}
//                                                                     {lesson.status === 'locked' && <Lock size={18} className="text-gray-400" />}
//                                                                 </div>

//                                                                 {/* Tên bài học và thời lượng */}
//                                                                 <div className="flex-1">
//                                                                     <p className={`text-sm ${isActive ? 'font-bold text-[#E5664B]' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
//                                                                         {lesson.title}
//                                                                     </p>
//                                                                     <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
//                                                                         {lesson.type === 'video' ? <PlayCircle size={12} /> : <FileQuestion size={12} />}
//                                                                         <span>{lesson.duration}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )
//                                 })}
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StudentCoursesDetailPage;
