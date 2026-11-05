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
import LearningExperience from '../components/landing/LearningExperience';
import TeacherShowcase from '../components/landing/TeacherShowcase';
import PurchaseFaq from '../components/landing/PurchaseFaq';

export default function LandingPage() {
  return <div className="landing-page-wrapper">
    <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
    <Navbar />
    <main id="main-content">
      <Hero />
      <CourseFinder />
      <ScrollReveal><FeaturedCourses /></ScrollReveal>
      <ScrollReveal><LearningPaths /></ScrollReveal>
      <ScrollReveal><LearningExperience /></ScrollReveal>
      <ScrollReveal><TeacherShowcase /></ScrollReveal>
      <PurchaseFaq />
      <ScrollReveal><CTA /></ScrollReveal>
    </main>
    <Footer />
    <FloatingContact />
  </div>;
}
