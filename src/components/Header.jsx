import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { path: '/homepage', label: 'Home' },
    { path: '/our-story', label: 'Our Story' },
    { path: '/wedding-details', label: 'Wedding Details' },
    { path: '/photo-gallery', label: 'Gallery' },
    { path: '/guest-book', label: 'Guest Book' },
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <Link to="/homepage" className="header-logo-container">
              <div className="header-logo">
                <Icon name="Heart" size={24} color="var(--color-primary)" />
              </div>
              <span className="header-brand-text">Eternal Vows</span>
            </Link>

            <nav className="header-nav">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`header-nav-link ${isActivePath(item?.path) ? 'active' : ''}`}
                >
                  {item?.label}
                </Link>
              ))}
            </nav>

            <Link to="/rsvp" className="header-cta-button">
              <Icon name="Calendar" size={18} className="mr-2" />
              RSVP Now
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="header-mobile-toggle"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`mobile-menu-overlay ${!isMobileMenuOpen ? 'hidden' : ''}`}
        onClick={toggleMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />
      <div className={`mobile-menu ${!isMobileMenuOpen ? 'closed' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-brand">Eternal Vows</span>
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-close"
            aria-label="Close mobile menu"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`mobile-menu-link ${isActivePath(item?.path) ? 'active' : ''}`}
            >
              {item?.label}
            </Link>
          ))}
        </nav>

        <Link to="/rsvp" className="mobile-menu-cta">
          <Icon name="Calendar" size={18} className="inline mr-2" />
          RSVP Now
        </Link>
      </div>
    </>
  );
};

export default Header;