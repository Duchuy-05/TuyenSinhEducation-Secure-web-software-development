import React from 'react';
import { Users, GraduationCap, DollarSign, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tổng quan hệ thống</h2>

            {/* 4 Thẻ Thống Kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm text-slate-600 font-medium">Tổng Học Viên</h4>
                        <div className="text-2xl font-bold text-slate-900">1,248</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm text-slate-600 font-medium">Khóa Học Đang Mở</h4>
                        <div className="text-2xl font-bold text-slate-900">12</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm text-slate-600 font-medium">Doanh Thu Tháng Này</h4>
                        <div className="text-2xl font-bold text-slate-900">145M</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm text-slate-600 font-medium">Đơn Đăng Ký Chờ Xử Lý</h4>
                        <div className="text-2xl font-bold text-slate-900">8</div>
                    </div>
                </div>
            </div>

            {/* Bảng Dữ Liệu: Đơn đăng ký mới nhất */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900">Đơn Đăng Ký Mới Nhất</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Xem tất cả
                    </button>
                </div>

                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Họ và Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Khóa học quan tâm</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-600">#1042</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">Nguyễn Văn A</td>
                            <td className="px-6 py-4 text-sm text-slate-700">0901234567</td>
                            <td className="px-6 py-4 text-sm text-slate-700">Sáng Tạo Web HTML/CSS/JS</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Chờ tư vấn</span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Chi tiết</a>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-600">#1041</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">Trần Thị B</td>
                            <td className="px-6 py-4 text-sm text-slate-700">0987654321</td>
                            <td className="px-6 py-4 text-sm text-slate-700">Tư Duy Lập Trình Với Scratch</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Đã thanh toán</span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Chi tiết</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
