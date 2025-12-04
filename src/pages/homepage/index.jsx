import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import HeroSection from './components/HeroSection';
import WeddingDetailsPreview from './components/WeddingDetailsPreview';
import RSVPCounter from './components/RSVPCounter';
import QuickLinks from './components/QuickLinks';
import Footer from '../our-story/components/Footer';
import LanguageToggle from './components/LanguageToggle';

const Homepage = () => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />
      
      <main className="main-content">
        <HeroSection language={language} />
        <RSVPCounter language={language} />
        <WeddingDetailsPreview language={language} />
        <QuickLinks language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
};

export default Homepage;