// src/pages/LandingPage.tsx

import React from 'react';
import '../styles/LandingPage.css'; // Import file CSS đã thiết kế
import '../index.css';
import Navbar from '../components/NavBar';
import Hero from '../components/Hero';
import About from '../components/About';
import CourseAccordion from '../components/CourseAccordion';
import Teachers from '../components/Teachers';
import WhyChooseUs from '../components/WhyChooseUs';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import FloatingContact from '../components/FloatingContact';
import ScrollReveal from '../components/ScrollReveal';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page-wrapper relative">
            <Navbar />
            <Hero />
            <ScrollReveal>
                <About />
            </ScrollReveal>
            <ScrollReveal>
                <CourseAccordion />
            </ScrollReveal>
            <ScrollReveal>
                <WhyChooseUs />
            </ScrollReveal>
            <ScrollReveal>
                <Teachers />
            </ScrollReveal>
            <ScrollReveal>
                <CTA />
            </ScrollReveal>
            <ScrollReveal>
                <Footer />
            </ScrollReveal>
            <FloatingContact />
        </div>
    );
};

export default LandingPage;
