'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, Share2, Star, ShoppingBag, Eye, Sparkles, CheckCircle2, SlidersHorizontal, Info } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { POPULAR_MAKEUP_STYLES, MakeupStyleInfo } from '@/lib/data';

const filterCategories = [
  'All',
  'Skin Care',
  'Hair Care',
  'Body Care',
  'Makeup',
  'Mehndi Designs',
  'Health & Wellness'
];

type MakeupSubcategory = 'All' | 'Face Products' | 'Cheek Products' | 'Eye Products' | 'Lip Products';

export default function BestSellersSection() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    openWhatsAppBooking,
    addToast
  } = useStore();

  const [mehndiSubFilter, setMehndiSubFilter] = useState<'All' | 'Hands' | 'Feet' | 'Under $40' | 'Bridal'>('All');
  const [makeupSubCategory, setMakeupSubCategory] = useState<MakeupSubcategory>('All');
  const [selectedMakeupStyle, setSelectedMakeupStyle] = useState<string>('All');
  const [showStyleGuide, setShowStyleGuide] = useState<boolean>(false);

  const activeTab = filterCategories.find(c => c.toLowerCase() === selectedCategory.toLowerCase()) || 'All';

  const filteredProducts = products.filter((p) => {
    if (activeTab !== 'All') {
      if (p.category.toLowerCase() !== activeTab.toLowerCase()) return false;
    }
    
    // Additional Mehndi subfilters
    if (activeTab === 'Mehndi Designs' && mehndiSubFilter !== 'All') {
      if (mehndiSubFilter === 'Hands') {
        return p.subcategory?.toLowerCase().includes('hands') || p.name.toLowerCase().includes('hand');
      }
      if (mehndiSubFilter === 'Feet') {
        return p.subcategory?.toLowerCase().includes('feet') || p.name.toLowerCase().includes('feet') || p.name.toLowerCase().includes('foot');
      }
      if (mehndiSubFilter === 'Under $40') {
        return p.price < 40;
      }
      if (mehndiSubFilter === 'Bridal') {
        return p.subcategory?.toLowerCase().includes('bridal') || p.name.toLowerCase().includes('bridal') || p.name.toLowerCase().includes('dulhan');
      }
    }

    // Additional Makeup subcategory & style filters
    if (activeTab === 'Makeup') {
      if (makeupSubCategory !== 'All') {
        if (p.subcategory !== makeupSubCategory && p.makeupType !== makeupSubCategory.replace(' Products', '')) {
          return false;
        }
      }

      if (selectedMakeupStyle !== 'All') {
        if (!p.makeupStyles?.includes(selectedMakeupStyle)) {
          return false;
        }
      }
    }

    return true;
  });

  const activeStyleInfo = POPULAR_MAKEUP_STYLES.find(s => s.name === selectedMakeupStyle);

  const handleShare = (name: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('info', 'Link Copied', `Link for ${name} copied to clipboard!`);
    }
  };

  return (
    <section id="best-sellers-section" className="py-20 lg:py-24 bg-gradient-to-b from-[#fff0f4] via-[#fef7f9] to-[#fff5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Women Salon & Aesthetic Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
              Salon Services & Treatments
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Explore professional hair styling, organic facials, bridal makeovers, signature mehndi art, and luxury spa treatments.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setMakeupSubCategory('All');
              setSelectedMakeupStyle('All');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 uppercase tracking-wider group"
          >
            <span>View All Salon Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {filterCategories.map((cat, idx) => (
            <button
              key={cat}
              id={`filter-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setSelectedCategory(cat);
                if (cat !== 'Makeup') {
                  setMakeupSubCategory('All');
                  setSelectedMakeupStyle('All');
                }
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
              }`}
            >
              {cat === 'Makeup' ? '💄 Makeup' : cat === 'Mehndi Designs' ? '✨ Mehndi Designs' : cat}
            </button>
          ))}
        </div>

        {/* Makeup Specific Sub-Navigation & Popular Makeup Styles Selector */}
        {activeTab === 'Makeup' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-8"
          >
            {/* Category Sub-Filters: Face, Cheek, Eye, Lip */}
            <div className="p-4 bg-white border border-pink-100 rounded-3xl shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-pink-50">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-pink-600" />
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Makeup Categories:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['All', 'Face Products', 'Cheek Products', 'Eye Products', 'Lip Products'] as const).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setMakeupSubCategory(sub)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        makeupSubCategory === sub
                          ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/20'
                          : 'bg-pink-50/60 text-zinc-700 hover:bg-pink-100 hover:text-pink-900'
                      }`}
                    >
                      {sub === 'All' ? '✨ All Makeup' : sub === 'Face Products' ? '🧖 Face Products' : sub === 'Cheek Products' ? '🌸 Cheek Products' : sub === 'Eye Products' ? '👁️ Eye Products' : '💋 Lip Products'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Makeup Styles Filter Pills */}
              <div className="pt-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                      Popular Makeup Styles:
                    </span>
                  </div>
                  <button
                    onClick={() => setShowStyleGuide(!showStyleGuide)}
                    className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showStyleGuide ? 'Hide Style Guide' : 'View Style Guide'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedMakeupStyle('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedMakeupStyle === 'All'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    All Styles
                  </button>
                  {POPULAR_MAKEUP_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedMakeupStyle(style.name)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        selectedMakeupStyle === style.name
                          ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/25'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-pink-50 hover:text-pink-700'
                      }`}
                    >
                      {style.badge.split(' ')[0]} {style.name}
                    </button>
                  ))}
                </div>

                {/* Selected Style Active Banner */}
                {activeStyleInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3.5 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-bold">
                          {activeStyleInfo.badge}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-900">{activeStyleInfo.name}</h4>
                      </div>
                      <p className="text-xs text-zinc-600 max-w-2xl">{activeStyleInfo.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                      {activeStyleInfo.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-white border border-pink-100 text-pink-700 text-[10px] font-medium whitespace-nowrap">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Expanded Style Guide Cards */}
                <AnimatePresence>
                  {showStyleGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-pink-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
                    >
                      {POPULAR_MAKEUP_STYLES.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => setSelectedMakeupStyle(st.name)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            selectedMakeupStyle === st.name
                              ? 'bg-pink-50 border-pink-400 ring-2 ring-pink-200'
                              : 'bg-zinc-50/70 border-zinc-200/70 hover:bg-white hover:border-pink-200'
                          }`}
                        >
                          <div className="text-sm font-bold text-zinc-900 mb-1">{st.name}</div>
                          <div className="text-[10px] font-semibold text-pink-600 mb-1.5">{st.badge}</div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 mb-2">{st.description}</p>
                          <div className="text-[9px] text-zinc-400 font-medium">
                            <span className="font-semibold text-zinc-600">Best for: </span>
                            {st.recommendedProducts.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mehndi Specific Filter Sub-bar */}
        {activeTab === 'Mehndi Designs' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 p-3 bg-pink-50/70 border border-pink-100 rounded-2xl mb-8"
          >
            <span className="text-xs font-bold text-pink-900 uppercase tracking-wider px-2">
              Filter By Design Type:
            </span>
            {(['All', 'Hands', 'Feet', 'Bridal', 'Under $40'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setMehndiSubFilter(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  mehndiSubFilter === sub
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-white text-zinc-700 hover:bg-pink-100 hover:text-pink-800'
                }`}
              >
                {sub === 'All' ? '✨ All Designs' : sub === 'Hands' ? '✋ Hands Designs' : sub === 'Feet' ? '🦶 Feet Designs' : sub === 'Bridal' ? '👰 Bridal Dulhan' : '🏷️ Under $40'}
              </button>
            ))}
          </motion.div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product, idx) => {
            const isWish = isInWishlist(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 5) * 0.06 }}
                className="group flex flex-col justify-between bg-white rounded-3xl p-3 border border-zinc-100 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all duration-300 relative"
              >
                {/* Product Image Container */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-pink-50/50 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Top Right Action Icons */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                    <button
                      onClick={() => handleShare(product.name)}
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-zinc-900 flex items-center justify-center shadow-sm transition-colors"
                      title="Share product"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors ${
                        isWish ? 'text-pink-600' : 'text-zinc-600 hover:text-pink-600'
                      }`}
                      title="Add to wishlist"
                    >
                      <Heart className={`w-3 h-3 ${isWish ? 'fill-pink-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-pink-600 flex items-center justify-center shadow-sm transition-colors"
                      title="Quick view"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Tag badge */}
                  {product.tag && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-zinc-900 text-[10px] font-bold shadow-sm">
                        {product.tag}
                      </span>
                    </div>
                  )}

                  {/* Subcategory Pill */}
                  {product.subcategory && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900/85 backdrop-blur-sm text-white text-[9px] font-semibold uppercase tracking-wider">
                        {product.subcategory}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="px-1 flex flex-col flex-1 justify-between">
                  <div>
                    <h4
                      onClick={() => setQuickViewProduct(product)}
                      className="font-serif font-bold text-zinc-900 text-sm hover:text-pink-600 transition-colors cursor-pointer line-clamp-1 mb-0.5"
                    >
                      {product.name}
                    </h4>

                    {/* Definition / Volume Note */}
                    <p className="text-[11px] text-zinc-500 font-medium mb-1 line-clamp-2 leading-snug">
                      {product.benefits?.[0] || product.volume}
                    </p>

                    {/* Star Ratings */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-400">({product.reviewsCount})</span>
                    </div>

                    {/* Makeup Style Pills if applicable */}
                    {product.makeupStyles && product.makeupStyles.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap mb-2">
                        {product.makeupStyles.slice(0, 2).map((st) => (
                          <span key={st} className="px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 text-[9px] font-medium">
                            {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-2 border-t border-zinc-50 mt-1">
                    <div className="flex items-baseline gap-1.5 mb-2.5">
                      <span className="font-serif font-bold text-base text-zinc-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      <button
                        onClick={() => addToCart(product)}
                        className="col-span-3 py-2 px-2.5 rounded-full bg-pink-50 hover:bg-pink-600 text-pink-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200"
                        title="Add to Booking Bag"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="truncate">Book</span>
                      </button>

                      <button
                        onClick={() => openWhatsAppBooking(product)}
                        className="col-span-2 py-2 px-2 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 border border-emerald-200 hover:border-emerald-600"
                        title="Instant WhatsApp Booking"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
                        </svg>
                        <span className="text-[11px]">Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8">
            <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-900 mb-1">No products found</h3>
            <p className="text-sm text-zinc-500 mb-4">Try clearing your category or makeup style filter to see more results.</p>
            <button
              onClick={() => {
                setMakeupSubCategory('All');
                setSelectedMakeupStyle('All');
                setMehndiSubFilter('All');
              }}
              className="px-5 py-2 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md hover:bg-pink-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
