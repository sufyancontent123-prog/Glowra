'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, Sparkles } from 'lucide-react';
import { getCartOrderWhatsAppLink, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function CheckoutModal() {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartTotal,
    discountCode,
    discountPercent,
    createOrder
  } = useStore();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: 'Faisalabad',
    paymentMethod: 'Cash on Delivery' as 'Cash on Delivery' | 'Credit Card' | 'JazzCash / EasyPaisa'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const isFreeShipping = cartTotal >= 50;
  const shippingFee = isFreeShipping ? 0 : 4.99;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.shippingAddress) return;

    setIsSubmitting(true);
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    const success = await createOrder({
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: formData.shippingAddress,
      city: formData.city,
      items: orderItems,
      totalAmount: grandTotal,
      paymentMethod: formData.paymentMethod
    });

    setIsSubmitting(false);
    if (success) {
      setOrderComplete(true);
    }
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setOrderComplete(false);
  };

  return (
    <AnimatePresence>
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-pink-100 p-6 sm:p-8"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {orderComplete ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-zinc-900">
                Thank You for Your Order!
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                Your order has been recorded in our system. You will receive an email confirmation at{' '}
                <strong className="text-zinc-900">{formData.customerEmail}</strong> with tracking details.
              </p>
              <div className="p-4 bg-pink-50/70 rounded-2xl max-w-md mx-auto border border-pink-100 text-xs text-zinc-600 space-y-1">
                <p><strong>Customer:</strong> {formData.customerName}</p>
                <p><strong>Total Amount:</strong> ${grandTotal.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
                <p><strong>Estimated Delivery:</strong> 2-3 Business Days</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const link = getCartOrderWhatsAppLink({
                      items: cart.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
                      totalAmount: grandTotal,
                      customerName: formData.customerName,
                      customerPhone: formData.customerPhone,
                      address: formData.shippingAddress,
                      city: formData.city
                    });
                    window.open(link, '_blank');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.016.82 3.125.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm9.969 5.766c0 5.485-4.464 9.949-9.969 9.949-1.748 0-3.385-.453-4.811-1.246l-5.22 1.359 1.385-5.064c-.87-1.487-1.354-3.218-1.354-5.058 0-5.485 4.464-9.949 9.969-9.949 5.506 0 9.969 4.464 9.969 9.949z" />
                  </svg>
                  <span>Chat &amp; Track on WhatsApp</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
                >
                  Back to Store
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-pink-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-zinc-900">
                    Secure Fast Checkout
                  </h3>
                  <p className="text-xs text-zinc-500">Enter your delivery details below</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha Malik"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-pink-50/30 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full bg-pink-50/30 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full bg-pink-50/30 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">City / Region</label>
                    <input
                      type="text"
                      placeholder="Faisalabad / Lahore / Global"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-pink-50/30 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Street Address & Delivery Details *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Apartment #, Street, Landmark..."
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full bg-pink-50/30 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Cash on Delivery', icon: Banknote, label: 'Cash On Delivery' },
                      { id: 'Credit Card', icon: CreditCard, label: 'Card Payment' },
                      { id: 'JazzCash / EasyPaisa', icon: Sparkles, label: 'JazzCash / EasyPaisa' }
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = formData.paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-[11px] font-medium ${
                            isSelected
                              ? 'border-pink-600 bg-pink-50/80 text-pink-700 font-bold shadow-xs'
                              : 'border-pink-100 bg-white text-zinc-600 hover:border-pink-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-600' : 'text-zinc-400'}`} />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order total recap */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-xs space-y-1">
                  <div className="flex justify-between text-zinc-600">
                    <span>Items ({cart.length})</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({discountCode})</span>
                      <span>-{discountPercent}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span>{isFreeShipping ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-serif font-bold text-zinc-900 text-sm pt-2 border-t border-pink-200">
                    <span>Total Due</span>
                    <span className="text-pink-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
