"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Upload, FileText, Phone, Image } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroProps {
  onQuoteClick?: () => void;
  onUploadClick?: () => void;
}

export default function Hero({ onQuoteClick, onUploadClick }: HeroProps) {
  const { trackWhatsAppClick, trackPhoneClick } = useAnalytics();
  const fileRef = useRef<HTMLInputElement>(null);
  const [bg, setBg] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("heroBg");
    if (saved) setBg(saved);
  }, []);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.width = 1920;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 1920, 1200);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        try {
          localStorage.setItem("heroBg", compressed);
          setBg(compressed);
        } catch {
          alert("Картинка слишком большая. Выберите меньший файл.");
        }
      };
      img.src = (evt.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
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
      className="relative bg-slate-900 overflow-hidden"
      style={{
        backgroundImage: bg
          ? `url('${bg}')`
          : "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: bg ? "cover" : "28px 28px",
        backgroundPosition: bg ? "center" : "0 0",
        backgroundColor: "rgb(15, 23, 42)",
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

        {/* ВРЕМЕННО: кнопка загрузки фона */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => fileRef.current?.click()}
            title="Загрузить фон (временно)"
            className="bg-slate-700/70 hover:bg-slate-600/70 text-white p-2 transition-colors"
          >
            <Image size={20} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleBgUpload}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
