import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Search,
  PlusCircle,
  RefreshCw,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe2,
  Trash2,
  Info,
  ArrowRight,
  Layers,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { getItems, createItem, deleteItem } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home({ onNavigateAbout }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'fr';

  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  // New item form state
  const [formData, setFormData] = useState({
    name_fr: '',
    name_en: '',
    name_mg: '',
    description_fr: '',
    description_en: '',
    description_mg: '',
    category: 'spices',
    price: 25.0,
    in_stock: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch items from FastAPI
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems({
        search: searchQuery,
        category: selectedCategory,
        customLang: currentLang,
      });
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, currentLang]);

  // Re-fetch whenever language or filters change
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const categories = [
    { id: 'all', label: t('catalog.category_all') },
    { id: 'spices', label: t('catalog.category_spices') },
    { id: 'handicraft', label: t('catalog.category_handicraft') },
    { id: 'textile', label: t('catalog.category_textile') },
    { id: 'coffee', label: t('catalog.category_coffee') },
  ];

  // Handle item deletion
  const handleDelete = async (itemId) => {
    if (!window.confirm(currentLang === 'mg' ? 'Tena hofafana tokoa ve ity entana ity?' : currentLang === 'en' ? 'Are you sure you want to delete this item?' : 'Voulez-vous vraiment supprimer cet article ?')) {
      return;
    }
    try {
      await deleteItem(itemId, currentLang);
      loadItems();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createItem(formData, currentLang);
      setIsAddModalOpen(false);
      setFormData({
        name_fr: '',
        name_en: '',
        name_mg: '',
        description_fr: '',
        description_en: '',
        description_mg: '',
        category: 'spices',
        price: 25.0,
        in_stock: true,
      });
      loadItems();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-orb hero-orb-1" />
        <div className="hero-glow-orb hero-orb-2" />

        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={14} className="badge-sparkle-icon" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="hero-title animate-slide-up">
            <span className="title-plain">{t('hero.title_part1')}</span>{' '}
            <span className="title-gradient">{t('hero.title_part2')}</span>
          </h1>

          <p className="hero-subtitle animate-slide-up-delay">
            {t('hero.subtitle')}
          </p>

          {/* Quick inline language switch demonstration */}
          <div className="hero-interactive-switcher animate-fade-in">
            <span className="switcher-hint">
              <Globe2 size={16} />
              {t('switcher.select_label')}:
            </span>
            <LanguageSwitcher variant="pills" />
          </div>

          <div className="hero-actions">
            <a href="#catalog" className="btn-primary">
              <span>{t('hero.btn_explore')}</span>
              <ArrowRight size={18} />
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle size={18} />
              <span>{t('hero.btn_add_item')}</span>
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={onNavigateAbout}
            >
              <span>{t('hero.btn_about')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-box icon-purple">
              <Zap size={24} />
            </div>
            <h3>{t('features.instant_i18n_title')}</h3>
            <p>{t('features.instant_i18n_desc')}</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-box icon-emerald">
              <ShieldCheck size={24} />
            </div>
            <h3>{t('features.fullstack_title')}</h3>
            <p>{t('features.fullstack_desc')}</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-box icon-amber">
              <Layers size={24} />
            </div>
            <h3>{t('features.rich_content_title')}</h3>
            <p>{t('features.rich_content_desc')}</p>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="catalog-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-kicker">FastAPI Dynamic Data</span>
            <h2 className="section-heading">{t('catalog.title')}</h2>
            <p className="section-subheading">{t('catalog.subtitle')}</p>
          </div>

          <div className="catalog-top-controls">
            <button
              type="button"
              className="btn-icon-refresh"
              onClick={loadItems}
              disabled={loading}
              title="Rafraîchir les données"
            >
              <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            </button>
            <button
              type="button"
              className="btn-accent-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle size={16} />
              <span>{t('hero.btn_add_item')}</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="catalog-filter-bar glass-panel">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('catalog.search_placeholder')}
              aria-label="Search items"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="category-tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                role="tab"
                aria-selected={selectedCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Content States */}
        {error ? (
          <div className="state-card error-card glass-panel">
            <AlertCircle size={32} className="error-icon" />
            <div className="error-text">
              <h4>{t('catalog.error_loading')}</h4>
              <p className="error-detail">{error}</p>
              <div className="error-help">
                <code>uvicorn backend.app.main:app --port 8000 --reload</code>
              </div>
            </div>
            <button type="button" className="btn-secondary" onClick={loadItems}>
              <RefreshCw size={16} /> Réessayer
            </button>
          </div>
        ) : loading && items.length === 0 ? (
          <div className="state-card loading-card glass-panel">
            <RefreshCw size={36} className="spinning spinner-main" />
            <p>{t('catalog.loading')}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="state-card empty-card glass-panel">
            <Search size={36} className="empty-icon" />
            <p>{t('catalog.empty')}</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <article key={item.id} className="item-card glass-panel">
                <div className="item-image-wrapper">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="item-image"
                    loading="lazy"
                  />
                  <span className="item-category-tag">
                    {item.category_localized || item.category}
                  </span>
                  <span className={`item-stock-tag ${item.in_stock ? 'in-stock' : 'out-stock'}`}>
                    {item.in_stock ? (
                      <>
                        <CheckCircle2 size={12} /> {t('catalog.in_stock')}
                      </>
                    ) : (
                      <>
                        <XCircle size={12} /> {t('catalog.out_of_stock')}
                      </>
                    )}
                  </span>
                </div>

                <div className="item-body">
                  <div className="item-header-meta">
                    <div className="item-rating">
                      <Star size={14} className="star-icon" fill="currentColor" />
                      <span>{item.rating?.toFixed(1) || '4.8'}</span>
                    </div>
                    <span className="item-lang-badge">
                      {item.language?.toUpperCase() || currentLang.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="item-title">{item.name}</h3>
                  <p className="item-description">{item.description}</p>

                  <div className="item-footer">
                    <div className="item-price-wrap">
                      <span className="price-label">{t('catalog.price_label')}</span>
                      <span className="item-price">
                        {item.price.toFixed(2)} {item.currency || '€'}
                      </span>
                    </div>

                    <div className="item-card-actions">
                      <button
                        type="button"
                        className="btn-action-icon"
                        onClick={() => setSelectedDetailItem(item)}
                        title={t('catalog.details_btn')}
                      >
                        <Info size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action-icon danger"
                        onClick={() => handleDelete(item.id)}
                        title={t('catalog.delete_btn')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Multilingual Details Modal */}
      {selectedDetailItem && (
        <div className="modal-backdrop" onClick={() => setSelectedDetailItem(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Globe2 size={20} className="modal-globe-icon" />
                <h3>{selectedDetailItem.name}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedDetailItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="detail-modal-subtitle">
                {t('about.tester_desc')}
              </p>

              <div className="languages-comparison-grid">
                {/* Malagasy Column */}
                <div className={`lang-comp-card ${currentLang === 'mg' ? 'current-active' : ''}`}>
                  <div className="lang-comp-header">
                    <span className="comp-flag">🇲🇬</span>
                    <div>
                      <strong>Malagasy</strong>
                      <span className="comp-tag">Teny Malagasy</span>
                    </div>
                  </div>
                  <h4 className="comp-name">
                    {selectedDetailItem.translations?.mg?.name || selectedDetailItem.name}
                  </h4>
                  <p className="comp-desc">
                    {selectedDetailItem.translations?.mg?.description || selectedDetailItem.description}
                  </p>
                </div>

                {/* French Column */}
                <div className={`lang-comp-card ${currentLang === 'fr' ? 'current-active' : ''}`}>
                  <div className="lang-comp-header">
                    <span className="comp-flag">🇫🇷</span>
                    <div>
                      <strong>Français</strong>
                      <span className="comp-tag">Langue officielle</span>
                    </div>
                  </div>
                  <h4 className="comp-name">
                    {selectedDetailItem.translations?.fr?.name || selectedDetailItem.name}
                  </h4>
                  <p className="comp-desc">
                    {selectedDetailItem.translations?.fr?.description || selectedDetailItem.description}
                  </p>
                </div>

                {/* English Column */}
                <div className={`lang-comp-card ${currentLang === 'en' ? 'current-active' : ''}`}>
                  <div className="lang-comp-header">
                    <span className="comp-flag">🇬🇧</span>
                    <div>
                      <strong>English</strong>
                      <span className="comp-tag">International</span>
                    </div>
                  </div>
                  <h4 className="comp-name">
                    {selectedDetailItem.translations?.en?.name || selectedDetailItem.name}
                  </h4>
                  <p className="comp-desc">
                    {selectedDetailItem.translations?.en?.description || selectedDetailItem.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedDetailItem(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-lg glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <PlusCircle size={20} className="modal-plus-icon" />
                <h3>{t('item_modal.title')}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <p className="form-helper-text">{t('item_modal.subtitle')}</p>

              {/* Names row */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label>
                    <span>🇲🇬 {t('item_modal.name_mg')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_mg}
                    onChange={(e) => setFormData({ ...formData, name_mg: e.target.value })}
                    placeholder="ohatra: Lavanila Bourbon"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span>🇫🇷 {t('item_modal.name_fr')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_fr}
                    onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                    placeholder="ex: Vanille Bourbon"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span>🇬🇧 {t('item_modal.name_en')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g. Bourbon Vanilla"
                  />
                </div>
              </div>

              {/* Descriptions row */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label>
                    <span>🇲🇬 {t('item_modal.desc_mg')}</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description_mg}
                    onChange={(e) => setFormData({ ...formData, description_mg: e.target.value })}
                    placeholder="Famaritana fohy..."
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span>🇫🇷 {t('item_modal.desc_fr')}</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description_fr}
                    onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                    placeholder="Description détaillée..."
                  />
                </div>

                <div className="form-group">
                  <label>
                    <span>🇬🇧 {t('item_modal.desc_en')}</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Short description..."
                  />
                </div>
              </div>

              {/* Meta row: category & price */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label>{t('item_modal.category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="spices">{t('catalog.category_spices')}</option>
                    <option value="handicraft">{t('catalog.category_handicraft')}</option>
                    <option value="textile">{t('catalog.category_textile')}</option>
                    <option value="coffee">{t('catalog.category_coffee')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('item_modal.price')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  {t('item_modal.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Enregistrement...' : t('item_modal.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
