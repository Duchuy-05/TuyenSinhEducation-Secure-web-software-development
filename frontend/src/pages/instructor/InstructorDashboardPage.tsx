import React from 'react';
import { Link } from 'react-router-dom';
import { 
    School, Users, GraduationCap, DollarSign, 
    BookOpen, ClipboardCheck, BarChart, Bell, 
    Activity, Clock, Star, TrendingUp, TrendingDown,
    ArrowUpRight, PlayCircle
} from 'lucide-react';
import { mockInstructorData } from '../../data/mockInstructorData';

const InstructorDashboardPage: React.FC = () => {
    const { 
        statistics, classes, upcomingSessions, 
        recentActivities, topCourses, 
        notifications, recentReviews 
    } = mockInstructorData;

    const userStr = localStorage.getItem('user');
    let user: any = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch {
        user = null;
    }
    const quickActions = [
        { name: 'Tạo khóa học', icon: <BookOpen size={24} />, bg: 'bg-blue-50', color: 'text-blue-600', link: '/instructor/courses' },
        { name: 'Tạo lớp học', icon: <School size={24} />, bg: 'bg-orange-50', color: 'text-[#E5664B]', link: '/my-class/create' },
        { name: 'Quản lý học viên', icon: <Users size={24} />, bg: 'bg-emerald-50', color: 'text-emerald-600', link: '/instructor/students' },
        { name: 'Tạo bài kiểm tra', icon: <ClipboardCheck size={24} />, bg: 'bg-purple-50', color: 'text-purple-600', link: '/instructor/quizzes/create' },
        { name: 'Xem doanh thu', icon: <BarChart size={24} />, bg: 'bg-indigo-50', color: 'text-indigo-600', link: '/instructor/revenue' },
        { name: 'Gửi thông báo', icon: <Bell size={24} />, bg: 'bg-yellow-50', color: 'text-yellow-600', link: '/instructor/notifications/send' },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
            
            {/* Welcome Hero Card */}
            <div className="rounded-2xl overflow-hidden relative shadow-md bg-gradient-to-br from-[#E5664B] to-[#F08A73] text-white">
                <div className="relative z-10 p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Xin chào, {user?.fullName?.trim()?.split(' ').pop()} 👋</h1>
                            <p className="text-orange-50 text-sm lg:text-base opacity-90">
                                Chào mừng bạn quay trở lại hệ thống quản lý giảng dạy. Hôm nay bạn có một vài lịch trình quan trọng!
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                                📚 {statistics.totalClasses} Lớp học
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                                👨‍🎓 {statistics.totalStudents.toLocaleString('vi-VN')} Học viên
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                                ⚡ {statistics.activeClasses} Đang hoạt động
                            </span>
                        </div>
                    </div>
                    
                    {/* Decorative Illustration (CSS Mock) */}
                    <div className="hidden md:flex w-48 h-48 bg-white/10 rounded-full items-center justify-center relative">
                        <div className="absolute w-32 h-32 bg-white/20 rounded-full animate-ping opacity-20"></div>
                        <School size={80} className="text-white opacity-90 relative z-10" />
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-900 opacity-20 rounded-full blur-2xl"></div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-orange-50 text-[#E5664B] group-hover:bg-[#E5664B] group-hover:text-white transition-colors">
                            <School size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} /> +3 tháng này
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1F2937] mb-1">{statistics.totalClasses}</h3>
                    <p className="text-sm text-gray-500 font-medium">Tổng lớp học</p>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} /> +120 mới
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1F2937] mb-1">{statistics.totalStudents.toLocaleString('vi-VN')}</h3>
                    <p className="text-sm text-gray-500 font-medium">Tổng học viên</p>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <GraduationCap size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1F2937] mb-1">12</h3>
                    <p className="text-sm text-gray-500 font-medium">Khóa học đang dạy</p>
                </div>
                {/* Card 4 */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <TrendingDown size={12} /> -5%
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1F2937] mb-1">35.5M</h3>
                    <p className="text-sm text-gray-500 font-medium">Doanh thu tháng (VND)</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-[#1F2937] mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickActions.map((action, idx) => (
                        <Link 
                            key={idx} 
                            to={action.link}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center gap-3"
                        >
                            <div className={`p-3 rounded-xl ${action.bg} ${action.color}`}>
                                {action.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{action.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Dashboard Grid (Left 70% - Right 30%) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column (Main Activity) */}
                <div className="xl:col-span-2 space-y-8">
                    
                    {/* My Classes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-[#1F2937]">Lớp học của tôi</h2>
                            <Link to="/my-class" className="text-sm font-medium text-[#E5664B] hover:underline flex items-center gap-1">
                                Xem tất cả <ArrowUpRight size={16} />
                            </Link>
                        </div>
                        <div className="p-6 space-y-4">
                            {classes.slice(0, 3).map((cls) => (
                                <div key={cls.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={cls.thumbnail} alt={cls.className} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <PlayCircle size={20} className="text-white opacity-80" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1F2937]">{cls.className}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{cls.courseName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                        <div className="text-center">
                                            <span className="block text-sm font-bold text-[#1F2937]">{cls.stats.students}</span>
                                            <span className="text-xs text-gray-500">học viên</span>
                                        </div>
                                        <div className="w-24 hidden sm:block">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-[#E5664B]">{cls.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div className="bg-[#E5664B] h-1.5 rounded-full" style={{ width: `${cls.progress}%` }}></div>
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:text-[#E5664B] hover:border-[#E5664B] transition-colors whitespace-nowrap">
                                            Quản lý
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline & Schedule Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Upcoming Schedule */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                                <Clock className="text-[#E5664B]" size={20} /> Lịch giảng dạy hôm nay
                            </h2>
                            <div className="space-y-5">
                                <div className="flex gap-4">
                                    <div className="w-16 text-right pt-1">
                                        <span className="text-sm font-bold text-gray-700">08:00</span>
                                    </div>
                                    <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-3 border-l-4 border-l-[#E5664B]">
                                        <h4 className="font-bold text-[#E5664B] text-sm">ReactJS K15</h4>
                                        <p className="text-xs text-gray-600 mt-1">Học phần: React Hooks</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-16 text-right pt-1">
                                        <span className="text-sm font-bold text-gray-700">14:00</span>
                                    </div>
                                    <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3 border-l-4 border-l-blue-500">
                                        <h4 className="font-bold text-blue-600 text-sm">UI/UX Design K12</h4>
                                        <p className="text-xs text-gray-600 mt-1">Học phần: Wireframing</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-16 text-right pt-1">
                                        <span className="text-sm font-bold text-gray-400">19:00</span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 opacity-60">
                                        <h4 className="font-bold text-gray-600 text-sm">AI Beginner K07</h4>
                                        <p className="text-xs text-gray-500 mt-1">Sắp diễn ra</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                                <Activity className="text-emerald-500" size={20} /> Hoạt động học viên
                            </h2>
                            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                                {recentActivities.map((act, index) => (
                                    <div key={index} className="relative pl-6">
                                        <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#E5664B]"></span>
                                        <p className="text-sm text-gray-800">
                                            <span className="font-bold">{act.user}</span> đã {act.action}
                                        </p>
                                        <p className="text-xs font-medium text-[#E5664B] mt-0.5">{act.target}</p>
                                        <span className="text-xs text-gray-400 mt-1 block">{act.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Analytics & Info) */}
                <div className="space-y-8">
                    
                    {/* Revenue Mock Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#1F2937]">Doanh thu</h2>
                            <select className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none">
                                <option>6 tháng gần đây</option>
                                <option>Năm nay</option>
                            </select>
                        </div>
                        <div className="h-48 w-full flex items-end justify-between gap-2">
                            {/* CSS Bar Chart Mock */}
                            {[40, 60, 45, 80, 50, 95].map((height, i) => (
                                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                    <div className="w-full bg-orange-50 rounded-t-sm h-full flex items-end justify-center relative">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#E5664B] to-orange-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            {height * 500}k
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">T{i+1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                                Thông báo <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">3 mới</span>
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {notifications.map(notif => (
                                <div key={notif.id} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-[#E5664B]' : 'bg-gray-300'}`}></div>
                                    <div>
                                        <p className={`text-sm ${notif.unread ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{notif.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Courses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Hiệu suất khóa học</h2>
                        <div className="space-y-4">
                            {topCourses.slice(0, 4).map((course, idx) => (
                                <div key={course.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 text-center font-bold text-sm ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                                            #{idx + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold text-[#1F2937]">{course.name}</p>
                                            <p className="text-xs text-gray-500">{course.students} Học viên</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                                        <Star size={14} fill="currentColor" /> {course.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Section: Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-[#1F2937]">Đánh giá gần đây</h2>
                    <Link to="/instructor/reviews" className="text-sm font-medium text-[#E5664B] hover:underline">
                        Xem tất cả
                    </Link>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentReviews.map(review => (
                        <div key={review.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-[#1F2937] text-sm">{review.studentName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{review.time}</p>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(review.rating) ? "currentColor" : "none"} className={i >= Math.floor(review.rating) ? "text-gray-300" : ""} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3 italic">"{review.content}"</p>
                            <p className="text-xs font-medium text-[#E5664B] bg-orange-50 inline-block px-2 py-1 rounded">
                                {review.course}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default InstructorDashboardPage;
