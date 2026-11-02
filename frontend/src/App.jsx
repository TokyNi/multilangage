import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const { t, i18n } = useTranslation();

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Page Content */}
      <main className="main-content">
        {activePage === 'home' ? (
          <Home onNavigateAbout={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        ) : (
          <About />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-brand">
              <div className="footer-brand-header">
                <div className="footer-brand-icon">
                  <Globe size={20} />
                </div>
                <span className="footer-brand-title">Multilangage</span>
              </div>
              <p className="footer-brand-tagline">
                {t('footer.description')}
              </p>
              <div className="footer-flags">
                <span className="footer-flag-pill">🇲🇬 Malagasy</span>
                <span className="footer-flag-pill">🇫🇷 Français</span>
                <span className="footer-flag-pill">🇬🇧 English</span>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <button type="button" onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    {t('nav.home')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    {t('nav.about')}
                  </button>
                </li>
                <li>
                  <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
                    {t('nav.api_docs')} (Swagger)
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-tech-group">
              <h4>Stack Technique</h4>
              <div className="footer-tech-tags">
                <span className="tech-badge">React 19</span>
                <span className="tech-badge">Vite</span>
                <span className="tech-badge">react-i18next</span>
                <span className="tech-badge">FastAPI</span>
                <span className="tech-badge">Pydantic v2</span>
                <span className="tech-badge">Uvicorn</span>
              </div>
            </div>

            <div className="footer-lang-col">
              <h4>{t('switcher.select_label')}</h4>
              <LanguageSwitcher variant="pills" />
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="footer-copy">
              © {new Date().getFullYear()} Multilangage. {t('footer.rights')}
            </p>
            <p className="footer-love">
              {t('footer.built_with')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
