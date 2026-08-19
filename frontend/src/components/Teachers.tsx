import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icon nút bấm
import { teacherApi } from '../services/teacher.api';
import type { Teacher } from '../services/teacher.api';

const Teachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State quản lý vị trí thanh trượt
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setIsLoading(true);
                const data = await teacherApi.getAllTeachers();
                setTeachers(data);
            } catch (err) {
                console.error("Lỗi khi tải danh sách giảng viên:", err);
                setError("Không thể tải dữ liệu giảng viên lúc này.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Logic nút bấm: Lướt sang phải 1 người
    const handleNext = () => {
        if (currentIndex < teachers.length - 3) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // Logic nút bấm: Lướt sang trái 1 người
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (isLoading) return <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>Đang tải danh sách giảng viên...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>{error}</div>;

    return (
        <section className="teachers">
            <div className="container">
                <h2 className="section-title">Đội Ngũ Giảng Viên</h2>
                <p className="section-subtitle">Học hỏi từ những chuyên gia hàng đầu trong ngành</p>

                <div className="slider-wrapper">
                    {/* Nút lùi (Ẩn nếu đang ở người đầu tiên) */}
                    <button
                        className="slider-btn prev-btn"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Khung hiển thị ẩn phần bị tràn */}
                    
                    <div className="slider-viewport">
                        {/* Thanh trượt dài chứa tất cả giảng viên */}
                        <div
                            className="slider-track"
                            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                        >
                            {teachers.map(teacher => (
                                <div className="slider-slide" key={teacher.id}>
                                    <div className="card">
                                        <img
                                            src={teacher.avatarUrl || "https://via.placeholder.com/150"}
                                            alt={teacher.fullName}
                                            className="card-avatar"
                                        />
                                        <h4>{teacher.fullName}</h4>
                                        <p className="role">{teacher.title} tại {teacher.company}</p>
                                        <p className="exp">Kinh nghiệm: {teacher.experience}</p>
                                        <p style={{ marginTop: '10px' }}>{teacher.bio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nút tới (Ẩn nếu đã lướt đến 3 người cuối cùng) */}
                    <button
                        className="slider-btn next-btn"
                        onClick={handleNext}
                        disabled={teachers.length <= 3 || currentIndex >= teachers.length - 3}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Teachers;
