"use client";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface StickyMobileCTAProps {
  onQuoteClick?: () => void;
}

export default function StickyMobileCTA({ onQuoteClick }: StickyMobileCTAProps) {
  const { trackWhatsAppClick, trackPhoneClick } = useAnalytics();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900 border-t border-slate-700">
      <div className="grid grid-cols-3">
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick()}
          className="flex flex-col items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-3.5 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>
        <a
          href={`tel:${COMPANY.phoneRaw}`}
          onClick={() => trackPhoneClick()}
          className="flex flex-col items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-white py-3.5 transition-colors"
        >
          <Phone size={20} />
          <span className="text-xs font-medium">Позвонить</span>
        </a>
        <button
          onClick={onQuoteClick}
          className="flex flex-col items-center justify-center gap-1 bg-orange-600 hover:bg-orange-700 text-white py-3.5 transition-colors"
        >
          <FileText size={20} />
          <span className="text-xs font-medium">Заявка</span>
        </button>
      </div>
    </div>
  );
}
