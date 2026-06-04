"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Upload, FileText, Phone, Palette, ImageIcon, X, Settings, Check } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroProps {
  onQuoteClick?: () => void;
  onUploadClick?: () => void;
}

export default function Hero({ onQuoteClick, onUploadClick }: HeroProps) {
  const { trackWhatsAppClick, trackPhoneClick } = useAnalytics();
  const colorRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const overlayColorRef = useRef<HTMLInputElement>(null);
  const [bgColor, setBgColor] = useState<string>("rgb(123, 147, 204)");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(40);
  const [overlayColor, setOverlayColor] = useState<string>("#000000");
  const [overlayType, setOverlayType] = useState<"solid" | "gradient">("solid");
  const [showOverlaySettings, setShowOverlaySettings] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Сначала загружаем утвержденные настройки с сервера
    const loadApprovedSettings = async () => {
      try {
        const response = await fetch("/api/approve-hero-settings");
        if (response.ok) {
          const settings = await response.json();
          if (settings.approved) {
            setIsApproved(true);
            if (settings.bgColor) setBgColor(settings.bgColor);
            if (settings.bgImage) setBgImage(settings.bgImage);
            if (settings.overlayOpacity) setOverlayOpacity(settings.overlayOpacity);
            if (settings.overlayColor) {
              const validColor = settings.overlayColor.startsWith("#") ? settings.overlayColor : `#${settings.overlayColor}`;
              setOverlayColor(validColor);
            }
            if (settings.overlayType) setOverlayType(settings.overlayType);
          }
        }
      } catch (error) {
        console.log("Could not load approved settings:", error);
      }
    };

    loadApprovedSettings();

    // Потом загружаем локальные настройки (dev переопределяет)
    const savedColor = localStorage.getItem("heroBgColor");
    if (savedColor) setBgColor(savedColor);
    const savedImage = localStorage.getItem("heroBgImage");
    if (savedImage) setBgImage(savedImage);
    const savedOpacity = localStorage.getItem("heroOverlayOpacity");
    if (savedOpacity) setOverlayOpacity(parseInt(savedOpacity));
    const savedOverlayColor = localStorage.getItem("heroOverlayColor");
    if (savedOverlayColor) {
      const validColor = savedOverlayColor.startsWith("#") ? savedOverlayColor : `#${savedOverlayColor}`;
      setOverlayColor(validColor);
    }
    const savedOverlayType = localStorage.getItem("heroOverlayType");
    if (savedOverlayType) setOverlayType(savedOverlayType as "solid" | "gradient");
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    const rgb = hexToRgb(color);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    localStorage.setItem("heroBgColor", rgbStr);
    setBgColor(rgbStr);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          localStorage.setItem("heroBgImage", compressed);
          setBgImage(compressed);
        } catch {
          alert("Картинка слишком большая. Выберите меньший файл.");
        }
      };
      img.src = (evt.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  };

  const removeBgImage = () => {
    localStorage.removeItem("heroBgImage");
    setBgImage(null);
  };

  const handleOverlayOpacityChange = (value: number) => {
    setOverlayOpacity(value);
    localStorage.setItem("heroOverlayOpacity", value.toString());
  };

  const handleOverlayColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value || "#000000";
    const validColor = color.startsWith("#") ? color : `#${color}`;
    console.log("Color changed to:", validColor);
    setOverlayColor(validColor);
    localStorage.setItem("heroOverlayColor", validColor);
  };

  const handleOverlayTypeChange = (type: "solid" | "gradient") => {
    setOverlayType(type);
    localStorage.setItem("heroOverlayType", type);
  };

  const handleApproveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/approve-hero-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bgColor,
          bgImage, // Отправляем base64 если загружена картинка
          overlayOpacity,
          overlayColor,
          overlayType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsApproved(true);
        setSaveMessage("✅ Настройки утверждены! Будут использованы при деплое.");
        setTimeout(() => setSaveMessage(""), 5000);
      } else {
        setSaveMessage("❌ Ошибка при сохранении");
      }
    } catch (error) {
      setSaveMessage("❌ Ошибка подключения");
      console.error("Error approving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 123, g: 147, b: 204 };
  };

  const badges = [
    "Оптовые поставки",
    "Работа с юрлицами",
    "Подбор по ГОСТ / DIN / ISO",
    "Документы и безналичная оплата",
    "Доставка по Казахстану",
    "Обработка заявки за 30 мин",
  ];

  const hexToRgba = (hex: string, alpha: number) => {
    const hexColor = hex.replace("#", "");
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const overlayRgba = hexToRgba(overlayColor, overlayOpacity);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        backgroundImage: bgImage
          ? `url('${bgImage}')`
          : "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: bgImage ? "cover" : "28px 28px",
        backgroundPosition: bgImage ? "center" : "0 0",
      }}
    >
      {/* Overlay слой */}
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{
            background:
              overlayType === "gradient"
                ? `linear-gradient(to right, ${overlayRgba}, transparent)`
                : overlayRgba,
          }}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
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
              <div className="text-slate-400 text-sm mt-1">До отправки заявки</div>
            </div>
          </div>
        </div>

        {/* ВРЕМЕННО: фон (цвет + фото) */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-slate-900/70 px-3 py-2 rounded">
          {/* Цвет */}
          <div className="flex items-center gap-1" title="Выбрать цвет фона">
            <Palette size={16} className="text-white" />
            <input
              ref={colorRef}
              type="color"
              value={bgColor === "rgb(123, 147, 204)" ? "#7b93cc" : bgColor}
              onChange={handleColorChange}
              className="w-6 h-6 cursor-pointer border-0"
            />
          </div>

          {/* Разделитель */}
          <div className="w-px h-6 bg-slate-600"></div>

          {/* Фото */}
          <button
            onClick={() => fileRef.current?.click()}
            title={bgImage ? "Заменить фото" : "Загрузить фото"}
            className="flex items-center gap-1 text-white hover:text-orange-300 transition-colors"
          >
            <ImageIcon size={16} />
          </button>
          {bgImage && (
            <>
              <button
                onClick={removeBgImage}
                title="Удалить фото"
                className="text-white hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Разделитель */}
              <div className="w-px h-6 bg-slate-600"></div>

              {/* Настройки overlay */}
              <div className="relative">
                <button
                  onClick={() => setShowOverlaySettings(!showOverlaySettings)}
                  title="Настройки затемнения"
                  className="flex items-center gap-1 text-white hover:text-orange-300 transition-colors"
                >
                  <Settings size={16} />
                </button>

                {/* Popup с настройками overlay */}
                {showOverlaySettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-slate-800 border border-slate-600 rounded-lg p-4 w-72 shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <h3 className="font-bold text-white text-sm mb-4">Настройки затемнения</h3>

                    {/* Opacity */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Интенсивность: {overlayOpacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overlayOpacity}
                        onChange={(e) => handleOverlayOpacityChange(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Color */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Цвет затемнения
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={overlayColorRef}
                          type="color"
                          value={overlayColor}
                          onChange={handleOverlayColorChange}
                          className="w-10 h-10 cursor-pointer border border-slate-600 rounded"
                        />
                        <span className="text-xs text-slate-400">{overlayColor}</span>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Тип затемнения
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOverlayTypeChange("solid")}
                          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                            overlayType === "solid"
                              ? "bg-orange-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          Равномерное
                        </button>
                        <button
                          onClick={() => handleOverlayTypeChange("gradient")}
                          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                            overlayType === "gradient"
                              ? "bg-orange-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          Градиент
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 border-t border-slate-600 pt-3">
                      💡 Настройки сохраняются автоматически
                    </p>

                    {/* Кнопка утверждения для production */}
                    <button
                      onClick={handleApproveSettings}
                      disabled={isSaving}
                      className={`w-full mt-4 px-4 py-2.5 rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                        isApproved
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-orange-600 text-white hover:bg-orange-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSaving ? (
                        <>Сохраняю...</>
                      ) : isApproved ? (
                        <>
                          <Check size={16} />
                          Утверждено ✓
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Утвердить для production
                        </>
                      )}
                    </button>

                    {saveMessage && (
                      <p className="text-xs mt-2 p-2 rounded bg-slate-700 text-slate-200 text-center">
                        {saveMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
