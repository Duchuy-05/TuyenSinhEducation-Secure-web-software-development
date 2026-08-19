import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, 
    FileText, 
    Download, 
    PlayCircle, 
    X, 
    CreditCard,
    CheckCircle,
    Clock,
    RotateCcw,
    XCircle,
    Headset
} from 'lucide-react';

// --- MOCK DATA ---
const mockOrders = [
    {
        id: "DH001",
        date: "25/06/2026",
        totalPrice: 799000,
        status: "Thành công", // Thành công, Đang xử lý, Hoàn tiền, Đã hủy
        paymentMethod: "VNPay",
        courses: [
            {
                id: "C001",
                title: "21 Ngày Thành Thạo Canva Thiết Kế Chuyên Nghiệp",
                thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
                price: 499000
            },
            {
                id: "C002",
                title: "Tư Duy Lập Trình Với Scratch Cho Trẻ Em",
                thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
                price: 300000
            }
        ]
    },
    {
        id: "DH002",
        date: "20/06/2026",
        totalPrice: 299000,
        status: "Thành công",
        paymentMethod: "Momo",
        courses: [
            {
                id: "C003",
                title: "Digital Marketing Toàn Diện Tăng Trưởng Doanh Số",
                thumbnail: "https://images.unsplash.com/photo-1432888117426-1d5ac087068b?auto=format&fit=crop&q=80&w=800",
                price: 299000
            }
        ]
    },
    {
        id: "DH003",
        date: "26/06/2026",
        totalPrice: 599000,
        status: "Đang xử lý",
        paymentMethod: "Chuyển khoản Ngân hàng",
        courses: [
            {
                id: "C004",
                title: "Ứng Dụng AI Trong Xử Lý Công Việc Hàng Ngày",
                thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
                price: 599000
            }
        ]
    },
    {
        id: "DH004",
        date: "10/05/2026",
        totalPrice: 1500000,
        status: "Hoàn tiền",
        paymentMethod: "Thẻ Tín dụng",
        courses: [
            {
                id: "C005",
                title: "Khởi Nghiệp Kinh Doanh Online Từ Số 0",
                thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
                price: 1500000
            }
        ]
    }
];

const filterTabs = ['Tất cả', 'Thành công', 'Đang xử lý', 'Hoàn tiền', 'Đã hủy'];

const StudentOrdersCourses: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

    // Filter logic
    const filteredOrders = mockOrders.filter(order => {
        const matchesStatus = activeFilter === 'Tất cả' || order.status === activeFilter;
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            order.courses.some(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesStatus && matchesSearch;
    });

    // Trả về UI Badge tùy theo trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Thành công':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200"><CheckCircle size={14} /> Thành công</span>;
            case 'Đang xử lý':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200"><Clock size={14} /> Đang xử lý</span>;
            case 'Hoàn tiền':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200"><RotateCcw size={14} /> Hoàn tiền</span>;
            case 'Đã hủy':
                return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200"><XCircle size={14} /> Đã hủy</span>;
            default:
                return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">{status}</span>;
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 bg-[#F5F7FA] min-h-screen">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Lịch sử đơn hàng</h1>
                <p className="text-gray-500 mt-2 text-sm lg:text-base">Quản lý các khóa học bạn đã thanh toán và theo dõi trạng thái đơn hàng.</p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                
                {/* Tabs Filter */}
                <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                    {filterTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                activeFilter === tab 
                                    ? 'bg-[#E5664B] text-white shadow-md' 
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full xl:w-80 group">
                    <input
                        type="text"
                        placeholder="Mã đơn hàng hoặc Tên khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-[#E5E7EB] rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all"
                    />
                    <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E5664B] transition-colors" />
                </div>
            </div>

            {/* Order List Grid */}
            {filteredOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            
                            {/* Card Header */}
                            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">Đơn hàng {order.id}</h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{order.date}</p>
                                </div>
                                <div>
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>

                            {/* Card Body - Course List */}
                            <div className="p-5 flex-1 space-y-4">
                                {order.courses.map(course => (
                                    <div key={course.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-gray-800 truncate">{course.title}</h4>
                                        </div>
                                        <div className="flex-shrink-0 text-sm font-bold text-gray-600">
                                            {course.price.toLocaleString('vi-VN')}đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Card Footer */}
                            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <span className="text-sm text-gray-500 mr-2">Tổng tiền:</span>
                                    <span className="text-lg font-bold text-[#E5664B]">{order.totalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FileText size={16} /> Chi tiết
                                    </button>
                                    {order.status === 'Thành công' && (
                                        <Link 
                                            to={`/my-courses/${order.courses[0].id}`}
                                            className="flex-1 sm:flex-none px-4 py-2 bg-[#E5664B] hover:bg-[#d6553a] text-white rounded-xl font-medium text-sm transition-all hover:shadow-[0_4px_12px_rgba(229,102,75,0.3)] flex items-center justify-center gap-2"
                                        >
                                            <PlayCircle size={16} /> Vào học
                                        </Link>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 mb-6 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                        <Search size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng nào</h3>
                    <p className="text-gray-500 max-w-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái để xem kết quả khác.</p>
                </div>
            )}

            {/* Modal Chi Tiết Đơn Hàng */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div 
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng {selectedOrder.id}</h2>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            
                            {/* Thông tin thanh toán chung */}
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                                        <p className="font-bold text-gray-800">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Ngày mua</p>
                                        <p className="font-bold text-gray-800">{selectedOrder.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phương thức thanh toán</p>
                                        <p className="font-bold text-gray-800 flex items-center gap-2">
                                            <CreditCard size={16} className="text-[#E5664B]" /> 
                                            {selectedOrder.paymentMethod}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                                        <div className="inline-block mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách khóa học */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Sản phẩm đã đặt</h3>
                                <div className="space-y-4">
                                    {selectedOrder.courses.map(course => (
                                        <div key={course.id} className="flex gap-4">
                                            <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 line-clamp-2 leading-tight">{course.title}</h4>
                                                <p className="text-sm text-gray-500 mt-1">Sở hữu trọn đời</p>
                                            </div>
                                            <div className="font-bold text-gray-800 whitespace-nowrap">
                                                {course.price.toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tổng cộng */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span className="font-medium">{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Khuyến mãi:</span>
                                    <span className="font-medium text-emerald-600">- 0đ</span>
                                </div>
                                <div className="flex justify-between text-gray-800 text-lg pt-2 border-t border-gray-100 border-dashed mt-2">
                                    <span className="font-bold">Tổng thanh toán:</span>
                                    <span className="font-bold text-[#E5664B] text-2xl">{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-4 rounded-b-3xl">
                            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors">
                                <Headset size={18} /> Hỗ trợ đơn hàng
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-black text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg">
                                <Download size={18} /> Tải hóa đơn (PDF)
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentOrdersCourses;
