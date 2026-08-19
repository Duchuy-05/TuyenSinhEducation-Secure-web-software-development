import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import banner2 from '../assets/banner2.png';
import banner1 from '../assets/banner1.png'; 
// import banner3 from '../assets/banner3.webp';

const banners = [banner2, banner1, banner2];

const Hero: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    return (
        <section className="hero-section" id="home">
            <div className="hero-container">

                {/* Khung chạy ảnh định danh riêng */}
                <div
                    className="hero-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div className="hero-slide-item" key={index}>
                            <img src={banner} alt={`Banner ${index + 1}`} />
                        </div>
                    ))}
                </div>

                {/* Đổi tên class nút bấm để không trùng với nút của Giảng viên */}
                <button className="hero-ctrl-btn hero-ctrl-prev" onClick={prevSlide}>
                    <ChevronLeft size={32} />
                </button>
                <button className="hero-ctrl-btn hero-ctrl-next" onClick={nextSlide}>
                    <ChevronRight size={32} />
                </button>

                {/* Đổi tên chỉ báo dots */}
                <div className="hero-indicator-dots">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-dot-item ${currentIndex === index ? 'is-active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        ></button>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Hero;