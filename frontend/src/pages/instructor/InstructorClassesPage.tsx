import React, { useState, useMemo } from 'react';
import { 
    School, Users, Activity, GraduationCap, 
    Search, Plus, Calendar, Clock, 
    MoreVertical, CheckCircle2,
    Filter, RefreshCw
} from 'lucide-react';
import { mockInstructorData } from '../../data/mockInstructorData';

export const InstructorClassesPage: React.FC = () => {
    const { statistics, classes, upcomingSessions, recentActivities, user } = mockInstructorData;
    
    // States cho Filter & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'students'>('newest');

    // Thống kê tổng quan
    const statCards = [
        { title: 'Tổng lớp học', value: statistics.totalClasses, icon: <School size={22} />, bg: 'bg-blue-50', color: 'text-blue-600' },
        { title: 'Tổng học viên', value: statistics.totalStudents.toLocaleString('vi-VN'), icon: <Users size={22} />, bg: 'bg-indigo-50', color: 'text-indigo-600' },
        { title: 'Đang hoạt động', value: statistics.activeClasses, icon: <Activity size={22} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
        { title: 'Hoàn thành', value: statistics.completedClasses, icon: <GraduationCap size={22} />, bg: 'bg-purple-50', color: 'text-purple-600' },
    ];

    // Helper xử lý màu Badges an toàn
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Đang học': 
                return { bg: 'bg-blue-500/90', text: 'text-white' };
            case 'Sắp khai giảng': 
                return { bg: 'bg-amber-500/90', text: 'text-white' };
            case 'Đã kết thúc': 
                return { bg: 'bg-slate-600/90', text: 'text-white' };
            default: 
                return { bg: 'bg-gray-600/90', text: 'text-white' };
        }
    };

    // Helper tách Schedule an toàn, tránh crash
    const parseSchedule = (scheduleStr?: string) => {
        if (!scheduleStr) return { days: 'Chưa có lịch', time: '' };
        const parts = scheduleStr.split('|').map(s => s.trim());
        return {
            days: parts[0] || scheduleStr,
            time: parts[1] || ''
        };
    };

    // Lọc và Sắp xếp danh sách lớp
    const filteredClasses = useMemo(() => {
        return classes
            .filter((cls) => {
                const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      cls.courseName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'ALL' || cls.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'students') {
                    return (b.stats?.students || 0) - (a.stats?.students || 0);
                }
                if (sortBy === 'oldest') {
                    return Number(a.id) - Number(b.id);
                }
                return Number(b.id) - Number(a.id); // 'newest' default
            });
    }, [classes, searchTerm, statusFilter, sortBy]);

    const handleCreateClass = () => {
        // Tích hợp trigger Modal hoặc Navigate tại đây
        alert('Mở dialog tạo lớp học mới');
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50/50">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Quản lý lớp học</h1>
                    <p className="text-slate-500 mt-1 text-sm lg:text-base">Theo dõi danh sách lớp, học viên và tiến độ giảng dạy thực tế.</p>
                </div>
                <button 
                    onClick={handleCreateClass}
                    className="self-start sm:self-auto bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2"
                >
                    <Plus size={18} /> Tạo lớp học mới
                </button>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-slate-500">{stat.title}</span>
                            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-none tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Class Management Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1 uppercase tracking-wider">
                        <Filter size={14} /> Bộ lọc:
                    </div>
                    
                    {/* Select Status */}
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E5664B]/20 focus:border-[#E5664B] transition-all cursor-pointer"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="Đang học">Đang học</option>
                        <option value="Sắp khai giảng">Sắp khai giảng</option>
                        <option value="Đã kết thúc">Đã kết thúc</option>
                    </select>

                    {/* Select Sort */}
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E5664B]/20 focus:border-[#E5664B] transition-all cursor-pointer"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="students">Nhiều học viên nhất</option>
                    </select>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên lớp, khóa học..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            {/* Class Grid */}
            {filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => {
                        const statusStyle = getStatusStyle(cls.status);
                        const schedule = parseSchedule(cls.schedule);

                        return (
                            <div 
                                key={cls.id} 
                                className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col group"
                            >
                                {/* Thumbnail & Status Badge */}
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    <img 
                                        src={cls.thumbnail} 
                                        alt={cls.className} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${statusStyle.bg} ${statusStyle.text}`}>
                                        {cls.status}
                                    </span>
                                </div>

                                {/* Main Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-[#E5664B] transition-colors">
                                        {cls.className}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-1">{cls.courseName}</p>
                                    
                                    {/* Instructor Info */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200" />
                                        <span className="text-xs font-medium text-slate-700">{user.name}</span>
                                    </div>

                                    {/* Schedule */}
                                    <div className="flex items-start gap-2.5 mb-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <Calendar size={15} className="text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-700">{schedule.days}</p>
                                            {schedule.time && <p className="text-slate-500 mt-0.5">{schedule.time}</p>}
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 mb-5 py-2 px-1 bg-slate-50/50 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-800">{cls.stats?.students ?? 0}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">Học viên</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{cls.stats?.lessons ?? 0}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">Bài học</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{cls.stats?.tests ?? 0}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">Bài kiểm tra</p>
                                        </div>
                                    </div>

                                    {/* Teaching Progress */}
                                    <div className="mt-auto mb-5">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs font-medium text-slate-500">Tiến độ khóa học</span>
                                            <span className="text-xs font-bold text-[#E5664B]">{cls.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-[#E5664B] h-1.5 rounded-full transition-all duration-700 ease-out"
                                                style={{ width: `${cls.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-auto">
                                        <button className="flex-1 bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-2 px-3 rounded-lg text-xs transition-all text-center">
                                            Quản lý lớp
                                        </button>
                                        <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2 px-3 rounded-lg text-xs transition-all text-center">
                                            Học viên
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 mb-4 bg-orange-50 rounded-full flex items-center justify-center text-[#E5664B]">
                        <School size={36} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy lớp học nào</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm">Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc trạng thái lớp học.</p>
                    <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                        <RefreshCw size={15} /> Đặt lại bộ lọc
                    </button>
                </div>
            )}

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Upcoming Classes Widget */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-[#E5664B]" /> Buổi học sắp diễn ra
                    </h3>
                    <div className="space-y-3">
                        {upcomingSessions.length > 0 ? (
                            upcomingSessions.map((session) => (
                                <div key={session.id} className="flex justify-between items-center p-3.5 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#E5664B] flex items-center justify-center font-bold text-sm">
                                            {session.className.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm line-clamp-1">{session.className}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Lớp trực tuyến</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-[#E5664B] bg-orange-50/80 border border-orange-100 px-3 py-1 rounded-full whitespace-nowrap">
                                        {session.time}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 py-4 text-center">Không có lịch học nào sắp tới.</p>
                        )}
                    </div>
                </div>

                {/* Activity Feed Widget */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-[#E5664B]" /> Hoạt động học viên gần đây
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="flex items-start gap-3 text-xs">
                                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-full mt-0.5 shrink-0">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-800">{act.user}</span>
                                        <time className="text-[11px] text-slate-400">{act.time}</time>
                                    </div>
                                    <p className="text-slate-600">
                                        Đã <span className="font-medium text-slate-900">{act.action}</span>: <span className="text-slate-700">{act.target}</span>
                                    </p>
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