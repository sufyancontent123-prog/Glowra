'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';
import { getServiceBookingWhatsAppLink, DISPLAY_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { Product } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

interface WhatsAppBookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  service?: Product | null;
  serviceName?: string;
  servicePrice?: number;
  duration?: string;
}

export default function WhatsAppBookingModal(props: WhatsAppBookingModalProps) {
  const store = useStore();

  const isOpen = props.isOpen !== undefined ? props.isOpen : store.isWhatsAppBookingOpen;
  const onClose = props.onClose || (() => store.setIsWhatsAppBookingOpen(false));
  const activeService = props.service !== undefined ? props.service : store.whatsAppBookingService;

  const selectedName = activeService?.name || props.serviceName || 'Luxury Salon Treatment & Styling';
  const selectedPrice = activeService?.price ?? props.servicePrice;
  const selectedDuration = activeService?.volume || (activeService as any)?.duration || props.duration || '45-60 Mins Session';

  const [customerName, setCustomerName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');

  // Auto set tomorrow as initial date suggestion
  useEffect(() => {
    if (!preferredDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setPreferredDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [preferredDate]);

  const handleOpenWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const link = getServiceBookingWhatsAppLink({
      phone: DEFAULT_WHATSAPP_NUMBER,
      serviceName: selectedName,
      servicePrice: selectedPrice,
      duration: selectedDuration,
      customerName: customerName.trim() || undefined,
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime || undefined,
      notes: notes.trim() || undefined
    });

    window.open(link, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleDirectCall = () => {
    const callLink = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`;
    window.open(callLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-emerald-100"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-7 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold tracking-wide uppercase mb-2">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              <span>Direct WhatsApp Appointment</span>
            </div>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Book via WhatsApp
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Connect directly with our salon team for instant slot confirmation & custom beauty consultation.
            </p>
          </div>

          {/* Service Preview Chip */}
          <div className="p-5 sm:p-6 bg-emerald-50/50 border-b border-emerald-100 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold">Selected Service</p>
              <h4 className="font-semibold text-zinc-900 text-sm sm:text-base mt-0.5 line-clamp-1">
                {selectedName}
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5">
                ⏱ {selectedDuration}
              </p>
            </div>
            {selectedPrice !== undefined && (
              <div className="text-right shrink-0">
                <span className="text-xs text-zinc-500 block">Estimated Fee</span>
                <span className="font-bold text-emerald-700 text-base sm:text-lg">
                  ${selectedPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleOpenWhatsApp} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Your Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Ayesha / Sara"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="10:00 AM - 11:30 AM">Morning (10:00 AM - 11:30 AM)</option>
                    <option value="11:30 AM - 01:00 PM">Noon (11:30 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 06:00 PM">Evening (04:00 PM - 06:00 PM)</option>
                    <option value="06:00 PM - 08:30 PM">Night (06:00 PM - 08:30 PM)</option>
                    <option value="Flexible Timing">Flexible Timing</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Sensitive skin, bridal party booking, or specific stylist request..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
                </svg>
                <span>Open in WhatsApp & Book Now</span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDirectCall}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call on WhatsApp ({DISPLAY_WHATSAPP_NUMBER})</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-3 rounded-xl text-zinc-500 hover:text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 justify-center pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant direct response • No advance signup required</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
