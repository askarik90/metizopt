"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle, Phone } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeaderProps {
  onQuoteClick?: () => void;
}

export default function Header({ onQuoteClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { trackWhatsAppClick, trackPhoneClick } = useAnalytics();

  const nav = [
    { href: "/catalog", label: "Каталог" },
    { href: "/#how", label: "Как заказать" },
    { href: "/delivery", label: "Доставка" },
    { href: "/about", label: "О компании" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-black text-xl tracking-tighter uppercase">
              Метиз<span className="text-orange-500">Опт</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick()}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <button
              onClick={onQuoteClick}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Оставить заявку
            </button>
          </div>

          {/* Mobile burger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              onClick={trackPhoneClick}
              className="text-slate-300 hover:text-white p-2"
            >
              <Phone size={20} />
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-700 px-4 py-4 space-y-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-white font-medium py-1"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick()}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 text-sm font-medium"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <button
              onClick={() => { setMenuOpen(false); onQuoteClick?.(); }}
              className="flex-1 bg-orange-600 text-white py-2.5 text-sm font-medium"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
