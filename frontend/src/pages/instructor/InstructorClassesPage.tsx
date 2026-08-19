import React, { useState } from 'react';
import { 
    School, Users, Activity, GraduationCap, 
    Search, ChevronDown, Plus, Calendar, Clock, 
    MoreVertical, CheckCircle, FileText, CheckSquare
} from 'lucide-react';
import { mockInstructorData } from '../../data/mockInstructorData';

const InstructorClassesPage: React.FC = () => {
    const { statistics, classes, upcomingSessions, recentActivities, user } = mockInstructorData;
    const [searchTerm, setSearchTerm] = useState('');

    const statCards = [
        { title: 'Tổng lớp học', value: statistics.totalClasses, icon: <School size={24} />, bg: 'bg-blue-50', color: 'text-blue-600' },
        { title: 'Tổng học viên', value: statistics.totalStudents.toLocaleString('vi-VN'), icon: <Users size={24} />, bg: 'bg-indigo-50', color: 'text-indigo-600' },
        { title: 'Đang hoạt động', value: statistics.activeClasses, icon: <Activity size={24} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
        { title: 'Hoàn thành', value: statistics.completedClasses, icon: <GraduationCap size={24} />, bg: 'bg-purple-50', color: 'text-purple-600' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Đang học': return 'bg-blue-100 text-blue-700';
            case 'Sắp khai giảng': return 'bg-yellow-100 text-yellow-700';
            case 'Đã kết thúc': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredClasses = classes.filter(c => c.className.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Quản lý lớp học</h1>
                <p className="text-gray-500 mt-2 text-sm lg:text-base">Quản lý các lớp học, học viên và tiến độ giảng dạy.</p>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] flex flex-col justify-center gap-3 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[#1F2937] leading-tight">{stat.value}</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Class Management Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                
                {/* Horizontal Filter Bar */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Sắp xếp: Mới tạo <ChevronDown size={16} />
                    </button>
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Tất cả khóa học <ChevronDown size={16} />
                    </button>
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Trạng thái: Tất cả <ChevronDown size={16} />
                    </button>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64 group">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm lớp học..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#E5664B] focus:ring-1 focus:ring-[#E5664B] transition-all"
                        />
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B]" />
                    </div>

                    {/* Create Class Button */}
                    <button className="flex-shrink-0 bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] flex items-center gap-2">
                        <Plus size={18} /> Tạo lớp học
                    </button>
                </div>
            </div>

            {/* Class Grid */}
            {filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => (
                        <div 
                            key={cls.id} 
                            className="bg-white rounded-[16px] shadow-md border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
                        >
                            {/* Banner Image */}
                            <div className="relative aspect-video overflow-hidden">
                                <img 
                                    src={cls.thumbnail} 
                                    alt={cls.className} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md bg-white/90 ${getStatusBadge(cls.status).split(' ')[1]}`}>
                                    {cls.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-[#1F2937] text-lg mb-1 leading-snug group-hover:text-[#E5664B] transition-colors">
                                    {cls.className}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-1">{cls.courseName}</p>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                                </div>

                                {/* Schedule */}
                                <div className="flex items-start gap-2 mb-4 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                    <Calendar size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p>{cls.schedule.split(' | ')[0]}</p>
                                        <p className="text-gray-500">{cls.schedule.split(' | ')[1]}</p>
                                    </div>
                                </div>

                                {/* Student Statistics */}
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-5 font-medium">
                                    <span className="flex items-center gap-1.5"><Users size={16} className="text-blue-500" /> {cls.stats.students} Học viên</span>
                                    <span className="flex items-center gap-1.5"><FileText size={16} className="text-emerald-500" /> {cls.stats.lessons} Bài học</span>
                                    <span className="flex items-center gap-1.5"><CheckSquare size={16} className="text-purple-500" /> {cls.stats.tests} Kiểm tra</span>
                                </div>

                                {/* Progress */}
                                <div className="mt-auto mb-6">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-medium text-gray-500">Tiến độ giảng dạy</span>
                                        <span className="text-xs font-bold text-[#E5664B]">{cls.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-[#E5664B] h-1.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${cls.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2 border-t border-gray-100 pt-5">
                                    <button className="flex-1 bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2 px-3 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        Quản lý lớp
                                    </button>
                                    <button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        Học viên
                                    </button>
                                    <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-500 py-2 px-2.5 rounded-lg transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 mb-6 bg-orange-50 rounded-full flex items-center justify-center">
                        <School size={64} className="text-[#E5664B] opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">Bạn chưa tạo lớp học nào</h3>
                    <p className="text-gray-500 mb-6 max-w-md">Hãy bắt đầu tạo lớp học đầu tiên của bạn để chia sẻ kiến thức với các học viên.</p>
                    <button className="bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2.5 px-6 rounded-lg transition-all hover:scale-[1.02]">
                        Tạo lớp học đầu tiên
                    </button>
                </div>
            )}

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                
                {/* Upcoming Classes Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                    <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-[#E5664B]" /> Lớp học sắp diễn ra
                    </h3>
                    <div className="space-y-4">
                        {upcomingSessions.map(session => (
                            <div key={session.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#E5664B] flex items-center justify-center font-bold">
                                        {session.className.charAt(4)}
                                    </div>
                                    <p className="font-semibold text-gray-800">{session.className}</p>
                                </div>
                                <div className="text-sm font-medium text-[#E5664B] bg-orange-50 px-3 py-1 rounded-full">
                                    {session.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Student Activities */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
                    <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-[#E5664B]" /> Hoạt động gần đây
                    </h3>
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {recentActivities.map((act, index) => (
                            <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <CheckCircle size={16} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="font-bold text-slate-900">{act.user}</div>
                                        <time className="text-xs font-medium text-[#E5664B]">{act.time}</time>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Đã <span className="font-medium text-slate-700">{act.action}</span>: {act.target}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default InstructorClassesPage;
