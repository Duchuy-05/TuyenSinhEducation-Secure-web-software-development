import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MonitorPlay, CheckCircle, Award, Clock, PlayCircle } from 'lucide-react';
import { mockStudentData } from '../../data/mockStudentData';

const StudentDashboard: React.FC = () => {
    // Lấy user thực tế từ localStorage (nếu có), fallback bằng mock data
    const storedUser = localStorage.getItem('user');
    const realUser = storedUser ? JSON.parse(storedUser) : mockStudentData.user;
    
    const { statistics, courses } = mockStudentData;

    // Lọc các khóa học đang học dở
    const inProgressCourses = courses.filter(course => course.status === 'Đang học');

    return (
        <div className="p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-8">
            
            {/* Header (Lời chào mừng) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Chào mừng trở lại, {realUser.name || realUser.fullName || "Học viên"}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Hãy tiếp tục hành trình học tập tuyệt vời của bạn ngay hôm nay.
                    </p>
                </div>
                <div className="hidden md:block">
                    <button className="bg-orange-50 text-[#E5664B] px-5 py-2.5 rounded-xl font-medium hover:bg-orange-100 transition-colors">
                        Khám phá khóa học mới
                    </button>
                </div>
            </div>

            {/* Thống kê (Statistics Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Tổng số khóa học */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{statistics.totalCourses}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Tổng khóa học</p>
                </div>

                {/* Đang học */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-[#E5664B] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MonitorPlay size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{statistics.inProgress}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Đang học</p>
                </div>

                {/* Đã hoàn thành */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{statistics.completed}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Đã hoàn thành</p>
                </div>

                {/* Chứng chỉ */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">{statistics.certificates}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Chứng chỉ nhận được</p>
                </div>

            </div>

            {/* Khối Tiếp tục học (Continue Learning) */}
            {inProgressCourses.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Tiếp tục học</h2>
                        <a href="/my-courses" className="text-sm text-[#E5664B] font-medium hover:underline">
                            Xem tất cả
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {inProgressCourses.map(course => (
                            <Link to={`/my-courses/${course.id}`} key={course.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-all group">
                                
                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden">
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-white" size={32} />
                                    </div>
                                </div>

                                {/* Thông tin khóa học */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="text-xs font-bold text-[#E5664B] bg-orange-50 inline-block px-2 py-1 rounded-md mb-2">
                                            {course.category}
                                        </div>
                                        <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#E5664B] transition-colors cursor-pointer">
                                            {course.title}
                                        </h3>
                                    </div>

                                    <div className="mt-4 sm:mt-0">
                                        <div className="flex justify-between items-center text-sm mb-1.5">
                                            <span className="text-gray-500 font-medium">Tiến độ</span>
                                            <span className="text-gray-800 font-bold">{course.progress}%</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div 
                                                className="bg-[#E5664B] h-2 rounded-full transition-all duration-1000" 
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Banner hoặc CTA Khác */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Cần giúp đỡ trong quá trình học?</h3>
                    <p className="text-orange-100 text-sm">Đội ngũ hỗ trợ của Đức Huy luôn sẵn sàng giải đáp thắc mắc của bạn.</p>
                </div>
                <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors whitespace-nowrap shadow-sm">
                    Liên hệ Hỗ trợ
                </button>
            </div>

        </div>
    );
};

export default StudentDashboard;
