'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Heart, Mail, Phone, MapPin, Send, ShieldCheck, Truck, RefreshCw, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { openContactWithPrefill, setIsPortfolioModalOpen, setIsAdminModalOpen, openWhatsAppBooking, settings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="footer-section" className="bg-gradient-to-b from-[#fff5f7] via-[#fef0f4] to-[#fde9ef] border-t border-pink-200/80 pt-16 pb-12 text-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-pink-200/60">
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-zinc-900 text-sm">Free Express Shipping</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Complimentary on all orders above $50</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-zinc-900 text-sm">100% Authentic Botanical</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Dermatologist approved & cruelty-free</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-zinc-900 text-sm">30-Day Glowing Guarantee</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Hassle-free returns & instant exchange</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-zinc-900">
                Glowora<span className="text-pink-600">.</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              Formulating clinical-grade botanical skincare tailored for natural radiance and delicate skin barriers. Handcrafted with passion by <strong>Muhammad Sufyan</strong> (Agentic AI RAG and Web Developer).
            </p>

            <div className="pt-2 space-y-2 text-xs text-zinc-600">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{settings.contactLocation || 'Global / Remote'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{settings.contactPhone || '+1 (555) 019-2834'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{settings.contactEmail || 'smartdev242@gmail.com'}</span>
              </p>
              <div className="pt-1">
                <button
                  onClick={() => openWhatsAppBooking(null, 'Salon Appointment & Skincare Consultation')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
                  </svg>
                  <span>Chat &amp; Book on WhatsApp</span>
                </button>
              </div>
              <p className="flex items-center gap-2 pt-1">
                <Globe className="w-4 h-4 text-pink-600 shrink-0" />
                <a
                  href="https://muhammad-sufyan-farzand-portfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Muhammad-Sufyan-Farzand-Portfolio-Vercel-App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif font-bold text-zinc-900 text-sm tracking-wider uppercase">
              Shop Skincare
            </h5>
            <ul className="space-y-2 text-zinc-600">
              <li><a href="#bestsellers" className="hover:text-pink-600 transition-colors">Best Sellers</a></li>
              <li><a href="#sensitive-skin" className="hover:text-pink-600 transition-colors">Sensitive Skin Care</a></li>
              <li><a href="#natural-glow" className="hover:text-pink-600 transition-colors">Peach 70 Niacin Serum</a></li>
              <li><a href="#essentials-bundle" className="hover:text-pink-600 transition-colors">Curated Essentials Kit</a></li>
              <li><a href="#glow-secrets" className="hover:text-pink-600 transition-colors">Glowcare Secrets</a></li>
            </ul>
          </div>

          {/* Muhammad Sufyan Services */}
          <div className="space-y-3 text-xs">
            <h5 className="font-serif font-bold text-zinc-900 text-sm tracking-wider uppercase">
              Agentic AI & Web Dev
            </h5>
            <ul className="space-y-2 text-zinc-600">
              <li>
                <a
                  href="https://muhammad-sufyan-farzand-portfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Portfolio: Muhammad Sufyan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsPortfolioModalOpen(true)}
                  className="text-zinc-700 font-medium hover:text-pink-600 transition-colors flex items-center gap-1"
                >
                  <span>Interactive Bio & Skills</span>
                  <Sparkles className="w-3 h-3 text-pink-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => openContactWithPrefill('Agentic AI & RAG Inquiry', 'AI Solution')}
                  className="hover:text-pink-600 transition-colors text-left"
                >
                  Agentic AI & Enterprise RAG
                </button>
              </li>
              <li>
                <button
                  onClick={() => openContactWithPrefill('Web Development Consultation', 'Website Development')}
                  className="hover:text-pink-600 transition-colors text-left"
                >
                  Custom Next.js & Full-Stack Apps
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="text-zinc-400 hover:text-zinc-800 text-[11px] pt-1"
                >
                  Admin Content Panel 🔒
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-zinc-900 text-sm tracking-wider uppercase">
              Glow Club VIP
            </h5>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Subscribe to get <strong>20% OFF</strong> your first order and exclusive skincare guides.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-pink-100/80 rounded-xl text-xs text-pink-800 font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4 fill-pink-600 text-pink-600" />
                <span>Welcome to Glow Club! Use code: GLOW20</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white text-xs rounded-full pl-4 pr-10 py-2.5 border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 block">We respect your privacy. No spam ever.</span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-4 border-t border-pink-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Glowora Beauty. Crafted by <strong>Muhammad Sufyan</strong> (Muhammad Sufyan Agentic AI RAG and Web Developer).</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openContactWithPrefill('Skincare Advice', 'Skincare Consultation')}
              className="hover:text-pink-600 transition-colors"
            >
              Contact Support
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPortfolioModalOpen(true)}
              className="hover:text-pink-600 transition-colors"
            >
              Developer Profile
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-pink-600 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
