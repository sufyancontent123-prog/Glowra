'use client';

import React from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ValuePropsBar from '@/components/ValuePropsBar';
import ShopByCategorySection from '@/components/ShopByCategorySection';
import BestSellersSection from '@/components/BestSellersSection';
import MakeoverSection from '@/components/MakeoverSection';
import SensitiveSkinSection from '@/components/SensitiveSkinSection';
import PromoBanner1 from '@/components/PromoBanner1';
import NaturalGlowSection from '@/components/NaturalGlowSection';
import SerumUsagesSection from '@/components/SerumUsagesSection';
import EssentialsKitBundleSection from '@/components/EssentialsKitBundleSection';
import PromoBanner2 from '@/components/PromoBanner2';
import BiggestLaunchSection from '@/components/BiggestLaunchSection';
import GlowcareSecretSection from '@/components/GlowcareSecretSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

// Interactive Drawers & Modals
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
import CheckoutModal from '@/components/CheckoutModal';
import PortfolioModal from '@/components/PortfolioModal';
import ContactModal from '@/components/ContactModal';
import AdminModal from '@/components/AdminModal';
import ToastContainer from '@/components/ToastContainer';
import WhatsAppBookingModal from '@/components/WhatsAppBookingModal';
import FloatingWhatsAppWidget from '@/components/FloatingWhatsAppWidget';

export default function HomePage() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#fff5f7] text-zinc-800 font-sans selection:bg-pink-200 selection:text-pink-900">
        {/* Navigation */}
        <Navbar />

        {/* Hero & Top Value Props */}
        <main>
          <HeroSection />
          <ValuePropsBar />

          {/* Catalog Categories & Bestsellers */}
          <ShopByCategorySection />
          <BestSellersSection />

          {/* 20 Signature Makeup Makeovers Section */}
          <MakeoverSection />

          {/* Sensitive Skin Dermatology Feature */}
          <SensitiveSkinSection />

          {/* Mid-page Promotional Highlight */}
          <PromoBanner1 />

          {/* Peach 70 Niacin Star Showcase */}
          <NaturalGlowSection />
          <SerumUsagesSection />

          {/* Essentials Kit Bundles */}
          <EssentialsKitBundleSection />

          {/* Big Promotional Banner */}
          <PromoBanner2 />

          {/* Biggest Launch Showcase */}
          <BiggestLaunchSection />

          {/* Glowcare Secret Ingredients & Visual Clinical Results */}
          <GlowcareSecretSection />
          <BeforeAfterSection />

          {/* Frequently Asked Questions */}
          <FaqSection />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Drawers, Modals & Toast System */}
        <CartDrawer />
        <WishlistDrawer />
        <ProductQuickViewModal />
        <CheckoutModal />
        <PortfolioModal />
        <ContactModal />
        <AdminModal />
        <WhatsAppBookingModal />
        <FloatingWhatsAppWidget />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}
