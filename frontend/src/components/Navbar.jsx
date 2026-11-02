import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Layers, BookOpen, Activity, Menu, X, Sparkles } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getHealthStatus } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const { t, i18n } = useTranslation();
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Poll backend health status
  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const data = await getHealthStatus(i18n.language);
        if (isMounted) {
          if (data && data.status === 'ok') {
            setBackendStatus('online');
          } else {
            setBackendStatus('offline');
          }
        }
      } catch {
        if (isMounted) setBackendStatus('offline');
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [i18n.language]);

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Layers },
    { id: 'about', label: t('nav.about'), icon: Sparkles },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')} role="button" tabIndex={0}>
          <div className="brand-logo-icon">
            <Globe className="logo-globe" size={24} />
          </div>
          <div className="brand-text">
            <div className="brand-title-wrap">
              <span className="brand-title">Multilangage</span>
              <span className="brand-badge-version">v1.0</span>
            </div>
            <span className="brand-tagline">🇲🇬 MG • 🇫🇷 FR • 🇬🇧 EN</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav-desktop" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
                {isActive && <span className="active-nav-indicator" />}
              </button>
            );
          })}

          {/* <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link-btn nav-link-external"
            title="FastAPI Swagger Documentation"
          >
            <BookOpen size={16} className="nav-icon" />
            <span>{t('nav.api_docs')}</span>
          </a> */}
        </nav>

        {/* Right side: Backend health indicator & Language Switcher */}
        <div className="navbar-actions">
          {/* Backend Status indicator */}
          <div
            className={`backend-status-pill ${backendStatus}`}
            title={backendStatus === 'online' ? t('nav.status_connected') : t('nav.status_disconnected')}
          >
            <span className="status-dot-pulse" />
            <Activity size={13} className="status-activity-icon" />
            <span className="status-text">
              {backendStatus === 'online' ? 'FastAPI 8000' : 'Offline'}
            </span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher variant="dropdown" />

          {/* Mobile menu button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`mobile-link-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-link-btn"
            >
              <BookOpen size={18} />
              <span>{t('nav.api_docs')}</span>
            </a>
          </div>
          <div className="mobile-menu-footer">
            <LanguageSwitcher variant="pills" />
          </div>
        </div>
      )}
    </header>
  );
}
