import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Mail, Phone, Calendar, Search, X } from 'lucide-react';
import { registrationApi } from '../../services/registration.api';
import type { Registration } from '../../services/registration.api';

const StatusModal: React.FC<{
    registration: Registration;
    onClose: () => void;
    onSave: (id: number, status: string) => Promise<void>;
}> = ({ registration, onClose, onSave }) => {
    const [selectedStatus, setSelectedStatus] = useState(registration.status);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        await onSave(registration.id, selectedStatus);
        setLoading(false);
        onClose();
    };

    const statusOptions = [
        { value: 'pending',   label: 'Chờ xử lý',  color: 'bg-amber-100 text-amber-800' },
        { value: 'contacted', label: 'Đã tư vấn',  color: 'bg-blue-100 text-blue-800' },
        { value: 'confirmed', label: 'Đã chốt',    color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'Đã hủy',     color: 'bg-slate-100 text-slate-700' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Cập nhật trạng thái</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                {/* Thông tin đơn */}
                <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-700">
                    <div className="font-medium">{registration.contactName}</div>
                    <div className="text-slate-500">{registration.course.title}</div>
                </div>

                {/* Chọn trạng thái */}
                <div className="flex flex-col gap-2 mb-6">
                    {statusOptions.map((opt) => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                selectedStatus === opt.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <input
                                type="radio"
                                name="status"
                                value={opt.value}
                                checked={selectedStatus === opt.value}
                                onChange={() => setSelectedStatus(opt.value)}
                                className="hidden"
                            />
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${opt.color}`}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || selectedStatus === registration.status}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminRegistrations: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [editingReg, setEditingReg] = useState<Registration | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;

    useEffect(() => {
        fetchRegistrations(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchRegistrations(1, selectedStatus);
    }, [selectedStatus]);

    const fetchRegistrations = async (page: number, status: string = 'all') => {
        setIsLoading(true);
        try {
            const result = await registrationApi.getAllRegistrations(page, LIMIT, status);
            setRegistrations(result.data);
            setTotalPages(result.totalPages);
            setTotal(result.total);
        } catch (error) {
            console.error('Lỗi API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await registrationApi.updateRegistrationStatus(id, status);
            setRegistrations(prev =>
                prev.map(r => r.id === id ? { ...r, status } : r)
            );
        } catch (error) {
            alert('Cập nhật thất bại!');
        }
    };

    // Hàm phụ trợ: Format ngày tháng
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Hàm phụ trợ: Hiển thị trạng thái
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Chờ xử lý</span>;
            case 'contacted':
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Đã tư vấn</span>;
            case 'confirmed':
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Đã chốt</span>;
            default:
                return <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Đã hủy</span>;
        }
    };

    return (
        <div>
            {editingReg && (
                <StatusModal
                    registration={editingReg}
                    onClose={() => setEditingReg(null)}
                    onSave={handleUpdateStatus}
                />
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Quản lý Đơn đăng ký & Liên hệ</h2>

                {/* Bộ lọc / Tìm kiếm */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Tìm tên, SĐT..." className="w-full md:w-48 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ padding: '8px 16px', border: '1px solid var(--admin-border)', borderRadius: '6px', outline: 'none' }}
                    >
                    {/* </select><select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"> */}
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="contacted">Đã tư vấn</option>
                        <option value="confirmed">Đã chốt</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thông tin khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Khóa học quan tâm</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày đăng ký</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
                        ) : registrations.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Chưa có đơn đăng ký nào.</td></tr>
                        ) : (
                            registrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">#{reg.id}</td>

                                    {/* Cột thông tin khách hàng */}
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900 mb-1">
                                            {reg.contactName}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone size={14} /> {reg.contactPhone}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                            <Mail size={14} /> {reg.contactEmail}
                                        </div>
                                    </td>

                                    {/* Cột thông tin Khóa học */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-blue-600">
                                            {reg.course.title}
                                        </div>
                                        {reg.note && (
                                            <div className="text-sm text-slate-500 mt-1 italic">
                                                " {reg.note} "
                                            </div>
                                        )}
                                    </td>

                                    {/* Cột thời gian */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700 text-sm">
                                            <Calendar size={16} /> {formatDate(reg.registeredAt)}
                                        </div>
                                    </td>

                                    {/* Cột Trạng thái */}
                                    <td className="px-6 py-4">
                                        {renderStatusBadge(reg.status)}
                                    </td>

                                    {/* Cột thao tác */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors" title="Cập nhật trạng thái" onClick={() => setEditingReg(reg)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors" title="Xóa đơn" >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <span className="text-sm text-slate-600">
                        Tổng {total} đơn đăng ký
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Tiếp →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
