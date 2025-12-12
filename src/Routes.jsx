import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import GiftButton from "components/GiftButton";
import NotFound from "pages/NotFound";
import RSVP from './pages/rsvp';
import RSVPAdmin from './pages/rsvp/admin';
import WeddingDetails from './pages/wedding-details';
import OurStory from './pages/our-story';
import Homepage from './pages/homepage';
import GuestBook from './pages/guest-book';
import GuestBookAdmin from './pages/guest-book/admin';

const Routes = () => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
    setLanguage(savedLanguage);

    // Listen for changes from other pages
    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('preferredLanguage') || 'es';
      setLanguage(newLanguage);
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <GiftButton language={language} />
        <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/rsvp-admin" element={<RSVPAdmin />} />
        <Route path="/wedding-details" element={<WeddingDetails />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/guest-book" element={<GuestBook />} />
        <Route path="/guest-book-admin" element={<GuestBookAdmin />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
