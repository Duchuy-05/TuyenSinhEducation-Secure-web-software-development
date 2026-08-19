import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <a href="/" className="footer-logo">Đức Huy<span> Education</span></a>
                        <p>Hệ thống giáo dục trực tuyến chất lượng cao, mang kiến thức thực chiến đến mọi người.</p>
                    </div>
                    <div>
                        <h4>Khóa học</h4>
                        <ul>
                            <li><a href="#">Frontend ReactJS</a></li>
                            <li><a href="#">Backend NodeJS</a></li>
                            <li><a href="#">UI/UX Design</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Về chúng tôi</h4>
                        <ul>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Giảng viên</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Liên hệ</h4>
                        <ul>
                            <li>Hotline: 0926008221</li>
                            <li>Email: huyntd.23810310127@epu.edu.vn</li>
                            <li>Địa chỉ: Trần Cung, Phường Nghĩa Đô, Thành Phố Hà Nội</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 EduPro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;