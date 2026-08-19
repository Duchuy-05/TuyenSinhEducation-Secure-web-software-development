import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Phone, LogOut, Bell, User, Lock, ChevronDown } from 'lucide-react';
import { authApi } from '../../services/api';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Không thể gọi API đăng xuất:', error);
        }
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? 'flex items-center gap-3 px-5 py-3 text-white bg-slate-700 border-r-4 border-blue-500 transition-all'
            : 'flex items-center gap-3 px-5 py-3 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-r-4 hover:border-blue-500 transition-all';

    const subNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? 'flex items-center gap-2 px-10 py-2 text-white bg-slate-700 border-r-4 border-blue-500 text-sm font-medium transition-all'
            : 'flex items-center gap-2 px-10 py-2 text-slate-400 hover:bg-slate-700/50 hover:text-white border-r-4 border-transparent text-sm font-medium transition-all';

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-slate-400 flex flex-col flex-shrink-0">
                {/* Logo */}
                <div className="h-16 flex items-center px-5 text-2xl font-bold text-white border-b border-white/10">
                    Edu<span className="text-blue-400">Admin</span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 py-5 flex-1 overflow-y-auto">
                    <NavLink to="/admin/dashboard" className={navLinkClass}>
                        <LayoutDashboard size={20} /> Tổng quan
                    </NavLink>
                    <NavLink to="/admin/courses" className={navLinkClass}>
                        <BookOpen size={20} /> Quản lý Khóa học
                    </NavLink>
                    <NavLink to="/admin/teachers" className={navLinkClass}>
                        <Users size={20} /> Quản lý Giảng viên
                    </NavLink>
                    <NavLink to="/admin/class-students" className={navLinkClass}>
                        <Users size={20} /> Học viên trong lớp
                    </NavLink>

                    {/* User Management Dropdown */}
                    <div className={`flex flex-col ${usersDropdownOpen ? 'bg-slate-700/30' : ''}`}>
                        <button
                            type="button"
                            onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                            className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:bg-slate-700 hover:text-white text-base font-medium cursor-pointer transition-all w-full text-left"
                        >
                            <Users size={20} /> Quản lý Người dùng
                            <ChevronDown size={16} className={`ml-auto transition-transform ${usersDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {usersDropdownOpen && (
                            <div className="flex flex-col py-1">
                                <NavLink to="/admin/users/students" className={subNavLinkClass}>
                                    <User size={16} /> Danh sách Học viên
                                </NavLink>
                                <NavLink to="/admin/users/students/details" className={subNavLinkClass}>
                                    <User size={16} /> Chi tiết Học viên
                                </NavLink>
                                <NavLink to="/admin/users/students/manage-account" className={subNavLinkClass}>
                                    <Lock size={16} /> Khóa/Mở khóa Tài khoản
                                </NavLink>
                                <NavLink to="/admin/users/teachers" className={subNavLinkClass}>
                                    <Users size={16} /> Danh sách Giáo viên
                                </NavLink>
                                <NavLink to="/admin/users/teachers/approve" className={subNavLinkClass}>
                                    <User size={16} /> Duyệt Hồ sơ Giáo viên
                                </NavLink>
                                <NavLink to="/admin/users/teachers/permissions" className={subNavLinkClass}>
                                    <Lock size={16} /> Phân quyền Giảng dạy
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <NavLink to="/admin/registrations" className={navLinkClass}>
                        <Phone size={20} /> Đơn đăng ký / Liên hệ
                    </NavLink>
                    <NavLink to="/admin/posts" className={navLinkClass}>
                        <BookOpen size={20} /> Quản lý Bài viết
                    </NavLink>
                </nav>

                {/* Sidebar Footer - Logout */}
                <div className="mt-auto p-5 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-400/10 w-full text-base font-medium cursor-pointer rounded transition-all"
                    >
                        <LogOut size={20} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex-1">
                        <p>Trang quản lý</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                            <img
                                src="https://i.pravatar.cc/150?img=11"
                                alt="Admin Avatar"
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <span className="text-slate-700 font-medium">Admin Đào Tạo</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 px-8 py-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
