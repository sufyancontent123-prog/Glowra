'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, PhoneCall, Sparkles, MessageCircle, ChevronUp } from 'lucide-react';
import { createWhatsAppLink, DISPLAY_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useStore } from '@/context/StoreContext';

interface FloatingWhatsAppWidgetProps {
  onOpenBookingModal?: (serviceName?: string) => void;
}

export default function FloatingWhatsAppWidget({ onOpenBookingModal }: FloatingWhatsAppWidgetProps) {
  const { openWhatsAppBooking } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickChat = (topic?: string) => {
    const text = topic
      ? `🌸 *Hello Glowora Salon!* 🌸\n\nI would like to inquire about *${topic}*. Please let me know your available packages, pricing, and consultation timings.\n\nThank you!`
      : `🌸 *Hello Glowora Salon!* 🌸\n\nI would like to consult with your beauty team and book an appointment. Please guide me through your available services!`;

    const link = createWhatsAppLink(text, DEFAULT_WHATSAPP_NUMBER);
    window.open(link, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCall = () => {
    const link = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`;
    window.open(link, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenBooking = () => {
    setIsOpen(false);
    if (onOpenBookingModal) {
      onOpenBookingModal('Luxury Salon Treatment / Makeover');
    } else {
      openWhatsAppBooking(null, 'Luxury Salon Treatment / Makeover');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                aria-label="Close WhatsApp menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Glowora WhatsApp Desk
                    <Sparkles className="w-3 h-3 text-emerald-200" />
                  </h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    Online • Instant Booking Support
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3.5 space-y-2">
              <button
                onClick={handleOpenBooking}
                className="w-full p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left flex items-center gap-3 group transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-zinc-900">Book Salon Appointment</p>
                  <p className="text-[11px] text-zinc-500">Pick date, time & service details</p>
                </div>
                <ChevronUp className="w-4 h-4 text-emerald-600 rotate-90" />
              </button>

              <button
                onClick={() => handleQuickChat()}
                className="w-full p-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-left flex items-center gap-3 group transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-zinc-900">Direct Chat on WhatsApp</p>
                  <p className="text-[11px] text-zinc-500">Ask any beauty or product query</p>
                </div>
                <ChevronUp className="w-4 h-4 text-zinc-400 rotate-90" />
              </button>

              <button
                onClick={handleCall}
                className="w-full p-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 text-left flex items-center gap-3 group transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-zinc-900">Call on WhatsApp</p>
                  <p className="text-[11px] text-zinc-500">{DISPLAY_WHATSAPP_NUMBER}</p>
                </div>
                <ChevronUp className="w-4 h-4 text-zinc-400 rotate-90" />
              </button>
            </div>

            {/* Quick Topic Chips */}
            <div className="px-3.5 pb-3.5 pt-1 border-t border-zinc-100">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
                Popular Quick Inquiries
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Bridal Makeover Packages',
                  'Hydrafacial Booking',
                  'Mehndi / Henna Artistry',
                  'Skincare Routine Help'
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickChat(topic)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 text-zinc-700 transition-colors border border-transparent hover:border-emerald-200"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-900/30 border-2 border-white cursor-pointer"
        aria-label="Contact via WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
        </span>

        {/* WhatsApp Icon */}
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
        </svg>

        <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">
          WhatsApp Contact & Booking
        </span>
        <span className="sm:hidden text-xs font-bold">
          WhatsApp
        </span>
      </motion.button>
    </div>
  );
}
