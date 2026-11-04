// src/pages/LandingPage.tsx

import React from 'react';
import '../styles/LandingPage.css'; // Import file CSS đã thiết kế
import '../index.css';
import Navbar from '../components/NavBar';
import Hero from '../components/Hero';
import CourseAccordion from '../components/CourseAccordion';
import Teachers from '../components/Teachers';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import FloatingContact from '../components/FloatingContact';
import ScrollReveal from '../components/ScrollReveal';
import learningPathImage from '../assets/banner2.png';
import faqImage from '../assets/classroom-webp.webp';
import ctaImage from '../assets/hero.png';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page-wrapper">
            <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
            <Navbar />
            <main id="main-content">
                <Hero />
                <div id="courses" className="landing-section-anchor">
                    <ScrollReveal><CourseAccordion /></ScrollReveal>
                </div>
                <section id="learning-paths" className="foundation-section" aria-labelledby="learning-paths-title">
                    <div className="page-frame foundation-statement">
                        <div data-reveal-part>
                            <h2 id="learning-paths-title">Chọn lộ trình theo mục tiêu</h2>
                            <p>Các lộ trình chi tiết sẽ được xây từ danh mục khóa học đã xuất bản, không dùng cam kết chưa được xác minh.</p>
                        </div>
                        <img data-reveal-part className="foundation-image" src={learningPathImage} alt="Minh họa các ngôn ngữ lập trình trong lộ trình học" />
                    </div>
                </section>
                <div id="teachers" className="landing-section-anchor">
                    <ScrollReveal><Teachers /></ScrollReveal>
                </div>
                <section id="faq" className="foundation-section foundation-section-dark" aria-labelledby="faq-title">
                    <div className="page-frame foundation-statement">
                        <div data-reveal-part>
                            <h2 id="faq-title">Trước khi chọn khóa học</h2>
                            <p>Thông tin học phí, hình thức học và chính sách sẽ chỉ hiển thị sau khi được xác nhận.</p>
                        </div>
                        <img data-reveal-part className="foundation-image" src={faqImage} alt="Minh họa học viên thực hành công nghệ" />
                    </div>
                </section>
                <ScrollReveal><CTA /></ScrollReveal>
                <img className="cta-image" src={ctaImage} alt="" aria-hidden="true" />
            </main>
            <Footer />
            <FloatingContact />
        </div>
    );
};

export default LandingPage;
