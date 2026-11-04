import React from 'react';
import { landingContent } from '../content/landingContent';
import zaloIcon from '../assets/Icon_Zalo.webp';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <a href="/" className="footer-logo">Đức Huy<span> Education</span></a>
                        <p>Hệ thống giáo dục trực tuyến chất lượng cao, mang kiến thức thực chiến đến mọi người.</p>
                        <p className="footer-credit">Ảnh lớp học: <a href="https://commons.wikimedia.org/w/index.php?curid=146876242" target="_blank" rel="noopener noreferrer">“Digital carrel classroom”</a> của Wikideas1, <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en/" target="_blank" rel="noopener noreferrer">CC0</a>, Wikimedia Commons.</p>
                    </div>
                    <div>
                        <h4>Khóa học</h4>
                        <ul>
                            <li><a href="/danh-muc-khoa-hoc">Frontend ReactJS</a></li>
                            <li><a href="/danh-muc-khoa-hoc">Backend NodeJS</a></li>
                            <li><a href="/danh-muc-khoa-hoc">UI/UX Design</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Về chúng tôi</h4>
                        <ul>
                            <li><a href="/#learning-paths">Lộ trình học</a></li>
                            <li><a href="/#teachers">Giảng viên</a></li>
                            <li><a href="/lien-he">Liên hệ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Liên hệ</h4>
                        <ul>
                            <li><a href={`tel:${landingContent.contact.phone}`}>Hotline: {landingContent.contact.phone}</a></li>
                            <li><a href={`mailto:${landingContent.contact.email}`}>{landingContent.contact.email}</a></li>
                            <li>Địa chỉ: Trần Cung, Phường Nghĩa Đô, Thành Phố Hà Nội</li>
                            <li><a href="/lien-he" className="footer-contact-link"><img src={zaloIcon} alt="Zalo" /> Kênh tư vấn</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Đức Huy Education. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;