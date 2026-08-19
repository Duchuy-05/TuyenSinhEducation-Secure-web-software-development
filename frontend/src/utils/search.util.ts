import type { Course } from '../services/course.api';

export const removeVietnameseAccents = (str: string): string => {
    if (!str) return '';
    return str
        .normalize('NFD')                  // Tách chữ và dấu
        .replace(/[\u0300-\u036f]/g, '')   // Xóa các dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
};

const buildSearchableText = (course: Course): string => {
    const lecturerName = course.user?.fullName || course.teacher?.fullName || '';
    const priceStr = course.price?.toString() || '';
    const discountStr = course.discountPrice?.toString() || '';

    const rawText = `
        ${course.title || ''} 
        ${course.shortDesc || ''} 
        ${course.category || ''} 
        ${lecturerName} 
        ${priceStr} 
        ${discountStr}
    `;

    return removeVietnameseAccents(rawText);
};

/**
 * Kiểm tra 1 khóa học có khớp với từ khóa tìm kiếm không.
 */
export const matchesSearchQuery = (course: Course, query: string): boolean => {
    const normalizedQuery = removeVietnameseAccents(query);
    if (normalizedQuery === '') return true; 

    const searchableText = buildSearchableText(course);
    return searchableText.includes(normalizedQuery);
};

export const matchesCategory = (course: Course, selectedCategory: string): boolean => {
    return selectedCategory === 'all' || course.category === selectedCategory;
};

export const filterCourses = (
    courses: Course[],
    searchQuery: string,
    selectedCategory: string
): Course[] => {
    return courses.filter(course =>
        matchesSearchQuery(course, searchQuery) && matchesCategory(course, selectedCategory)
    );
};