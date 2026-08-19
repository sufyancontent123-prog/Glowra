'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Star,
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  X,
  ChevronRight,
  Heart,
  Share2,
  SlidersHorizontal,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { MAKEOVER_COLLECTION, MakeoverStyle } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

type MakeoverFilter =
  | 'Popular'
  | 'All'
  | 'Bridal & Wedding'
  | 'Evening & Glam'
  | 'Everyday & Natural'
  | 'High-Definition & Technique'
  | 'Festive & Special Events';

export default function MakeoverSection() {
  const { addToCart, setIsContactModalOpen, openWhatsAppBooking, addToast } = useStore();

  const [activeFilter, setActiveFilter] = useState<MakeoverFilter>('Popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMakeover, setSelectedMakeover] = useState<MakeoverStyle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered makeovers
  const filteredMakeovers = useMemo(() => {
    return MAKEOVER_COLLECTION.filter((item) => {
      // Category filter
      if (activeFilter === 'Popular' && !item.isImportant) {
        return false;
      }
      if (activeFilter !== 'Popular' && activeFilter !== 'All' && item.category !== activeFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTagline = item.tagline.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesOccasion = item.idealFor.toLowerCase().includes(q);
        const matchesFinish = item.finish.toLowerCase().includes(q);
        const matchesProducts =
          item.faceProducts.foundation.toLowerCase().includes(q) ||
          item.faceProducts.primer.toLowerCase().includes(q) ||
          item.faceProducts.concealer.toLowerCase().includes(q);

        return matchesName || matchesTagline || matchesDesc || matchesOccasion || matchesFinish || matchesProducts;
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const willBookmark = !bookmarkedIds.includes(id);
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    addToast(
      'info',
      willBookmark ? 'Look Saved' : 'Look Removed',
      willBookmark ? 'Saved makeover style to favorites' : 'Removed from makeover favorites'
    );
  };

  const handleShare = (makeover: MakeoverStyle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}#makeover-${makeover.id}`);
      setCopiedId(makeover.id);
      addToast('success', 'Link Copied', `Copied link for ${makeover.name}`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section
      id="makeover-section"
      className="py-20 bg-gradient-to-b from-[#fff5f7] via-white to-[#fff8fa] relative overflow-hidden border-t border-pink-100"
    >
      {/* Decorative ambient blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 text-pink-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-pink-200/60">
              <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-spin-slow" />
              <span>Glowora Makeup Makeover Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
              20 Signature Makeup Makeovers
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
              Explore bespoke makeup transformations customized with dedicated{' '}
              <strong className="font-semibold text-zinc-900">
                Face Products (Primer, Foundation, Concealer, Tint / BB Cream & Setting Spray)
              </strong>
              , sculpted cheeks, curated eyes, and statement lips for every milestone.
            </p>
          </div>

          {/* Quick Highlight Stats */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-pink-100 shadow-sm self-start md:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-pink-50 text-center">
              <span className="block font-serif text-lg font-bold text-pink-600">20</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Styles</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-center">
              <span className="block font-serif text-lg font-bold text-rose-600">11</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Top Essentials</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-center">
              <span className="block font-serif text-lg font-bold text-amber-600">100%</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Customized</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {(
                [
                  { id: 'Popular', label: '⭐ Most Popular (11)', count: 11 },
                  { id: 'All', label: '✨ All 20 Makeovers', count: 20 },
                  { id: 'Bridal & Wedding', label: '👰 Bridal & Wedding', count: 3 },
                  { id: 'Evening & Glam', label: '🌙 Evening & Glam', count: 6 },
                  { id: 'Everyday & Natural', label: '☀️ Everyday & Natural', count: 3 },
                  { id: 'High-Definition & Technique', label: '📸 HD & Technique', count: 4 },
                  { id: 'Festive & Special Events', label: '🎉 Festive & Events', count: 4 }
                ] as const
              ).map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`makeover-filter-${tab.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => setActiveFilter(tab.id as MakeoverFilter)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/25 scale-[1.02]'
                        : 'bg-pink-50/60 text-zinc-700 hover:bg-pink-100 hover:text-pink-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[240px]">
              <input
                id="makeover-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles, foundation, occasions..."
                className="w-full bg-zinc-50 hover:bg-white focus:bg-white text-zinc-800 text-xs rounded-2xl pl-9 pr-8 py-2.5 border border-zinc-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Highlight Banner for Most Important Makeovers */}
          {activeFilter === 'Popular' && (
            <div className="p-3 bg-gradient-to-r from-amber-50 via-pink-50 to-rose-50 border border-amber-200/60 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-xs text-zinc-700">
                <strong className="font-semibold text-zinc-900">Most Popular Makeovers:</strong>{' '}
                Day, Night, Party, Bridal, Engagement, Reception, Natural, Soft Glam, Full Glam, HD, and Airbrush Makeup.
              </p>
            </div>
          )}
        </div>

        {/* Makeovers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMakeovers.map((makeover, idx) => {
            const isBookmarked = bookmarkedIds.includes(makeover.id);

            return (
              <motion.div
                key={makeover.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                className="group bg-white rounded-3xl border border-pink-100/90 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-200 transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedMakeover(makeover)}
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                  <img
                    src={makeover.image}
                    alt={makeover.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                        #{String(makeover.number).padStart(2, '0')}
                      </span>
                      {makeover.isImportant && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          <span>Essential</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleShare(makeover, e)}
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-zinc-700 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                        title="Share look"
                      >
                        {copiedId === makeover.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(makeover.id, e)}
                        className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-sm ${
                          isBookmarked
                            ? 'bg-pink-600 text-white'
                            : 'bg-white/80 hover:bg-white text-zinc-700'
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300 block mb-0.5">
                      {makeover.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-tight drop-shadow-sm">
                      {makeover.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Tagline */}
                    <p className="text-xs font-semibold text-pink-700 line-clamp-1 mb-2">
                      {makeover.tagline}
                    </p>

                    {/* Finish & Duration Specs */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded-xl bg-pink-50/60 border border-pink-100/60">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                          Finish
                        </span>
                        <span className="text-xs font-bold text-zinc-800 line-clamp-1">
                          {makeover.finish}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-pink-50/60 border border-pink-100/60">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                          Duration
                        </span>
                        <span className="text-xs font-bold text-zinc-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-pink-600" />
                          <span>{makeover.duration}</span>
                        </span>
                      </div>
                    </div>

                    {/* Face Products Checklist Preview */}
                    <div className="space-y-1.5 mb-3 bg-zinc-50/80 p-2.5 rounded-2xl border border-zinc-100">
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-pink-600" />
                          <span>Face Products Used:</span>
                        </span>
                        <span className="text-pink-600 font-semibold">{makeover.coverage}</span>
                      </div>

                      <div className="text-[11px] text-zinc-600 space-y-1">
                        <div className="line-clamp-1">
                          <strong className="font-medium text-zinc-900">Base:</strong> {makeover.faceProducts.foundation}
                        </div>
                        <div className="line-clamp-1">
                          <strong className="font-medium text-zinc-900">Primer:</strong> {makeover.faceProducts.primer}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-pink-50 flex items-center gap-2">
                    <button
                      id={`btn-explore-${makeover.id}`}
                      onClick={() => setSelectedMakeover(makeover)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-pink-600/20 hover:from-pink-700 hover:to-rose-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Makeover Guide</span>
                    </button>
                    <button
                      id={`btn-book-${makeover.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsContactModalOpen(true);
                      }}
                      className="py-2 px-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-bold transition-all flex items-center justify-center gap-1"
                      title="Book appointment for this look"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredMakeovers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8 shadow-sm">
            <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-900 mb-1">No Makeovers Match Your Filter</h3>
            <p className="text-sm text-zinc-500 mb-4">
              Try resetting your search query or selecting &quot;All 20 Makeovers&quot;.
            </p>
            <button
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md hover:bg-pink-700 transition-all"
            >
              Reset Makeover Filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL MAKEOVER DETAIL & PRODUCTS BREAKDOWN MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedMakeover && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMakeover(null)}
              className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-pink-100 max-h-[90vh] flex flex-col"
            >
              {/* Sticky Close Button */}
              <button
                id="btn-close-makeover-modal"
                onClick={() => setSelectedMakeover(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-zinc-900 flex items-center justify-center shadow-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto">
                {/* Hero Header Visual Banner */}
                <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={selectedMakeover.image}
                    alt={selectedMakeover.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-white text-xs font-mono font-bold">
                        Style #{String(selectedMakeover.number).padStart(2, '0')}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-pink-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                        {selectedMakeover.category}
                      </span>
                      {selectedMakeover.isImportant && (
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Most Common Essential</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight drop-shadow-md">
                      {selectedMakeover.name}
                    </h2>
                    <p className="text-sm sm:text-base text-pink-200 font-medium mt-1">
                      {selectedMakeover.tagline}
                    </p>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Overview Stats & Description */}
                  <div>
                    <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-6">
                      {selectedMakeover.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                          Finish
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">
                          {selectedMakeover.finish}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                          Coverage
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">
                          {selectedMakeover.coverage}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                          Session Duration
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{selectedMakeover.duration}</span>
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                          Lighting Ideal
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">
                          Day / Flash / HD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ideal Occasions Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/70 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 mb-0.5">
                        Ideal Occasions & Venues:
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-700">{selectedMakeover.idealFor}</p>
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* FACE PRODUCTS SPECIFICATIONS SECTION */}
                  {/* ================================================================= */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-zinc-900">
                        Face Products Formulation Guide
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Primer */}
                      <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm hover:border-pink-300 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold uppercase tracking-wider">
                            1. Primer Prep
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">Step 1</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 mb-1">
                          {selectedMakeover.faceProducts.primer}
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          Creates a smooth adhesion barrier, blurs pores, and maximizes wear longevity.
                        </p>
                      </div>

                      {/* Foundation / BB Cream */}
                      <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm hover:border-pink-300 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                            2. Foundation / Tint
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">Step 2</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 mb-1">
                          {selectedMakeover.faceProducts.foundation}
                        </h4>
                        {selectedMakeover.faceProducts.bbCreamOrTint && (
                          <p className="text-[11px] text-zinc-500">
                            Optional BB/Tint: {selectedMakeover.faceProducts.bbCreamOrTint}
                          </p>
                        )}
                      </div>

                      {/* Concealer */}
                      <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm hover:border-pink-300 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                            3. Concealer
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">Step 3</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 mb-1">
                          {selectedMakeover.faceProducts.concealer}
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          Neutralizes under-eye darkness and delivers targeted spot coverage.
                        </p>
                      </div>

                      {/* Setting Powder / Spray */}
                      <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm hover:border-pink-300 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                            4. Setting Powder / Mist
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">Step 4</span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 mb-1">
                          {selectedMakeover.faceProducts.settingPowderSpray}
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          Locks pigments into place, preventing friction transfer and shine breakdown.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* CHEEK, EYE & LIP SPECS */}
                  {/* ================================================================= */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cheeks */}
                    <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>🌸 Cheeks & Contour</span>
                      </h4>
                      <ul className="text-xs text-zinc-600 space-y-1.5">
                        <li>
                          <strong className="text-zinc-900">Blush:</strong>{' '}
                          {selectedMakeover.cheekProducts.blush}
                        </li>
                        {selectedMakeover.cheekProducts.bronzer && (
                          <li>
                            <strong className="text-zinc-900">Bronzer:</strong>{' '}
                            {selectedMakeover.cheekProducts.bronzer}
                          </li>
                        )}
                        {selectedMakeover.cheekProducts.highlighter && (
                          <li>
                            <strong className="text-zinc-900">Highlighter:</strong>{' '}
                            {selectedMakeover.cheekProducts.highlighter}
                          </li>
                        )}
                        {selectedMakeover.cheekProducts.contour && (
                          <li>
                            <strong className="text-zinc-900">Contour:</strong>{' '}
                            {selectedMakeover.cheekProducts.contour}
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Eyes */}
                    <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>👁️ Eyes & Brows</span>
                      </h4>
                      <ul className="text-xs text-zinc-600 space-y-1.5">
                        <li>
                          <strong className="text-zinc-900">Shadow:</strong>{' '}
                          {selectedMakeover.eyeProducts.eyeshadow}
                        </li>
                        <li>
                          <strong className="text-zinc-900">Liner:</strong>{' '}
                          {selectedMakeover.eyeProducts.eyeliner}
                        </li>
                        <li>
                          <strong className="text-zinc-900">Mascara:</strong>{' '}
                          {selectedMakeover.eyeProducts.mascara}
                        </li>
                        <li>
                          <strong className="text-zinc-900">Brows:</strong>{' '}
                          {selectedMakeover.eyeProducts.eyebrows}
                        </li>
                      </ul>
                    </div>

                    {/* Lips */}
                    <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>💋 Lip Formula</span>
                      </h4>
                      <ul className="text-xs text-zinc-600 space-y-1.5">
                        {selectedMakeover.lipProducts.lipstick && (
                          <li>
                            <strong className="text-zinc-900">Lipstick:</strong>{' '}
                            {selectedMakeover.lipProducts.lipstick}
                          </li>
                        )}
                        {selectedMakeover.lipProducts.lipLiner && (
                          <li>
                            <strong className="text-zinc-900">Liner:</strong>{' '}
                            {selectedMakeover.lipProducts.lipLiner}
                          </li>
                        )}
                        {selectedMakeover.lipProducts.lipGloss && (
                          <li>
                            <strong className="text-zinc-900">Gloss:</strong>{' '}
                            {selectedMakeover.lipProducts.lipGloss}
                          </li>
                        )}
                        {selectedMakeover.lipProducts.lipStain && (
                          <li>
                            <strong className="text-zinc-900">Stain:</strong>{' '}
                            {selectedMakeover.lipProducts.lipStain}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* STEP BY STEP TRANSFORMATION PROTOCOL */}
                  {/* ================================================================= */}
                  <div className="bg-zinc-50 p-5 sm:p-6 rounded-3xl border border-zinc-200/80">
                    <h3 className="font-serif text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-pink-600" />
                      <span>Step-by-Step Transformation Protocol</span>
                    </h3>

                    <div className="space-y-3">
                      {selectedMakeover.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed pt-0.5">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Pro Artist Tip */}
                    <div className="mt-5 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                          Master Artist Secret:
                        </span>
                        <p className="text-xs text-amber-900/90 font-medium">
                          {selectedMakeover.artistTip}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Tested for all skin tones & sensitivities</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                      <button
                        id="btn-whatsapp-makeover"
                        onClick={() => {
                          const currentMakeover = selectedMakeover;
                          setSelectedMakeover(null);
                          openWhatsAppBooking(null, `${currentMakeover?.name || 'Makeover'} Transformation`, 85);
                        }}
                        className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
                        </svg>
                        <span>Book on WhatsApp</span>
                      </button>

                      <button
                        id="btn-book-consultation"
                        onClick={() => {
                          setSelectedMakeover(null);
                          setIsContactModalOpen(true);
                        }}
                        className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-600/25 hover:from-pink-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book In-Salon Consultation</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
