import React, { useState } from 'react';
import { ChevronRight, ChevronDown, X, Layers } from 'lucide-react';
import { Course } from '../../services/course.api';

interface CatalogSidebarProps {
    coursesByCategory: Record<string, Course[]>;
    selectedCategory: string;
    setSelectedCategory: (catName: string) => void;
    setSearchQuery: (query: string) => void;
    isOpenMobile: boolean;           
    onCloseMobile: () => void;
}

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
    coursesByCategory,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    isOpenMobile,
    onCloseMobile
}) => {
    const [mobileExpandedCat, setMobileExpandedCat] = useState<{ [key: string]: boolean }>({});

    const toggleMobileSub = (category: string) => {
        setMobileExpandedCat(prev => ({ ...prev, [category]: !prev[category] }));
    };
    
    const handleCourseClick = (courseTitle: string) => {
        setSelectedCategory('all');
        setSearchQuery(courseTitle);
        onCloseMobile();
    };

    const SidebarContent = () => (
        <div className="bg-white lg:border lg:border-gray-200 lg:rounded-2xl p-4 lg:shadow-sm w-full">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2 flex justify-between items-center">
                <span>Bộ lọc chương trình học</span>
                <button onClick={onCloseMobile} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5 cursor-pointer" />
                </button>
            </div>
            
            <div className="space-y-1.5">
                {/* Nút Tất cả khóa học */}
                <button 
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); onCloseMobile(); }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        selectedCategory === 'all' 
                        ? 'bg-orange-50 border-[#e15f41] text-[#e15f41] shadow-sm' 
                        : 'bg-gray-50/50 border-gray-100 text-gray-700 hover:bg-gray-50/80'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${selectedCategory === 'all' ? 'bg-[#e15f41]' : 'bg-gray-400'}`} />
                        <span>Tất cả khóa học</span>
                    </div>
                </button>

                {Object.keys(coursesByCategory).map((category) => {
                    const isCurrentActive = selectedCategory === category;
                    const isMobileOpen = !!mobileExpandedCat[category];
                    const coursesInCategory = coursesByCategory[category];

                    return (
                        <div key={category} className="relative group">
                            
                            <div className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                                isCurrentActive 
                                ? 'bg-orange-50 border-[#e15f41] text-[#e15f41] shadow-sm' 
                                : 'bg-white border-gray-100 text-gray-700 hover:bg-orange-50/30 hover:border-gray-200'
                            }`}>
                                <div 
                                    onClick={() => { setSelectedCategory(category); setSearchQuery(''); onCloseMobile(); }} 
                                    className="flex items-center gap-2.5 flex-1 cursor-pointer select-none truncate"
                                >
                                    <Layers className={`w-4 h-4 ${isCurrentActive ? 'text-[#e15f41]' : 'text-gray-400'}`} />
                                    <span className="truncate">{category}</span>
                                </div>

                                {/* Nút bấm vuông mở rộng cấp 2 */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMobileSub(category);
                                    }}
                                    className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#e15f41] group-hover:border-[#e15f41] transition-all duration-200 ml-2 cursor-pointer"
                                >
                                    <ChevronRight className={`hidden lg:block w-3.5 h-3.5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-transform duration-200`} />
                                    <ChevronDown className={`lg:hidden w-3.5 h-3.5 text-gray-400 ${isMobileOpen ? 'text-[#e15f41] rotate-180' : ''} transition-transform`} />
                                </button>
                            </div>
                            <div className={`
                                lg:absolute lg:left-full lg:top-0 lg:ml-1.5 lg:w-64 lg:bg-white lg:border lg:border-gray-200 lg:rounded-2xl lg:shadow-xl lg:p-3 lg:z-40 lg:transform lg:scale-0 lg:group-hover:scale-100 lg:opacity-0 lg:group-hover:opacity-100 lg:origin-top-left lg:transition-all lg:duration-300
                                ${isMobileOpen ? 'block relative left-0 w-full p-2 bg-gray-50 border-x border-b border-gray-100 rounded-b-xl mt-0.5 space-y-1' : 'hidden lg:block'}
                            `}>
                                <div className="hidden lg:block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 pb-1 border-b border-gray-100">
                                    Khóa học trong danh mục
                                </div>
                                <div className="space-y-1">
                                    {coursesInCategory.map((course) => (
                                        <button
                                            key={course.id}
                                            onClick={() => handleCourseClick(course.title)}
                                            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-orange-50 hover:text-[#e15f41] transition-colors cursor-pointer"
                                        >
                                            {course.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 z-30">
                <SidebarContent />
            </div>

            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isOpenMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div onClick={onCloseMobile} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div className={`absolute top-0 left-0 w-72 h-full bg-white shadow-2xl p-4 overflow-y-auto transition-transform duration-300 transform ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};