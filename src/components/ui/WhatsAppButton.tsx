
import React from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

const WhatsAppButton = ({
  phoneNumber,
  message = 'Hello, I am interested in your property listing',
  children,
  className,
}: WhatsAppButtonProps) => {
  // Clean the phone number (remove spaces, dashes, etc.)
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('whatsapp-button', className)}
    >
      <Phone size={18} />
      {children || 'Contact via WhatsApp'}
    </a>
  );
};

export default WhatsAppButton;
