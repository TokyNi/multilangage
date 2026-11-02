import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  {
    code: 'mg',
    name: 'Malagasy',
    nativeLabel: 'Fiteny Malagasy',
    flag: '🇲🇬',
    region: 'Madagasikara',
    badge: 'Teny nibeazana'
  },
  {
    code: 'fr',
    name: 'Français',
    nativeLabel: 'Français',
    flag: '🇫🇷',
    region: 'France & Francophonie',
    badge: 'Officielle'
  },
  {
    code: 'en',
    name: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
    region: 'Global & Tech',
    badge: 'International'
  }
];

export default function LanguageSwitcher({ variant = 'dropdown' }) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangCode = i18n.language ? i18n.language.split('-')[0] : 'fr';
  const currentLang = LANGUAGES.find(l => l.code === currentLangCode) || LANGUAGES[1];

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'pills') {
    return (
      <div className="language-pills" role="radiogroup" aria-label={t('switcher.select_label')}>
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === currentLangCode;
          return (
            <button
              key={lang.code}
              type="button"
              className={`pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
              aria-checked={isActive}
              role="radio"
              title={`${lang.name} (${lang.nativeLabel})`}
            >
              <span className="pill-flag">{lang.flag}</span>
              <span className="pill-name">{lang.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        type="button"
        id="language-switcher-trigger"
        className={`lang-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('switcher.select_label')}
      >
        <div className="lang-trigger-left">
          <span className="lang-trigger-flag">{currentLang.flag}</span>
          <div className="lang-trigger-text">
            <span className="lang-trigger-code">{currentLang.code.toUpperCase()}</span>
            <span className="lang-trigger-name">{currentLang.name}</span>
          </div>
        </div>
        <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu" role="listbox">
          <div className="lang-dropdown-header">
            <Globe size={14} className="header-globe-icon" />
            <span>{t('switcher.select_label')}</span>
          </div>
          <div className="lang-options-list">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="lang-option-flag">{lang.flag}</span>
                  <div className="lang-option-info">
                    <div className="lang-option-top">
                      <span className="lang-option-name">{lang.name}</span>
                      <span className="lang-option-badge">{lang.badge}</span>
                    </div>
                    <span className="lang-option-native">{lang.nativeLabel} • {lang.region}</span>
                  </div>
                  {isSelected && <Check size={16} className="lang-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
