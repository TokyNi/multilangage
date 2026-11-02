import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Layers,
  Server,
  Code2,
  CheckCircle,
  Sparkles,
  Cpu,
  ArrowRight,
  Database,
  Terminal
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getHealthStatus } from '../services/api';

export default function About() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'fr';
  const [apiResponse, setApiResponse] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  useEffect(() => {
    async function testBackend() {
      setLoadingApi(true);
      try {
        const res = await getHealthStatus(currentLang);
        setApiResponse(res);
      } catch (err) {
        setApiResponse({ error: err.message });
      } finally {
        setLoadingApi(false);
      }
    }
    testBackend();
  }, [currentLang]);

  return (
    <div className="page-container about-page">
      {/* Header */}
      <section className="about-header-section">
        <div className="hero-badge animate-fade-in">
          <Sparkles size={14} className="badge-sparkle-icon" />
          <span>Architecture & Culture</span>
        </div>
        <h1 className="about-title">{t('about.title')}</h1>
        <p className="about-subtitle">{t('about.subtitle')}</p>
      </section>

      {/* The 3 Languages Cards */}
      <section className="about-languages-section">
        <h2 className="section-title-center">{t('about.section_languages_title')}</h2>

        <div className="languages-grid">
          {/* Malagasy Card */}
          <div className="language-pillar-card glass-panel border-malagasy">
            <div className="pillar-header">
              <span className="pillar-flag">🇲🇬</span>
              <div className="pillar-title-box">
                <span className="pillar-code">MG / MLG</span>
                <h3>{t('about.mg_title')}</h3>
              </div>
            </div>
            <p className="pillar-desc">{t('about.mg_desc')}</p>
            <div className="pillar-quote">
              <span className="quote-mark">“</span>
              <p>Ny fihavanana no mahaleo ny erỳ sy maha-olom-banona.</p>
              <span className="quote-author">— Ohabolana Malagasy</span>
            </div>
            <div className="pillar-features">
              <span className="feature-chip">Teny nibeazana</span>
              <span className="feature-chip">30M+ Mpitety</span>
              <span className="feature-chip">Nosy Madagasikara</span>
            </div>
          </div>

          {/* French Card */}
          <div className="language-pillar-card glass-panel border-french">
            <div className="pillar-header">
              <span className="pillar-flag">🇫🇷</span>
              <div className="pillar-title-box">
                <span className="pillar-code">FR / FRA</span>
                <h3>{t('about.fr_title')}</h3>
              </div>
            </div>
            <p className="pillar-desc">{t('about.fr_desc')}</p>
            <div className="pillar-quote">
              <span className="quote-mark">“</span>
              <p>La langue est la feuille de route d'une culture.</p>
              <span className="quote-author">— Rita Mae Brown</span>
            </div>
            <div className="pillar-features">
              <span className="feature-chip">Langue officielle</span>
              <span className="feature-chip">Éducation & Droit</span>
              <span className="feature-chip">Espace Francophone</span>
            </div>
          </div>

          {/* English Card */}
          <div className="language-pillar-card glass-panel border-english">
            <div className="pillar-header">
              <span className="pillar-flag">🇬🇧</span>
              <div className="pillar-title-box">
                <span className="pillar-code">EN / ENG</span>
                <h3>{t('about.en_title')}</h3>
              </div>
            </div>
            <p className="pillar-desc">{t('about.en_desc')}</p>
            <div className="pillar-quote">
              <span className="quote-mark">“</span>
              <p>A different language is a different vision of life.</p>
              <span className="quote-author">— Federico Fellini</span>
            </div>
            <div className="pillar-features">
              <span className="feature-chip">Global Tech</span>
              <span className="feature-chip">Open Source</span>
              <span className="feature-chip">International Trade</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section className="about-tech-section glass-panel">
        <h2 className="section-title-left">
          <Cpu className="title-icon" size={24} />
          <span>{t('about.section_tech_title')}</span>
        </h2>

        <div className="tech-columns-grid">
          {/* Frontend Box */}
          <div className="tech-box">
            <div className="tech-box-header">
              <Layers size={20} className="tech-icon-front" />
              <h4>Frontend (React 19 + Vite)</h4>
            </div>
            <p>{t('about.frontend_tech_desc')}</p>
            <ul className="tech-list">
              <li>
                <CheckCircle size={14} className="list-check" />
                <span><code>i18next</code> + <code>react-i18next</code> pour le rendu instantané</span>
              </li>
              <li>
                <CheckCircle size={14} className="list-check" />
                <span>Détection et stockage du choix dans <code>localStorage</code></span>
              </li>
              <li>
                <CheckCircle size={14} className="list-check" />
                <span>Composant modulaire <code>LanguageSwitcher.jsx</code></span>
              </li>
            </ul>
          </div>

          {/* Backend Box */}
          <div className="tech-box">
            <div className="tech-box-header">
              <Server size={20} className="tech-icon-back" />
              <h4>Backend (FastAPI)</h4>
            </div>
            <p>{t('about.backend_tech_desc')}</p>
            <ul className="tech-list">
              <li>
                <CheckCircle size={14} className="list-check" />
                <span>Négociation automatique par en-tête <code>Accept-Language</code></span>
              </li>
              <li>
                <CheckCircle size={14} className="list-check" />
                <span>Paramètre d'URL direct <code>?lang=mg|fr|en</code></span>
              </li>
              <li>
                <CheckCircle size={14} className="list-check" />
                <span>Validation Pydantic v2 & Modèles multilingues</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Project Tree Visualizer */}
        <div className="project-tree-wrapper">
          <div className="tree-header">
            <Terminal size={16} />
            <span>{t('about.architecture_title')} (Arborescence du Projet)</span>
          </div>
          <pre className="project-tree-code">
{`multilangage/
│
├── frontend/                         # React + Vite (JSX)
│   ├── public/
│   ├── src/
│   │   ├── assets/                   # Images, icônes
│   │   ├── components/               # Navbar.jsx, LanguageSwitcher.jsx
│   │   ├── pages/                    # Home.jsx, About.jsx
│   │   ├── services/                 # api.js (Communication avec FastAPI)
│   │   ├── locales/                  # Fichiers de traductions (fr, en, mg)
│   │   │   ├── fr/translation.json
│   │   │   ├── en/translation.json
│   │   │   └── mg/translation.json
│   │   ├── i18n.js                  # Configuration multilingue
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── backend/                          # FastAPI
│   ├── app/
│   │   ├── api/endpoints/items.py    # Points de terminaison API
│   │   ├── models/item.py            # Modèles de données
│   │   ├── schemas/item.py           # Validation Pydantic
│   │   ├── services/item_service.py  # Logique métier & Persistence
│   │   ├── core/translations.py      # Dictionnaires & Négociation
│   │   └── main.py                   # Application FastAPI & CORS
│   ├── tests/test_items.py           # Tests Pytest multilingues
│   ├── venv/                         # Environnement virtuel Python
│   └── requirements.txt
│
├── .gitignore
└── README.md`}
          </pre>
        </div>
      </section>

      {/* Live Interactive Sandbox */}
      <section className="about-sandbox-section glass-panel">
        <div className="sandbox-header">
          <div className="sandbox-title-wrap">
            <Code2 size={22} className="sandbox-icon" />
            <h3>{t('about.tester_title')}</h3>
          </div>
          <LanguageSwitcher variant="pills" />
        </div>

        <p className="sandbox-desc">{t('about.tester_desc')}</p>

        <div className="sandbox-grid">
          {/* Frontend state */}
          <div className="sandbox-card">
            <div className="sandbox-card-header">
              <span className="tag-source tag-react">Frontend (React i18next)</span>
              <span className="tag-lang">lng: {currentLang}</span>
            </div>
            <div className="sandbox-code-preview">
              <code>t('app.tagline')</code>
              <p className="sandbox-result">"{t('app.tagline')}"</p>
            </div>
            <div className="sandbox-code-preview">
              <code>t('hero.title_part1')</code>
              <p className="sandbox-result">"{t('hero.title_part1')}"</p>
            </div>
          </div>

          {/* Backend state */}
          <div className="sandbox-card">
            <div className="sandbox-card-header">
              <span className="tag-source tag-fastapi">Backend (FastAPI GET /api/health)</span>
              <span className="tag-lang">{loadingApi ? 'Chargement...' : '200 OK'}</span>
            </div>
            <pre className="sandbox-json-preview">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
