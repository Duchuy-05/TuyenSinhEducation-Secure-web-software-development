import React from 'react';

const About: React.FC = () => {
    const stats = [
        { number: "10+", label: "Năm kinh nghiệm" },
        { number: "5000+", label: "Học viên" },
        { number: "100+", label: "Khóa học" },
        { number: "95%", label: "Học viên hài lòng" }
    ];

    return (
        <section className="about" id="about">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div className="stat-item" key={index}>
                            <h3>{stat.number}</h3>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;