import React from 'react';

const CTA: React.FC = () => {
    return (
        <section className="cta-banner">
            <div className="container">
                <h2>Đăng Ký Ngay Để Bắt Đầu Hành Trình Học Tập</h2>
                <div className="btn-group">
                    <button className="btn btn-outline" style={{ backgroundColor: '#fff', color: 'var(--primary-color)' }}>Đăng ký học</button>
                    <button className="btn btn-outline">Liên hệ tư vấn</button>
                </div>
            </div>
        </section>
    );
};

export default CTA;