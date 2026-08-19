import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, Search } from 'lucide-react';

import { Course } from '../../services/course.api';
import { CatalogNavbar } from './CatalogNavbar';
import { CatalogSidebar } from './CatalogSidebar';
import { CourseCard } from './CourseCard';
import { courseApi } from '../../services/course.api';
import Navbar from '../../components/NavBar';
import { formatPriceOrFree, formatVND } from '../../utils/format.util';
import { filterCourses } from '../../utils/search.util';
import FloatingContact from '../../components/FloatingContact';

const CourseCatalogPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isCategoryHovered, setIsCategoryHovered] = useState<boolean>(false);
    const [activeHoverCategory, setActiveHoverCategory] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const data = await courseApi.getAllCourses();
                const activeCourses = data.filter((c: any) => c.status === 'published');
                setCourses(activeCourses);
            } catch (err) {
                setError("Không thể tải danh sách khóa học thực tế.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const coursesByCategory = useMemo(() => {
        return courses.reduce((acc, course) => {
            const category = course.category || 'Khác';
            if (!acc[category]) acc[category] = [];
            acc[category].push(course);
            return acc;
        }, {} as Record<string, Course[]>);
    }, [courses]);

    const filteredCourses = filterCourses(courses, searchQuery, selectedCategory);

    return (
        <div className='wapper'>
            <Navbar />

            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
                <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 pointer-events-none ${isCategoryHovered ? 'opacity-100' : 'opacity-0'}`} />

                <CatalogNavbar
                    user={user}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleLogout={handleLogout}
                    coursesByCategory={coursesByCategory}
                    setSelectedCategory={setSelectedCategory}
                    isCategoryHovered={isCategoryHovered}
                    setIsCategoryHovered={setIsCategoryHovered}
                    activeHoverCategory={activeHoverCategory}
                    setActiveHoverCategory={setActiveHoverCategory}
                    onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* KHU VỰC THANH TÌM KIẾM Ở TRÊN CÙNG BÊN PHẢI */}

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <CatalogSidebar
                            coursesByCategory={coursesByCategory}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            setSearchQuery={setSearchQuery}
                            isOpenMobile={isMobileSidebarOpen}
                            onCloseMobile={() => setIsMobileSidebarOpen(false)}
                        />

                        <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 mb-6 pb-4 border-b border-gray-200/60">
                                <div className='w-100'>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-orange-600 tracking-tight">
                                        {selectedCategory === 'all' ? 'Tất Cả Chương Trình Học' : selectedCategory}
                                    </h1>
                                    <p className="text-xs text-gray-400 mt-0.5">Học tập bài bản, đột phá tư duy cùng Đức Huy Education.</p>

                                </div>
                                <div className="flex justify-end w-full mb-6">
                                    <div className="relative w-full sm:w-64 md:w-80">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Search className="w-4 h-4 text-gray-400" />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm khóa học..."
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e15f41] focus:border-transparent text-sm transition-all shadow-sm hover:border-gray-400 bg-white"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                                Kết quả: {isLoading ? '...' : filteredCourses.length} khóa học
                            </div>
                            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-medium">{error}</div>}

                            {isLoading ? (
                                <div className="py-24 flex flex-col items-center justify-center bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#e15f41] mb-3" />
                                    <h3 className="text-sm font-bold text-gray-700">Đang đồng bộ dữ liệu khóa học...</h3>
                                </div>
                            ) : filteredCourses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            formatVND={formatVND}
                                            formatPriceOrFree={formatPriceOrFree}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-sm mx-auto mt-12 shadow-sm">
                                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-800 text-base">Chưa có lớp học nào</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Hiện tại chưa có khóa học public nào thuộc danh mục này.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <FloatingContact />
        </div>

    );
};

export default CourseCatalogPage;