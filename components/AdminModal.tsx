'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product, UserInquiry } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Save,
  Send,
  Plus,
  AlertTriangle,
  Upload,
  Link2,
  Copy,
  Check,
  Tag,
  DollarSign,
  Grid,
  List,
  ShieldAlert,
  Image as ImageIcon,
  Scissors,
  CalendarCheck
} from 'lucide-react';

const PRESET_SALON_IMAGES = [
  {
    name: 'Hydra Glow Facial Treatment (800x800)',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    dimensions: '800 × 800 px (1:1)'
  },
  {
    name: 'Keratin Hair Spa & Styling (800x800)',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    dimensions: '800 × 800 px (1:1)'
  },
  {
    name: 'Bridal & Party Glam Makeover (800x800)',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
    dimensions: '800 × 800 px (1:1)'
  },
  {
    name: 'Bridal Mehndi & Henna Art (800x800)',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=800&auto=format&fit=crop',
    dimensions: '800 × 800 px (1:1)'
  },
  {
    name: 'Luxury Body Massage & Spa (800x800)',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    dimensions: '800 × 800 px (1:1)'
  },
  {
    name: 'Aroma Scalp & Hair Therapy (800x800)',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    dimensions: '800 × 800 px (1:1)'
  }
];

export default function AdminModal() {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    inquiries,
    updateInquiryStatus,
    deleteInquiryItem,
    refreshInquiries,
    orders,
    updateOrderStatus,
    products,
    refreshProducts,
    addProduct,
    deleteProduct,
    settings,
    updateSiteSettings,
    uploadImage,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'services' | 'inquiries' | 'orders'>('services');
  
  // Inquiries State
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<UserInquiry | null>(null);
  const [replyText, setReplyText] = useState('');

  // Salon Services State
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('All');
  const [serviceViewMode, setServiceViewMode] = useState<'grid' | 'table'>('grid');
  
  // Add Service Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [detectedDimensions, setDetectedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [selectedImageSizeOption, setSelectedImageSizeOption] = useState<'800x800' | '800x1000' | '1200x800' | 'custom'>('800x800');
  const [customImageSizeText, setCustomImageSizeText] = useState('800 × 800 px');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newServiceForm, setNewServiceForm] = useState({
    id: '',
    name: '',
    category: 'Skin Care',
    subcategory: 'Facial & Aesthetic Care',
    imageSize: '800 × 800 px (Square 1:1)',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    price: '',
    originalPrice: '',
    volume: '60 mins Treatment',
    description: '',
    tag: 'New' as const,
    rating: 5.0,
    reviewsCount: 18
  });

  // Delete Service Modal & Case-Sensitive Verification State
  const [serviceToDelete, setServiceToDelete] = useState<Product | null>(null);
  const [deleteNameInput, setDeleteNameInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Direct Name/Code Lookup Delete Modal State
  const [isDirectDeleteOpen, setIsDirectDeleteOpen] = useState(false);
  const [directNameLookup, setDirectNameLookup] = useState('');

  if (!isAdminModalOpen) return null;

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.subject.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.message.toLowerCase().includes(inquirySearch.toLowerCase());
    const matchesFilter = inquiryFilter === 'all' || inq.status === inquiryFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter Salon Services
  const filteredServices = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(serviceSearch.toLowerCase())) ||
      p.description.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCat = serviceCategoryFilter === 'All' || p.category.toLowerCase() === serviceCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleSendReply = async () => {
    if (!selectedInquiry) return;
    await updateInquiryStatus(selectedInquiry.id, 'resolved', replyText);
    setSelectedInquiry(null);
    setReplyText('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'File Too Large', 'Maximum image size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        setDetectedDimensions({ width: img.width, height: img.height });
        setNewServiceForm((prev) => ({ ...prev, image: dataUrl }));
        addToast(
          'info',
          'Service Image Loaded',
          `Detected dimensions: ${img.width}×${img.height} px`
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newServiceForm.name.trim()) {
      addToast('error', 'Validation Error', 'Service Name is required.');
      return;
    }
    if (!newServiceForm.category.trim()) {
      addToast('error', 'Validation Error', 'Service Category is required.');
      return;
    }
    if (!newServiceForm.description.trim()) {
      addToast('error', 'Validation Error', 'Service Description is required.');
      return;
    }
    const numPrice = parseFloat(newServiceForm.price.toString());
    if (isNaN(numPrice) || numPrice <= 0) {
      addToast('error', 'Validation Error', 'Please enter a valid service price / fee.');
      return;
    }
    if (!newServiceForm.image.trim()) {
      addToast('error', 'Validation Error', 'Please provide a service image according to the specified size.');
      return;
    }

    setIsSubmittingService(true);
    try {
      const serviceId = newServiceForm.id.trim() || `srv-${Date.now()}`;
      let finalImageUrl = newServiceForm.image.trim();

      if (finalImageUrl.startsWith('data:image')) {
        const uploadRes = await uploadImage(finalImageUrl, `product:${serviceId}`);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      }

      const res = await addProduct({
        id: serviceId,
        name: newServiceForm.name.trim(),
        description: newServiceForm.description.trim(),
        price: numPrice,
        originalPrice: newServiceForm.originalPrice ? parseFloat(newServiceForm.originalPrice.toString()) : undefined,
        category: newServiceForm.category,
        subcategory: newServiceForm.subcategory,
        image: finalImageUrl,
        volume: newServiceForm.volume.trim() || '60 mins Session',
        tag: 'New',
        inStock: true,
        rating: 5.0,
        reviewsCount: 1,
        benefits: ['Certified Senior Beauticians', '100% Organic & Hypoallergenic Products', 'Instant Visible Glow & Polish']
      });

      if (res.success) {
        setIsAddModalOpen(false);
        // Reset form
        setNewServiceForm({
          id: '',
          name: '',
          category: 'Skin Care',
          subcategory: 'Facial & Aesthetic Care',
          imageSize: '800 × 800 px (Square 1:1)',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
          price: '',
          originalPrice: '',
          volume: '60 mins Treatment',
          description: '',
          tag: 'New' as const,
          rating: 5.0,
          reviewsCount: 1
        });
        setDetectedDimensions(null);
      }
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    if (deleteNameInput !== serviceToDelete.name) {
      addToast(
        'error',
        'Case-Sensitive Mismatch',
        `Verification failed: Entered name "${deleteNameInput}" does not match exact service name "${serviceToDelete.name}".`
      );
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteProduct(serviceToDelete.id, deleteNameInput);
      if (res.success) {
        setServiceToDelete(null);
        setDeleteNameInput('');
        setIsDirectDeleteOpen(false);
        setDirectNameLookup('');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return dateStr.split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const directFoundService = products.find(
    (p) =>
      p.name.toLowerCase() === directNameLookup.trim().toLowerCase() ||
      p.id.toLowerCase() === directNameLookup.trim().toLowerCase()
  );

  return (
    <AnimatePresence>
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAdminModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-pink-100 flex flex-col"
          >
            {/* Top Header Bar */}
            <div className="px-6 py-4 border-b border-pink-100 bg-pink-50/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-md">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-zinc-900 text-lg flex items-center gap-2">
                    <span>Women Salon & Aesthetic Studio Control Panel</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                      Salon Live Sync
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Manage salon services, add treatments with image size specifications, and delete services by verified name.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    refreshInquiries();
                    refreshProducts();
                    addToast('info', 'Refreshed', 'Salon database synchronized live.');
                  }}
                  className="p-2 rounded-xl bg-white border border-pink-100 text-zinc-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  title="Refresh All Salon Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white border border-pink-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 border-b border-pink-100 bg-white flex gap-6 text-xs font-bold uppercase tracking-wider shrink-0 overflow-x-auto">
              <button
                id="admin-tab-services"
                onClick={() => setActiveTab('services')}
                className={`py-3.5 flex items-center gap-2 relative transition-colors whitespace-nowrap ${
                  activeTab === 'services' ? 'text-pink-600' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Salon Services ({products.length})</span>
                <span className="px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
                  Women Salon
                </span>
                {activeTab === 'services' && (
                  <motion.div
                    layoutId="adminTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                  />
                )}
              </button>

              <button
                id="admin-tab-inquiries"
                onClick={() => setActiveTab('inquiries')}
                className={`py-3.5 flex items-center gap-2 relative transition-colors whitespace-nowrap ${
                  activeTab === 'inquiries' ? 'text-pink-600' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries & Consultations ({inquiries.length})</span>
                {inquiries.filter((i) => i.status === 'new').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </span>
                )}
                {activeTab === 'inquiries' && (
                  <motion.div
                    layoutId="adminTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                  />
                )}
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-pink-50/20">
              {/* ======================================================== */}
              {/* SALON SERVICES SECTION (Women Salon)                     */}
              {/* ======================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-5">
                  {/* Top Salon Service Actions Bar */}
                  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h4 className="font-serif font-bold text-zinc-900 text-lg">
                          Women Salon Services & Treatments
                        </h4>
                        <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2.5 py-0.5 rounded-full">
                          {products.length} Services Live
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 max-w-xl">
                        Add treatments (Skin, Hair, Makeup, Mehndi, Body Care) with requested image sizes, price, and description. To delete a service, enter its complete name.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        id="btn-open-add-service"
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Salon Service</span>
                      </button>

                      <button
                        id="btn-delete-service-by-name"
                        onClick={() => {
                          setIsDirectDeleteOpen(true);
                          setDirectNameLookup('');
                        }}
                        className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Delete Service by Name</span>
                      </button>

                      <div className="flex items-center bg-pink-50 p-1 rounded-2xl border border-pink-100">
                        <button
                          onClick={() => setServiceViewMode('grid')}
                          className={`p-1.5 rounded-xl transition-colors ${
                            serviceViewMode === 'grid' ? 'bg-white text-pink-600 shadow-xs' : 'text-zinc-500'
                          }`}
                          title="Grid View"
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setServiceViewMode('table')}
                          className={`p-1.5 rounded-xl transition-colors ${
                            serviceViewMode === 'table' ? 'bg-white text-pink-600 shadow-xs' : 'text-zinc-500'
                          }`}
                          title="Table View"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search and Category Filter Strip */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-pink-100 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search salon service name, code, category..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-pink-50/40 border border-pink-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                      {[
                        'All',
                        'Skin Care',
                        'Hair Care',
                        'Makeup',
                        'Mehndi Designs',
                        'Body Care',
                        'Health & Wellness'
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setServiceCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors ${
                            serviceCategoryFilter === cat
                              ? 'bg-pink-600 text-white shadow-xs'
                              : 'bg-pink-50/60 text-zinc-600 hover:bg-pink-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Services Grid or Table */}
                  {filteredServices.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-pink-100 text-center space-y-3">
                      <Sparkles className="w-12 h-12 text-pink-300 mx-auto" />
                      <h4 className="font-serif font-bold text-zinc-900 text-base">
                        No salon services match your search
                      </h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Search by service name, or click &quot;Add Salon Service&quot; to add a new salon treatment.
                      </p>
                      <button
                        onClick={() => {
                          setServiceSearch('');
                          setServiceCategoryFilter('All');
                        }}
                        className="px-4 py-2 bg-pink-50 text-pink-700 text-xs font-bold rounded-xl hover:bg-pink-100 transition-colors"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : serviceViewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="bg-white rounded-3xl border border-pink-100 p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative"
                        >
                          <div>
                            {/* Service Image Container */}
                            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-pink-50 mb-3">
                              <img
                                src={srv.image}
                                alt={srv.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span>{srv.id}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode(srv.id);
                                  }}
                                  title="Copy Service Code"
                                  className="text-pink-300 hover:text-white"
                                >
                                  {copiedCode === srv.id ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>

                              <span className="absolute bottom-2 right-2 bg-pink-600/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {srv.volume || '60 mins'}
                              </span>
                            </div>

                            {/* Category & Service Name */}
                            <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider block mb-1">
                              {srv.category} {srv.subcategory ? `• ${srv.subcategory}` : ''}
                            </span>
                            <h5 className="font-serif font-bold text-zinc-900 text-sm leading-snug mb-1.5 line-clamp-2">
                              {srv.name}
                            </h5>
                            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                              {srv.description}
                            </p>
                          </div>

                          {/* Price & Actions Bottom */}
                          <div className="pt-3 border-t border-pink-50 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-zinc-400 block">Service Fee</span>
                              <span className="font-serif font-bold text-base text-zinc-900">
                                ${srv.price.toFixed(2)}
                              </span>
                            </div>

                            <button
                              id={`btn-delete-service-${srv.id}`}
                              onClick={() => {
                                setServiceToDelete(srv);
                                setDeleteNameInput('');
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100 transition-colors flex items-center gap-1"
                              title="Delete Service (requires exact name entry)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Table View */
                    <div className="bg-white rounded-3xl border border-pink-100 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-pink-50/60 border-b border-pink-100 text-zinc-700 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="p-3.5 pl-5">Salon Service Name & Image</th>
                              <th className="p-3.5">Service Code</th>
                              <th className="p-3.5">Category</th>
                              <th className="p-3.5">Service Price</th>
                              <th className="p-3.5">Session Duration</th>
                              <th className="p-3.5 pr-5 text-right">Delete Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-pink-50">
                            {filteredServices.map((srv) => (
                              <tr key={srv.id} className="hover:bg-pink-50/30 transition-colors">
                                <td className="p-3.5 pl-5">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={srv.image}
                                      alt={srv.name}
                                      className="w-12 h-12 rounded-xl object-cover bg-pink-50 shrink-0"
                                    />
                                    <div>
                                      <p className="font-bold text-zinc-900 text-xs">{srv.name}</p>
                                      <p className="text-[11px] text-zinc-500 line-clamp-1 max-w-xs">
                                        {srv.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <div className="inline-flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-lg font-mono text-[11px] text-zinc-800">
                                    <span>{srv.id}</span>
                                    <button
                                      onClick={() => handleCopyCode(srv.id)}
                                      className="text-zinc-400 hover:text-zinc-800"
                                      title="Copy Code"
                                    >
                                      {copiedCode === srv.id ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className="text-[11px] font-semibold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                                    {srv.category}
                                  </span>
                                </td>
                                <td className="p-3.5 font-serif font-bold text-zinc-900 text-sm">
                                  ${srv.price.toFixed(2)}
                                </td>
                                <td className="p-3.5 text-zinc-500 text-[11px]">
                                  {srv.volume || '60 mins'}
                                </td>
                                <td className="p-3.5 pr-5 text-right">
                                  <button
                                    onClick={() => {
                                      setServiceToDelete(srv);
                                      setDeleteNameInput('');
                                    }}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100 transition-colors inline-flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* INQUIRIES SECTION                                        */}
              {/* ======================================================== */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-pink-100 shadow-xs">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search inquiries & consultations..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-pink-50/40 border border-pink-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {(['all', 'new', 'in_progress', 'resolved', 'archived'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setInquiryFilter(filter)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold capitalize whitespace-nowrap transition-colors ${
                            inquiryFilter === filter
                              ? 'bg-pink-600 text-white shadow-xs'
                              : 'bg-pink-50/60 text-zinc-600 hover:bg-pink-100'
                          }`}
                        >
                          {filter.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInquiries.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-zinc-400 text-xs">
                        No customer inquiries found.
                      </div>
                    ) : (
                      filteredInquiries.map((inq) => {
                        const statusColor =
                          inq.status === 'new'
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                            : inq.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : inq.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200';

                        return (
                          <div
                            key={inq.id}
                            className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${statusColor}`}>
                                  {inq.status.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  {formatDate(inq.createdAt)}
                                </span>
                              </div>

                              <h4 className="font-bold text-zinc-900 text-sm mb-1">{inq.name}</h4>
                              <p className="text-xs text-pink-600 font-medium mb-2">{inq.serviceType}</p>
                              <p className="text-xs text-zinc-700 font-semibold mb-1 line-clamp-1">
                                {inq.subject}
                              </p>
                              <p className="text-xs text-zinc-500 line-clamp-3 mb-3 leading-relaxed">
                                {inq.message}
                              </p>

                              {inq.replySent && (
                                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 mb-3">
                                  <strong>Reply sent:</strong> {inq.replySent}
                                </div>
                              )}
                            </div>

                            <div className="pt-3 border-t border-pink-50 flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, 'new')}
                                  title="Mark as New"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, 'in_progress')}
                                  title="Mark In Progress"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, 'resolved')}
                                  title="Mark Resolved"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => updateInquiryStatus(inq.id, 'archived')}
                                  title="Archive"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedInquiry(inq);
                                    setReplyText(inq.replySent || '');
                                  }}
                                  className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Reply</span>
                                </button>
                                <button
                                  onClick={() => deleteInquiryItem(inq.id)}
                                  className="p-1.5 rounded-lg text-zinc-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* ORDERS & BOOKINGS SECTION                                */}
              {/* ======================================================== */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-pink-100 text-center">
                      <CalendarCheck className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                      <h4 className="font-serif font-bold text-zinc-900 text-lg mb-1">
                        No salon service bookings yet
                      </h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        When clients book a salon appointment or treatment session online, live reservation details will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-zinc-900 text-sm">Booking #{order.id}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase">
                                {order.status}
                              </span>
                              <span className="text-xs text-zinc-400">{formatDate(order.createdAt)}</span>
                            </div>
                            <p className="text-xs text-zinc-600">
                              <strong>Client:</strong> {order.customerName} ({order.customerEmail} • {order.customerPhone})
                            </p>
                            <p className="text-xs text-zinc-500">
                              <strong>Location / Address:</strong> {order.shippingAddress}, {order.city}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {order.items.map((item, i) => (
                                <span key={i} className="text-[11px] bg-pink-50 text-zinc-700 px-2 py-0.5 rounded-md border border-pink-100">
                                  {item.quantity}x {item.productName} (${item.price})
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="text-[10px] text-zinc-400 uppercase">Total Fee</p>
                              <p className="font-serif font-bold text-base text-pink-600">
                                ${order.totalAmount.toFixed(2)}
                              </p>
                              <p className="text-[10px] text-zinc-500">{order.paymentMethod}</p>
                            </div>

                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="bg-pink-50 border border-pink-200 text-xs font-semibold rounded-xl px-3 py-2 text-zinc-800 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Confirmed</option>
                              <option value="Shipped">Completed</option>
                              <option value="Delivered">Fulfilled</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* ADD SALON SERVICE MODAL DIALOG                           */}
            {/* ======================================================== */}
            {isAddModalOpen && (
              <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-pink-100 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                    <div>
                      <h4 className="font-serif font-bold text-zinc-900 text-lg flex items-center gap-2">
                        <span>Add New Salon Service</span>
                        <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full uppercase">
                          Women Salon
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Enter the service name, category, image size, price, and description.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-pink-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddServiceSubmit} className="space-y-4">
                    {/* 1. SERVICE NAME */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1">
                        1. Service Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newServiceForm.name}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                        placeholder="e.g. Clover Hydra Collagen Glow Facial / Bridal Velvet Makeover"
                        className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    {/* 2. SERVICE CATEGORY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          2. Service Category *
                        </label>
                        <select
                          value={newServiceForm.category}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                          className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                        >
                          <option value="Skin Care">Skin Care & Facials</option>
                          <option value="Hair Care">Hair Care & Styling</option>
                          <option value="Makeup">Bridal & Party Makeup</option>
                          <option value="Mehndi Designs">Mehndi & Henna Art</option>
                          <option value="Body Care">Body Care & Spa Treatments</option>
                          <option value="Health & Wellness">Health & Wellness Therapies</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Sub-Category / Treatment Type
                        </label>
                        <input
                          type="text"
                          value={newServiceForm.subcategory}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, subcategory: e.target.value })}
                          placeholder="e.g. Anti-Aging / Hair Smoothening"
                          className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 3. SERVICE IMAGE SIZE & PHOTO */}
                    <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-pink-600" />
                          <span>3. Service Image Size & Photo *</span>
                        </label>
                        <span className="text-[10px] text-pink-700 font-semibold">
                          Recommended: 800×800 px
                        </span>
                      </div>

                      {/* Image Size Selection */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { key: '800x800', label: '800 × 800 px (1:1)' },
                          { key: '800x1000', label: '800 × 1000 px (4:5)' },
                          { key: '1200x800', label: '1200 × 800 px (3:2)' },
                          { key: 'custom', label: 'Custom Dimension' }
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              setSelectedImageSizeOption(opt.key as any);
                              if (opt.key !== 'custom') {
                                setCustomImageSizeText(opt.label);
                              }
                            }}
                            className={`p-2 rounded-xl text-center text-[11px] font-semibold transition-all border ${
                              selectedImageSizeOption === opt.key
                                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                                : 'bg-white text-zinc-700 border-pink-100 hover:border-pink-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {selectedImageSizeOption === 'custom' && (
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                            Enter Custom Image Size Specifications:
                          </label>
                          <input
                            type="text"
                            value={customImageSizeText}
                            onChange={(e) => setCustomImageSizeText(e.target.value)}
                            placeholder="e.g. 1080 × 1080 px High-Res"
                            className="w-full bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* URL input or Upload button */}
                      <div className="flex gap-2 pt-1">
                        <div className="relative flex-1">
                          <Link2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            value={newServiceForm.image}
                            onChange={(e) => setNewServiceForm({ ...newServiceForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/... or paste image URL"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-pink-200 rounded-xl focus:ring-1 focus:ring-pink-500 focus:outline-none"
                          />
                        </div>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/*"
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                      </div>

                      {/* Salon Presets */}
                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                          Or select a studio salon photo preset:
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {PRESET_SALON_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setNewServiceForm({ ...newServiceForm, image: preset.url });
                                setDetectedDimensions({ width: 800, height: 800 });
                              }}
                              className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all ${
                                newServiceForm.image === preset.url
                                  ? 'border-pink-600 ring-2 ring-pink-300 scale-95'
                                  : 'border-pink-100 hover:border-pink-300 opacity-75 hover:opacity-100'
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Image Preview */}
                      {newServiceForm.image && (
                        <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-pink-200">
                          <img
                            src={newServiceForm.image}
                            alt="Preview"
                            className="w-14 h-14 rounded-lg object-cover border border-pink-100 bg-pink-50"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-zinc-800 block">Service Photo Preview</span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                              {detectedDimensions
                                ? `${detectedDimensions.width} × ${detectedDimensions.height} px (Detected)`
                                : customImageSizeText}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. SERVICE PRICE & DURATION */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          4. Service Price ($ USD) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newServiceForm.price}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                          placeholder="49.99"
                          className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Session Duration / Time
                        </label>
                        <input
                          type="text"
                          value={newServiceForm.volume}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, volume: e.target.value })}
                          placeholder="60 mins / 90 mins"
                          className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Service Code (SKU)
                        </label>
                        <input
                          type="text"
                          value={newServiceForm.id}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, id: e.target.value })}
                          placeholder="srv-hydra-glow"
                          className="w-full font-mono bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 5. SERVICE DESCRIPTION */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1">
                        5. Service Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newServiceForm.description}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                        placeholder="Detailed treatment procedure, skin/hair preparation, active ingredients used, and expected glow/styling results..."
                        className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        id="btn-submit-add-service"
                        type="submit"
                        disabled={isSubmittingService}
                        className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isSubmittingService ? 'Adding Service...' : 'Add Salon Service'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* DIRECT DELETE BY SERVICE NAME MODAL                      */}
            {/* ======================================================== */}
            {isDirectDeleteOpen && (
              <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                    <div className="flex items-center gap-2 text-rose-600">
                      <ShieldAlert className="w-5 h-5" />
                      <h4 className="font-serif font-bold text-zinc-900 text-base">
                        Delete Salon Service by Name
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsDirectDeleteOpen(false)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Enter the exact name of the salon service (e.g. &quot;Clover Hydra Glow Facial&quot; or service code). Enter its complete case-sensitive name to permanently delete it from the database.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Search Service Name or Code:
                    </label>
                    <input
                      type="text"
                      value={directNameLookup}
                      onChange={(e) => setDirectNameLookup(e.target.value)}
                      placeholder="Type salon service name..."
                      className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  {directFoundService ? (
                    <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={directFoundService.image}
                          alt={directFoundService.name}
                          className="w-14 h-14 rounded-xl object-cover bg-white border border-rose-200"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-rose-700 uppercase">Service Found</span>
                          <h5 className="font-bold text-zinc-900 text-xs">{directFoundService.name}</h5>
                          <p className="text-[11px] text-zinc-500 font-mono">{directFoundService.id} • ${directFoundService.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setServiceToDelete(directFoundService);
                          setDeleteNameInput('');
                          setIsDirectDeleteOpen(false);
                        }}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Proceed to Name Verification & Delete</span>
                      </button>
                    </div>
                  ) : directNameLookup.trim() ? (
                    <div className="p-3 bg-zinc-100 rounded-xl text-center text-xs text-zinc-500">
                      No salon service found with &quot;{directNameLookup}&quot;
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* CASE-SENSITIVE SERVICE NAME VERIFICATION DELETE DIALOG    */}
            {/* ======================================================== */}
            {serviceToDelete && (
              <div className="fixed inset-0 z-70 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-200 space-y-5"
                >
                  <div className="flex items-start justify-between border-b border-rose-100 pb-3">
                    <div className="flex items-center gap-2 text-rose-600">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-zinc-900 text-base">
                          Confirm Salon Service Deletion
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Permanent removal from salon service menu
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setServiceToDelete(null)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Target Service Card */}
                  <div className="flex items-center gap-3 p-3.5 bg-rose-50/50 rounded-2xl border border-rose-200">
                    <img
                      src={serviceToDelete.image}
                      alt={serviceToDelete.name}
                      className="w-14 h-14 rounded-xl object-cover bg-white border border-rose-200 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-bold inline-block mb-0.5">
                        Code: {serviceToDelete.id}
                      </span>
                      <h5 className="font-bold text-zinc-900 text-xs truncate">
                        {serviceToDelete.name}
                      </h5>
                      <span className="text-[11px] text-zinc-500 font-semibold">
                        ${serviceToDelete.price.toFixed(2)} • {serviceToDelete.category}
                      </span>
                    </div>
                  </div>

                  {/* Case-Sensitive Verification Input */}
                  <div className="space-y-2">
                    <div className="text-xs text-zinc-700">
                      <p className="font-semibold text-zinc-900 mb-1">
                        To delete this salon service, please enter its complete name below:
                      </p>
                      <div className="p-2.5 bg-zinc-100 rounded-xl border border-zinc-200 font-mono text-xs text-zinc-900 select-all font-semibold">
                        {serviceToDelete.name}
                      </div>
                    </div>

                    <input
                      id="input-delete-service-name-verification"
                      type="text"
                      value={deleteNameInput}
                      onChange={(e) => setDeleteNameInput(e.target.value)}
                      placeholder="Type complete, case-sensitive service name..."
                      className={`w-full p-3 text-xs rounded-xl border focus:outline-none transition-all ${
                        deleteNameInput === serviceToDelete.name
                          ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500 text-zinc-900 font-medium'
                          : deleteNameInput.length > 0
                          ? 'border-rose-400 bg-rose-50/20 text-zinc-900'
                          : 'border-pink-200 bg-pink-50/30'
                      }`}
                    />

                    {/* Live Match Feedback Badge */}
                    <div className="text-[11px]">
                      {deleteNameInput === serviceToDelete.name ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Exact service name matched! You may now permanently delete this service.
                        </span>
                      ) : deleteNameInput.length > 0 ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Name must match exact spelling and case sensitivity.
                        </span>
                      ) : (
                        <span className="text-zinc-400">
                          Complete name verification required before deletion is permitted.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="pt-3 border-t border-rose-100 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => setServiceToDelete(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-confirm-delete-service"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting || deleteNameInput !== serviceToDelete.name}
                      className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete Service'}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Reply Modal Sub-Dialog */}
            {selectedInquiry && (
              <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-pink-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-zinc-900 text-base">Reply to Inquiry</h4>
                      <p className="text-xs text-zinc-500">{selectedInquiry.name} ({selectedInquiry.email})</p>
                    </div>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-pink-50/50 rounded-xl text-xs text-zinc-700">
                    <p><strong>Subject:</strong> {selectedInquiry.subject}</p>
                    <p className="mt-1 text-zinc-600">{selectedInquiry.message}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Response Note / Email Text</label>
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type reply here..."
                      className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send & Resolve</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
