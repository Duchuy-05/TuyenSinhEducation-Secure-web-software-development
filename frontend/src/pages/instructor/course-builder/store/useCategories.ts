// file lọc danh mục khóa học từ DB
import { useEffect, useState } from 'react';
import { courseApi } from '../../../../services/course.api';

export const useCategories = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const courses = await courseApi.getAllCourses();
                const unique = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));
                setCategories(unique);
            } catch (error) {
                console.error('Lỗi khi tải danh sách danh mục:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { categories, isLoading };
};