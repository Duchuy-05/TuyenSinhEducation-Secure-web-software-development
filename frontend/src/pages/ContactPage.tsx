// src/pages/ContactPage.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';
import { registrationApi } from '../services/registration.api';
import type { RegistrationForm } from '../services/registration.api';
import FloatingContact from '../components/FloatingContact';

const ContactPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<RegistrationForm>({
        courseId: 0,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        note: '',
    });

    // Tự động cuộn lên đầu khi vào trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn trang bị reload

        if (!formData.contactName || !formData.contactPhone || !formData.note) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            setIsLoading(true);
            await registrationApi.registerForCourse(formData);
            alert('Đăng ký / Gửi liên hệ thành công!');

            // Reset form về trạng thái ban đầu
            setFormData({
                courseId: 0,
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                note: '',
            });
        } catch (error) {
            console.error('Lỗi gửi liên hệ:', error);
            alert('Gửi thông tin thất bại, vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Banner Liên hệ */}
            <section className="course-banner" style={{ background: 'var(--primary-color)', color: 'white', paddingTop: '150px', paddingBottom: '60px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', margin: '20px 0' }}>Liên hệ với EduPro</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
                        Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về các khóa học lập trình.
                    </p>
                </div>
            </section>

            {/* Nội dung chính: Form + Map */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-grid">

                        {/* Cột trái: Form để lại thông tin */}
                        <div className="contact-form-card">
                            <h2 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Gửi tin nhắn cho chúng tôi</h2>
                            <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Vui lòng điền đầy đủ thông tin, bộ phận tư vấn sẽ liên hệ lại với bạn trong vòng 24h.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Họ và tên *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        placeholder="Nhập họ và tên của bạn"
                                        required
                                    />
                                </div>

                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label>Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                            placeholder="09xx xxx xxx"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email liên hệ</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Nội dung cần tư vấn *</label>
                                    <textarea
                                        className="form-control"
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        rows={4}
                                        placeholder="Nhập nội dung câu hỏi của bạn..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontSize: '1.1rem', padding: '15px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                >
                                    {isLoading ? 'Đang gửi...' : 'Gửi thông tin liên hệ'}
                                </button>
                            </form>
                        </div>

                        {/* Cột phải: Thông tin & Google Map */}
                        <div className="contact-info-card">
                            <div className="info-blocks">
                                <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Thông tin liên hệ</h2>

                                <div className="info-item">
                                    <strong><MapPin size={13} /> Trụ sở chính (Học Offline):</strong>
                                    <p>Trần Cung, Phường Nghĩa Đô, Thành Phố Hà Nội</p>
                                </div>
                                <div className="info-item">
                                    <strong><Phone size={13} /> Hotline hỗ trợ:</strong>
                                    <p className="highlight-text">1900 5555 - 0926008221</p>
                                </div>
                                <div className="info-item">
                                    <strong><Mail size={13} /> Email:</strong>
                                    <p>huyntd.23810310127@epu.edu.vn</p>
                                </div>
                            </div>

                            {/* Google Map Iframe */}
                            <div className="map-container" style={{ marginTop: '30px' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.4748889995567!2d105.78528277529578!3d21.053686986921914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab2c40059cf1%3A0xb2c2e80f517b0b36!2zxJAuIFRy4bqnbiBDdW5nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2sus!4v1787110347083!5m2!1svi!2sus"
                                    width="100%"
                                    height="350"
                                    style={{ border: 0, borderRadius: 'var(--radius)' }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Bản đồ vị trí học Offline"
                                ></iframe>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
            <FloatingContact />
        </div>
    );
};

export default ContactPage;