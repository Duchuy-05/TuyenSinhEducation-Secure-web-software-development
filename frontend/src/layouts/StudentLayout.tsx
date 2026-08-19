import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Bell, Heart, ShoppingCart, Menu, X,
    LayoutDashboard, BookOpen, MonitorPlay, Users,
    Award, Clock, Settings, LogOut, MessageSquare, CalendarDays
} from 'lucide-react';
import { authApi } from '../services/api';
import { USER_UPDATED_EVENT } from '../utils/authEvents';

const StudentLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>({});

    useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // Lắng nghe khi user được cập nhật ở nơi khác (VD: trang Settings)
    const handleUserUpdated = (e: Event) => {
        setUser((e as CustomEvent).detail);
    };
    window.addEventListener(USER_UPDATED_EVENT, handleUserUpdated);
    return () => window.removeEventListener(USER_UPDATED_EVENT, handleUserUpdated);
}, []);

    const handleLogout = async () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            try {
                await authApi.logout();
            } catch (error) {
                console.error('Không thể gọi API đăng xuất:', error);
            }
            localStorage.removeItem('user');
            setUser({});
            navigate('/login');
        }
    };

    const getInitial = (full_name: string) => {
        if (!full_name) return 'S';
        const nameArray = full_name.trim().split(' ');
        const lastName = nameArray[nameArray.length - 1];
        return lastName.charAt(0).toUpperCase();
    };

    const navItems = [
        { name: 'Tổng quan', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Lớp học', path: '/classes', icon: <MonitorPlay size={20} /> },
        { name: 'Lịch học', path: '/schedule', icon: <CalendarDays size={20} /> },
        { name: 'Thông báo', path: '/announcements', icon: <Bell size={20} /> },
        // { name: 'Hội viên', path: '/membership', icon: <Users size={20} /> },
        // { name: 'Chứng nhận', path: '/certificates', icon: <Award size={20} /> },
        // { name: 'Hỏi đáp giáo viên', path: '/ask-teacher', icon: <MessageSquare size={20} /> },
        // { name: 'Lịch sử đơn hàng', path: '/orders', icon: <Clock size={20} /> },
        { name: 'Cài đặt tài khoản', path: '/settings', icon: <Settings size={20} /> },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[#F5F7FA] font-sans overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Left Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 w-[260px] bg-white border-r border-[#E5E7EB] transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#E5E7EB] lg:hidden">
                    <span className="text-xl font-bold text-[#1F2937]">Menu</span>
                    <button onClick={toggleSidebar} className="text-gray-500 hover:text-[#E5664B]">
                        <X size={24} />
                    </button>
                </div>

                <div className="py-6 px-4 flex-1 overflow-y-auto scrollbar-hide">
                    <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-4 px-4 uppercase">
                        Học Viên
                    </h2>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                                        ${isActive
                                            ? 'bg-orange-50 text-[#E5664B]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#1F2937]'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#E5664B] rounded-r-md"></div>
                                    )}
                                    <div className={isActive ? "text-[#E5664B]" : "text-gray-400 group-hover:text-gray-600"}>
                                        {item.icon}
                                    </div>
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Nút Đăng xuất ở đáy Sidebar */}
                <div className="p-4 border-t border-[#E5E7EB]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium text-sm group"
                    >
                        <div className="text-gray-400 group-hover:text-red-600">
                            <LogOut size={20} />
                        </div>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Navigation Bar */}
                <header className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">

                    {/* Left: Mobile Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu size={24} />
                        </button>

                    </div>

                    {/* Center: Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học, giảng viên..."
                                className="w-full bg-[#F5F7FA] border border-transparent text-[#1F2937] text-sm rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:border-[#E5664B] focus:bg-white transition-all duration-300"
                            />
                            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B] transition-colors" />
                        </div>
                    </div>

                    {/* Right: Actions & User */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <nav className="hidden lg:flex items-center gap-6 mr-4 text-sm font-medium text-gray-600">
                            <Link to="#" className="hover:text-[#E5664B] transition-colors">Doanh nghiệp</Link>
                            <Link to="#" className="hover:text-[#E5664B] transition-colors">Hội viên</Link>
                        </nav>

                        <div className="flex items-center gap-1 sm:gap-2 border-r border-[#E5E7EB] pr-2 sm:pr-4">
                            <button className="p-2 text-gray-500 hover:text-[#E5664B] hover:bg-orange-50 rounded-full transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E5664B] rounded-full border border-white"></span>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-[#E5664B] hover:bg-orange-50 rounded-full transition-colors hidden sm:block">
                                <Heart size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-[#E5664B] hover:bg-orange-50 rounded-full transition-colors">
                                <ShoppingCart size={20} />
                            </button>
                        </div>

                        {/* User Avatar & Info */}
                        <div className="pl-2 sm:pl-4 flex items-center">
                            {user ? (
                                <div className="relative group cursor-pointer ml-2">
                                    {/* Nút Avatar */}
                                    <div className="flex items-center gap-3">
                                        <div className="hidden lg:block text-right">
                                            <p className="text-sm font-bold text-[#1F2937]">{user.name || user.fullName || "Giảng viên"}</p>
                                            <p className="text-xs text-gray-500">Học viên</p>
                                        </div>
                                                            
                                        {user.avatarUrl || user.avatar ? (
                                            <img
                                                src={user.avatarUrl || user.avatar}
                                                alt={user.name || user.fullName}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:shadow-lg group-hover:border-[#E5664B] transition-all object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white group-hover:shadow-lg group-hover:border-[#E5664B] transition-all">
                                                {getInitial(user.name || user.fullName)}
                                            </div>
                                        )}
                                    </div>
                        
                                    {/* Dropdown Menu của User (Hiển thị khi Hover) */}
                                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                                        {/* Lớp phủ an toàn để hover không bị ngắt quãng */}
                                        <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                                                            
                                        {/* Thông tin cá nhân */}
                                        <div className="p-4 border-b border-gray-100 bg-orange-50/50">
                                            <p className="font-bold text-gray-800 truncate">
                                                {user.name || user.fullName || "Giảng viên"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {user.email || "Chưa cập nhật email"}
                                            </p>
                                        </div>
                        
                                        {/* Các menu chức năng */}
                                        <div className="p-2">
                                            <Link
                                                to="/settings"
                                                state ={{tab: 'profile'}}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-medium"
                                            >
                                                Hồ sơ cá nhân
                                            </Link>
                                            <Link
                                                to="/settings"
                                                state={{ tab: 'security' }}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors font-medium"
                                            >
                                                Đổi mật khẩu
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold mt-1 cursor-pointer"
                                            >
                                                <LogOut size={16} />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5F7FA]">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default StudentLayout;
