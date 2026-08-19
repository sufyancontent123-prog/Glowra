/**
 * WhatsApp Integration Utilities
 * Generates direct WhatsApp chat, appointment booking, and order links.
 */

export const DEFAULT_WHATSAPP_NUMBER = '923085235952'; // 03085235952
export const DISPLAY_WHATSAPP_NUMBER = '+92 308 5235952';

export interface WhatsAppBookingParams {
  phone?: string;
  serviceName: string;
  servicePrice?: number;
  duration?: string;
  customerName?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface WhatsAppOrderParams {
  phone?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  city?: string;
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Creates a direct wa.me link with encoded message
 */
export function createWhatsAppLink(message: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  const cleanPhone = cleanPhoneNumber(phone) || DEFAULT_WHATSAPP_NUMBER;
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Creates a WhatsApp booking message link for salon services & makeovers
 */
export function getServiceBookingWhatsAppLink(params: WhatsAppBookingParams): string {
  const {
    phone = DEFAULT_WHATSAPP_NUMBER,
    serviceName,
    servicePrice,
    duration,
    customerName,
    preferredDate,
    preferredTime,
    notes
  } = params;

  let msg = `🌸 *GLOWORA SALON APPOINTMENT BOOKING* 🌸\n\n`;
  msg += `Hello! I would like to book a salon appointment for:\n\n`;
  msg += `✨ *Service:* ${serviceName}\n`;
  if (servicePrice !== undefined) {
    msg += `💰 *Price:* $${servicePrice.toFixed(2)}\n`;
  }
  if (duration) {
    msg += `⏱ *Duration:* ${duration}\n`;
  }
  
  if (customerName) {
    msg += `👤 *Client Name:* ${customerName}\n`;
  }
  if (preferredDate) {
    msg += `📅 *Preferred Date:* ${preferredDate}\n`;
  }
  if (preferredTime) {
    msg += `⏰ *Preferred Time:* ${preferredTime}\n`;
  }
  if (notes) {
    msg += `📝 *Special Requests / Notes:* ${notes}\n`;
  }

  msg += `\nPlease let me know available slots and confirm my booking. Thank you!`;

  return createWhatsAppLink(msg, phone);
}

/**
 * Creates a WhatsApp order message link for products & carts
 */
export function getCartOrderWhatsAppLink(params: WhatsAppOrderParams): string {
  const {
    phone = DEFAULT_WHATSAPP_NUMBER,
    items,
    totalAmount,
    customerName,
    customerPhone,
    address,
    city
  } = params;

  let msg = `🛍️ *GLOWORA BEAUTY & SALON ORDER* 🛍️\n\n`;
  msg += `Hello! I want to place an order / confirm booking for:\n\n`;
  
  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.name}* x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  msg += `\n💵 *Total Amount:* $${totalAmount.toFixed(2)}\n`;

  if (customerName) {
    msg += `👤 *Customer Name:* ${customerName}\n`;
  }
  if (customerPhone) {
    msg += `📱 *Phone:* ${customerPhone}\n`;
  }
  if (address) {
    msg += `📍 *Delivery / Location:* ${address}${city ? `, ${city}` : ''}\n`;
  }

  msg += `\nPlease confirm my order details and dispatch / booking confirmation. Thank you!`;

  return createWhatsAppLink(msg, phone);
}

/**
 * Creates a general inquiry WhatsApp link
 */
export function getGeneralInquiryWhatsAppLink(subject?: string, name?: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  let msg = `✨ *GLOWORA SALON & BEAUTY CONSULTATION* ✨\n\n`;
  msg += `Hello! I would like to consult regarding ${subject || 'salon appointments and skincare services'}.\n`;
  if (name) {
    msg += `My Name: ${name}\n`;
  }
  msg += `\nPlease assist me with booking information and consultation. Thank you!`;

  return createWhatsAppLink(msg, phone);
}
