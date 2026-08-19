import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowLeft, UploadCloud, Calendar, Clock, MapPin, 
    Link as LinkIcon, CheckCircle2, ChevronRight, Check, X
} from 'lucide-react';

const InstructorCreateClassPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        className: '',
        course: '',
        classCode: 'CANVA-K35', // Auto generated mock
        status: 'Sắp khai giảng',
        description: '',
        startDate: '',
        endDate: '',
        days: [] as string[],
        startTime: '19:00',
        endTime: '21:00',
        meetingType: 'Online',
        location: '',
        maxStudents: 50,
        deadline: '',
        waitingList: false,
        assistants: [] as string[],
        banner: null as string | null
    });

    const handleCreate = () => {
        setIsSuccess(true);
    };

    const steps = [
        { id: 1, name: 'Thông tin cơ bản' },
        { id: 2, name: 'Lịch học' },
        { id: 3, name: 'Học viên' },
        { id: 4, name: 'Xác nhận' }
    ];

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-10 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Tạo lớp học thành công!</h2>
                    <p className="text-gray-500 mb-8">Lớp học "{formData.className || 'Mới'}" đã được tạo và sẵn sàng để quản lý.</p>
                    <div className="space-y-3">
                        <Link to="/my-class" className="block w-full bg-[#E5664B] hover:bg-[#d6553a] text-white font-medium py-3 px-4 rounded-xl transition-all">
                            Đi tới quản lý lớp
                        </Link>
                        <button 
                            onClick={() => {
                                setIsSuccess(false);
                                setCurrentStep(1);
                                setFormData({...formData, className: '', description: ''});
                            }}
                            className="block w-full bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all"
                        >
                            Tạo lớp khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Tạo lớp học mới</h1>
                    <p className="text-gray-500 mt-2 text-sm lg:text-base">Thiết lập thông tin lớp học, lịch học và quản lý học viên.</p>
                </div>
                <Link to="/my-class" className="flex items-center gap-2 text-gray-500 hover:text-[#1F2937] font-medium transition-colors bg-white px-4 py-2 rounded-lg border border-[#E5E7EB] w-fit">
                    <ArrowLeft size={18} /> Quay lại danh sách lớp
                </Link>
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E7EB] overflow-x-auto">
                <div className="flex items-center min-w-max px-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                                    ${currentStep === step.id ? 'bg-[#E5664B] text-white ring-4 ring-orange-50' : 
                                      currentStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    {currentStep > step.id ? <Check size={16} /> : step.id}
                                </div>
                                <span className={`font-medium ${currentStep === step.id ? 'text-[#1F2937]' : currentStep > step.id ? 'text-gray-700' : 'text-gray-400'}`}>
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-12 md:w-24 h-px bg-gray-200 mx-4"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left: Form Sections */}
                <div className="flex-1 w-full space-y-6">
                    
                    {/* Section 1: Thông tin cơ bản */}
                    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-gray-50/50">
                            <h2 className="text-lg font-bold text-[#1F2937]">Thông tin lớp học</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên lớp học <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="Ví dụ: Canva K35" 
                                        className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] focus:ring-1 focus:ring-[#E5664B] transition-all"
                                        value={formData.className}
                                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Khóa học <span className="text-red-500">*</span></label>
                                    <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] focus:ring-1 focus:ring-[#E5664B] transition-all bg-white appearance-none">
                                        <option value="">Chọn khóa học</option>
                                        <option value="react">ReactJS Tốc Chiến</option>
                                        <option value="canva">21 Ngày Thành Thạo Canva</option>
                                        <option value="uiux">UI/UX Design Cơ Bản</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã lớp học (Tự động)</label>
                                    <input 
                                        type="text" 
                                        value={formData.classCode}
                                        readOnly
                                        className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                                    <div className="flex gap-4">
                                        {['Sắp khai giảng', 'Đang tuyển sinh', 'Đang học'].map(status => (
                                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="status" 
                                                    value={status}
                                                    checked={formData.status === status}
                                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                    className="w-4 h-4 text-[#E5664B] border-gray-300 focus:ring-[#E5664B]" 
                                                />
                                                <span className="text-sm text-gray-700">{status}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả lớp học</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Nhập mô tả chi tiết cho lớp học này..."
                                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] focus:ring-1 focus:ring-[#E5664B] transition-all resize-y"
                                ></textarea>
                            </div>

                            {/* Section 5: Banner (Moved here for flow) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa lớp học</label>
                                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="text-[#E5664B]" size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Kéo thả ảnh vào đây hoặc click để tải lên</p>
                                    <p className="text-xs text-gray-400">Hỗ trợ: JPG, PNG, WEBP. Kích thước khuyên dùng: 1920x1080px</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Lịch học */}
                    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-gray-50/50">
                            <h2 className="text-lg font-bold text-[#1F2937]">Lịch học & Địa điểm</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày khai giảng</label>
                                    <div className="relative">
                                        <input type="date" className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày bế giảng (Dự kiến)</label>
                                    <input type="date" className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2.5">Ngày học trong tuần</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(day => (
                                        <label key={day} className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" className="w-4 h-4 text-[#E5664B] rounded border-gray-300 focus:ring-[#E5664B]" />
                                            <span className="text-sm font-medium text-gray-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời gian học (Giờ)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="time" defaultValue="19:00" className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] transition-all" />
                                        <span className="text-gray-400">-</span>
                                        <input type="time" defaultValue="21:00" className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2.5">Hình thức học</label>
                                    <div className="flex gap-4">
                                        {['Online', 'Offline', 'Hybrid'].map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="meetingType" 
                                                    value={type}
                                                    checked={formData.meetingType === type}
                                                    onChange={(e) => setFormData({...formData, meetingType: e.target.value})}
                                                    className="w-4 h-4 text-[#E5664B] border-gray-300 focus:ring-[#E5664B]" 
                                                />
                                                <span className="text-sm text-gray-700">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {formData.meetingType === 'Offline' ? 'Địa chỉ lớp học' : 'Link phòng học (Zoom/Meet)'}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder={formData.meetingType === 'Offline' ? 'Nhập địa chỉ...' : 'https://zoom.us/j/123456789'}
                                        className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] transition-all"
                                    />
                                    {formData.meetingType === 'Offline' ? (
                                        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    ) : (
                                        <LinkIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Học viên */}
                    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-gray-50/50">
                            <h2 className="text-lg font-bold text-[#1F2937]">Quản lý học viên</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sĩ số tối đa</label>
                                    <input type="number" defaultValue={50} className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Hạn chót đăng ký</label>
                                    <input type="date" className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B]" />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold text-[#1F2937]">Danh sách chờ (Waiting List)</h4>
                                    <p className="text-xs text-gray-500 mt-1">Cho phép học viên đăng ký vào danh sách chờ khi lớp đã đầy.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.waitingList} onChange={() => setFormData({...formData, waitingList: !formData.waitingList})} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5664B]"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Trợ giảng */}
                    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-gray-50/50">
                            <h2 className="text-lg font-bold text-[#1F2937]">Trợ giảng</h2>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trợ giảng hỗ trợ lớp</label>
                            <div className="relative">
                                <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#E5664B] transition-all bg-white appearance-none text-gray-400">
                                    <option value="">Chọn trợ giảng...</option>
                                    <option value="1">Trần Anh Tú</option>
                                    <option value="2">Nguyễn Mai Hoa</option>
                                </select>
                            </div>
                            {/* Dummy Tags for visual */}
                            <div className="flex gap-2 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#E5664B] text-sm font-medium border border-orange-100">
                                    Trần Anh Tú
                                    <button className="text-[#E5664B] hover:text-red-500"><X size={14} /></button>
                                </span>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right: Summary Preview Card (Sticky) */}
                <div className="w-full lg:w-[320px] lg:sticky lg:top-24 flex-shrink-0 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#E5E7EB] bg-gray-50/50">
                            <h2 className="text-base font-bold text-[#1F2937]">Tổng quan lớp học (Preview)</h2>
                        </div>
                        
                        {/* Preview Content */}
                        <div>
                            {/* Dummy Banner */}
                            <div className="aspect-video bg-gray-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col">
                                    <UploadCloud size={32} className="mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Chưa có ảnh bìa</span>
                                </div>
                            </div>
                            
                            <div className="p-5 space-y-4">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-[#1F2937] text-lg leading-snug">
                                            {formData.className || 'Tên lớp học...'}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500">{formData.course || 'Chưa chọn khóa học'}</p>
                                </div>

                                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-[#E5664B]" />
                                        <span>Chưa có lịch</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} className="text-[#E5664B]" />
                                        <span>{formData.startTime} - {formData.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-[#E5664B]" />
                                        <span>{formData.meetingType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Action Buttons (Floating on Mobile) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] lg:static lg:bg-transparent lg:border-none lg:p-0 z-50">
                        <div className="flex gap-3 max-w-7xl mx-auto">
                            <button className="flex-1 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all shadow-sm">
                                Lưu nháp
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="flex-[2] bg-[#E5664B] hover:bg-[#d6553a] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Tạo lớp học
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstructorCreateClassPage;
