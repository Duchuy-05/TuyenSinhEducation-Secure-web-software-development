import React from 'react';

const WhyChooseUs: React.FC = () => {
    const reasons = [
        { title: "Giáo trình thực tế", desc: "Cập nhật liên tục theo nhu cầu tuyển dụng của doanh nghiệp." },
        { title: "Mentor 1-1", desc: "Hỗ trợ giải đáp thắc mắc và review code 1 kèm 1." },
        { title: "Hỗ trợ việc làm", desc: "Cam kết giới thiệu việc làm sau khi hoàn thành khóa học." },
        { title: "Học trọn đời", desc: "Truy cập tài liệu và video bài giảng mãi mãi." }
    ];

    return (
        <section className="why-us">
            <div className="container">
                <h2 className="section-title">Tại Sao Chọn Chúng Tôi</h2>
                <p className="section-subtitle">Môi trường học tập lý tưởng dành cho bạn</p>
                <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    {reasons.map((item, idx) => (
                        <div className="card" key={idx}>
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;