"use client";
import { useState, useRef } from "react";
import { X, Upload, CheckCircle } from "lucide-react";
import { useAnalytics, getUtmParams } from "@/hooks/useAnalytics";
import { useRouter } from "next/navigation";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: string;
  title?: string;
}

export default function LeadFormModal({ open, onClose, category, title }: LeadFormModalProps) {
  const router = useRouter();
  const { trackLeadFormSubmit, trackFileUpload } = useAnalytics();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    city: "",
    message: "",
    company_site: "", // honeypot — поле-ловушка для ботов, скрыто от людей
  });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
      trackFileUpload();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError("Укажите имя и телефон");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Подхватываем последний поисковый запрос — менеджеру виднее что искал клиент
      const searchQuery = sessionStorage.getItem("lastSearchQuery") || "";
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: category || "",
          search_query: searchQuery,
          page_url: window.location.href,
          ...getUtmParams(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        trackLeadFormSubmit(category, searchQuery);
        router.push("/thanks");
      } else {
        setError(data.message || "Ошибка при отправке");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-white font-black text-xl uppercase tracking-tight">
            {title || "Оставить заявку"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* honeypot — скрыто от людей, заполняют только боты */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <input
              name="company_site"
              value={form.company_site}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {category && (
            <div className="bg-orange-600/10 border border-orange-600/30 text-orange-400 text-sm px-3 py-2">
              Категория: {category}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1.5">
                Имя *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Иван Петров"
                className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1.5">
                Компания
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="ТОО Стройком"
                className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1.5">
                Телефон *
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (700) 000-00-00"
                className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1.5">
                Город
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Алматы"
                className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs font-medium block mb-1.5">
              Список товаров / комментарий
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Болты М10х60 DIN 933 — 500 шт&#10;Гайки М10 DIN 934 — 500 шт"
              rows={4}
              className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500 resize-none"
            />
          </div>

          <div>
            <label className="text-slate-400 text-xs font-medium block mb-1.5">
              Загрузить файл (Excel, PDF, JPG, PNG, DOCX)
            </label>
            <div
              className="border border-dashed border-slate-600 hover:border-orange-500 transition-colors p-4 text-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-slate-500 mb-2" />
              {fileName ? (
                <span className="text-green-400 text-sm flex items-center justify-center gap-1">
                  <CheckCircle size={14} />
                  {fileName}
                </span>
              ) : (
                <span className="text-slate-500 text-sm">
                  Нажмите или перетащите файл
                </span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png,.docx,.doc"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-3.5 font-medium text-base transition-colors"
          >
            {loading ? "Отправляем..." : "Отправить заявку"}
          </button>

          <p className="text-slate-500 text-xs text-center">
            Можно отправить Excel, PDF, фото заявки или вставить список текстом
          </p>
        </form>
      </div>
    </div>
  );
}
