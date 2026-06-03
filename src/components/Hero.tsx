"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Upload, FileText, Phone, Palette } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroProps {
  onQuoteClick?: () => void;
  onUploadClick?: () => void;
}

export default function Hero({ onQuoteClick, onUploadClick }: HeroProps) {
  const { trackWhatsAppClick, trackPhoneClick } = useAnalytics();
  const colorRef = useRef<HTMLInputElement>(null);
  const [bgColor, setBgColor] = useState<string>("rgb(123, 147, 204)");

  useEffect(() => {
    const saved = localStorage.getItem("heroBgColor");
    if (saved) setBgColor(saved);
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    // Конвертируем hex в rgb для консистентности
    const rgb = hexToRgb(color);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    localStorage.setItem("heroBgColor", rgbStr);
    setBgColor(rgbStr);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 15, g: 23, b: 42 };
  };

  const badges = [
    "Оптовые поставки",
    "Работа с юрлицами",
    "Подбор по ГОСТ / DIN / ISO",
    "Документы и безналичная оплата",
    "Доставка по Казахстану",
    "Обработка заявки за 30 мин",
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-600/30 text-orange-400 text-xs font-medium px-3 py-1.5 mb-6">
              Алматы — поставки по всему Казахстану
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              Крепеж оптом для компаний в Алматы и по Казахстану
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Болты, гайки, анкера, шайбы, шпильки, такелаж и строительный крепеж.
              Пришлите список — проверим наличие, подберём аналоги и менеджер свяжется для уточнения.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-medium text-base transition-colors min-h-[48px]"
              >
                <MessageCircle size={20} />
                Написать в WhatsApp
              </a>
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 font-medium text-base transition-colors min-h-[48px]"
              >
                <Upload size={20} />
                Загрузить список
              </button>
              <button
                onClick={onQuoteClick}
                className="flex items-center gap-2 border border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3.5 font-medium text-base transition-colors min-h-[48px]"
              >
                <FileText size={20} />
                Оставить заявку
              </button>
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                onClick={trackPhoneClick}
                className="flex items-center gap-2 border border-slate-500 text-slate-300 hover:border-slate-300 hover:text-white px-6 py-3.5 font-medium text-base transition-colors min-h-[48px]"
              >
                <Phone size={20} />
                Позвонить
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-6">
            <div className="bg-slate-800 border border-slate-700 p-8">
              <div className="text-5xl font-black text-orange-500 mb-2">5000+</div>
              <div className="text-white font-medium text-lg">позиций на складе</div>
              <div className="text-slate-400 text-sm mt-1">Всегда в наличии в Алматы</div>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-8">
              <div className="text-5xl font-black text-orange-500 mb-2">30 мин</div>
              <div className="text-white font-medium text-lg">среднее время ответа на заявку</div>
              <div className="text-slate-400 text-sm mt-1">Отправьте список — ответим быстро</div>
            </div>
          </div>
        </div>

        {/* ВРЕМЕННО: выбор цвета фона */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-slate-900/70 px-3 py-2 rounded">
          <Palette size={18} className="text-white" />
          <input
            ref={colorRef}
            type="color"
            value={bgColor === "rgb(15, 23, 42)" ? "#0f172a" : bgColor}
            onChange={handleColorChange}
            title="Выбрать цвет фона"
            className="w-8 h-8 cursor-pointer border-0"
          />
        </div>
      </div>
    </section>
  );
}
