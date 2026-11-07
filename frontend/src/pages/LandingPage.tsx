import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/LandingPage.css';
import '../index.css';
import Navbar from '../components/NavBar';
import Hero from '../components/Hero';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import FloatingContact from '../components/FloatingContact';
import ScrollReveal from '../components/ScrollReveal';
import CourseFinder from '../components/landing/CourseFinder';
import FeaturedCourses from '../components/landing/FeaturedCourses';
import LearningPaths from '../components/landing/LearningPaths';
import TeacherShowcase from '../components/landing/TeacherShowcase';

export default function LandingPage() {
  const location = useLocation();
  const [featuredCoursesSettled, setFeaturedCoursesSettled] = useState(false);
  const handleFeaturedCoursesSettled = useCallback(() => setFeaturedCoursesSettled(true), []);

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (!sectionId) return;
    if ((sectionId === 'learning-paths' || sectionId === 'teachers') && !featuredCoursesSettled) return;

    const section = document.getElementById(sectionId);
    const headingId = section?.getAttribute('aria-labelledby');
    if (!headingId) return;

    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [featuredCoursesSettled, location.hash]);

  return <div className="landing-page-wrapper">
    <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
    <Navbar />
    <main id="main-content">
      <Hero />
      <CourseFinder />
      <ScrollReveal><FeaturedCourses onSettled={handleFeaturedCoursesSettled} /></ScrollReveal>
      <ScrollReveal forceVisible={location.hash === '#learning-paths'}><LearningPaths /></ScrollReveal>
      <ScrollReveal forceVisible={location.hash === '#teachers'}><TeacherShowcase /></ScrollReveal>
      <ScrollReveal><CTA /></ScrollReveal>
    </main>
    <Footer />
    <FloatingContact />
  </div>;
}
