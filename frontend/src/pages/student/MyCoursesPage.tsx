import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PlayCircle, CheckCircle, Award, BookOpen,
    Search, Filter, ChevronDown, Clock, Users, Play
} from 'lucide-react';
import { mockStudentData } from '../../data/mockStudentData';

const MyCoursesPage: React.FC = () => {
    const { statistics, courses } = mockStudentData;
    const [searchTerm, setSearchTerm] = useState('');

    const statCards = [
        { title: 'Tổng khóa học', value: statistics.totalCourses, icon: <BookOpen size={24} />, bg: 'bg-[#E5664B]/10', color: 'text-[#E5664B]' },
        { title: 'Đang học', value: statistics.inProgress, icon: <PlayCircle size={24} />, bg: 'bg-blue-50', color: 'text-blue-600' },
        { title: 'Hoàn thành', value: statistics.completed, icon: <CheckCircle size={24} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
        { title: 'Chứng chỉ', value: statistics.certificates, icon: <Award size={24} />, bg: 'bg-purple-50', color: 'text-purple-600' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Đang học': return 'bg-blue-100 text-blue-700';
            case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700';
            case 'Chưa bắt đầu': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-4 lg:p-8 max-7xl mx-auto space-y-8">

            {/* Header Section */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Khóa học của tôi</h1>
                <p className="text-gray-500 mt-2 text-sm lg:text-base">Quản lý và tiếp tục học các khóa học đã đăng ký.</p>
            </div>

            {/* Statistics Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-[#E5E7EB] flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs lg:text-sm text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-xl lg:text-2xl font-bold text-[#1F2937] leading-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">

                {/* Select Filters - Scrollable on Mobile */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Sắp xếp: Mới nhất <ChevronDown size={16} />
                    </button>
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Danh mục: Tất cả <ChevronDown size={16} />
                    </button>
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Trạng thái: Tất cả <ChevronDown size={16} />
                    </button>
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> Giảng viên
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64 group">
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#E5664B] focus:ring-1 focus:ring-[#E5664B] transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B]" />
                </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-[16px] shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button className="bg-white/90 text-[#E5664B] p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <Play size={24} fill="currentColor" />
                                    </button>
                                </div>
                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md bg-white/90 ${getStatusBadge(course.status).split(' ')[1]}`}>
                                    {course.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-[#1F2937] text-base mb-2 line-clamp-2 leading-snug group-hover:text-[#E5664B] transition-colors">
                                    {course.title}
                                </h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm text-gray-600">{course.instructor.name}</span>
                                </div>

                                {/* Progress */}
                                <div className="mt-auto mb-5">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-medium text-gray-500">Tiến độ</span>
                                        <span className="text-xs font-bold text-[#E5664B]">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-[#E5664B] h-1.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mb-5">
                                    <span className="flex items-center gap-1.5"><PlayCircle size={14} /> {course.stats.lessons} bài</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {course.stats.duration}</span>
                                    <span className="flex items-center gap-1.5"><Users size={14} /> {course.stats.students.toLocaleString('vi-VN')}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Link to={`/my-courses/${course.id}`} className="flex-1 bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center">
                                        Tiếp tục học
                                    </Link>
                                    <Link to={`/my-courses/${course.id}`} className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center">
                                        Chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 mb-6 bg-orange-50 rounded-full flex items-center justify-center">
                        <BookOpen size={64} className="text-[#E5664B] opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">Bạn chưa có khóa học nào phù hợp</h3>
                    <p className="text-gray-500 mb-6 max-w-md">Hãy khám phá các khóa học chất lượng cao để nâng cao kỹ năng của bạn ngay hôm nay.</p>
                    <button className="bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2.5 px-6 rounded-lg transition-all hover:scale-[1.02]">
                        Khám phá khóa học
                    </button>
                </div>
            )}

        </div>
    );
};

export default MyCoursesPage;
