import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { mockScratchCourse as course } from '../data/mockScratchCourse';
import { Clock, MonitorPlay, CheckCircle, ArrowRight, Play, Star } from 'lucide-react';

const ScratchCoursePage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            {/* HERO SECTION (Kids-Centric) - Vibrant & Playful */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-300">
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-20 w-32 h-32 bg-orange-600 opacity-20 rounded-full blur-2xl"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left text-white">
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white text-orange-600 font-bold text-sm tracking-wide shadow-md transform hover:scale-105 transition-transform cursor-default">
                                🎯 Dành cho {course.target}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg" style={{ fontFamily: "'Nunito', sans-serif" }}>
                                {course.title}
                            </h1>
                            <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-md">
                                {course.shortDesc}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="px-8 py-4 bg-white text-orange-500 rounded-full font-bold text-lg shadow-xl hover:bg-orange-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                                    Đăng Ký Học Ngay <ArrowRight size={20} />
                                </button>
                                <button className="px-8 py-4 bg-orange-600 bg-opacity-30 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-orange-500 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Play size={20} /> Xem Video Demo
                                </button>
                            </div>
                        </div>

                        {/* Image/Visuals */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-none relative group">
                            <div className="absolute inset-0 bg-white rounded-3xl rotate-3 transform group-hover:rotate-6 transition-transform duration-500 opacity-50 shadow-2xl"></div>
                            <img 
                                src={course.imageUrl} 
                                alt={course.title} 
                                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-white transform group-hover:-translate-y-2 transition-transform duration-500 object-cover"
                            />
                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                    <Star className="text-yellow-500" fill="currentColor" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Học mà chơi</p>
                                    <p className="text-xs text-gray-500">Phát triển tư duy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT và SIDEBAR (Parent-Centric) - Clean và Trustworthy */}
            <section className="py-20 bg-gray-50 flex-grow">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-10">
                        
                        {/* Left Column: Syllabus & Teacher */}
                        <div className="flex-grow lg:w-2/3 space-y-10">
                            
                            {/* Value Proposition */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" /> Bé sẽ đạt được gì?
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Tư duy logic & giải quyết vấn đề', 'Sáng tạo câu chuyện & trò chơi', 'Kỹ năng làm việc nhóm & thuyết trình', 'Sử dụng máy tính an toàn, hữu ích'].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="mt-1 bg-green-100 rounded-full p-1"><CheckCircle size={14} className="text-green-600" /></div>
                                            <span className="text-gray-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Syllabus */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Nội dung chương trình học</h2>
                                <div className="space-y-6">
                                    {course.syllabus.sort((a, b) => a.orderIndex - b.orderIndex).map((item) => (
                                        <div key={item.id} className="group flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center border-2 border-orange-200 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                    {item.orderIndex}
                                                </div>
                                                <div className="w-0.5 h-full bg-orange-100 mt-2"></div>
                                            </div>
                                            <div className="pb-6">
                                                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                                                <p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Teacher Info */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Giảng viên hướng dẫn</h2>
                                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <img 
                                        src={course.teacher.avatarUrl} 
                                        alt={course.teacher.fullName} 
                                        className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white"
                                    />
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl font-bold text-gray-900">{course.teacher.fullName}</h3>
                                        <p className="text-blue-600 font-medium">{course.teacher.title} tại {course.teacher.company}</p>
                                        <p className="text-gray-500 text-sm mt-1">{course.teacher.experience}</p>
                                        <p className="text-gray-700 mt-3 italic">"{course.teacher.bio}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Registration Sticky Sidebar */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28">
                                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Học phí ưu đãi</p>
                                    <h3 className="text-3xl font-extrabold text-orange-600">{course.price}</h3>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="bg-orange-50 p-2 rounded-lg text-orange-500"><Clock size={20} /></div>
                                        <div>
                                            <p className="text-xs text-gray-500">Thời lượng</p>
                                            <p className="font-semibold">{course.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="bg-orange-50 p-2 rounded-lg text-orange-500"><MonitorPlay size={20} /></div>
                                        <div>
                                            <p className="text-xs text-gray-500">Hình thức học</p>
                                            <p className="font-semibold">{course.format}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-800 mb-4 text-center">Đăng ký tư vấn miễn phí</h4>
                                    <form className="space-y-4">
                                        <div>
                                            <input type="text" placeholder="Họ tên phụ huynh" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
                                        </div>
                                        <div>
                                            <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
                                        </div>
                                        <div>
                                            <input type="number" placeholder="Tuổi của bé" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
                                        </div>
                                        <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                            Nhận Tư Vấn Ngay
                                        </button>
                                    </form>
                                    <p className="text-center text-xs text-gray-500 mt-4">
                                        Hoặc gọi Hotline: <strong className="text-orange-600 text-sm">1900 5555</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ScratchCoursePage;
