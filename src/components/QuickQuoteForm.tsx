"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { useAnalytics, getUtmParams } from "@/hooks/useAnalytics";
import { useRouter } from "next/navigation";

interface QuickQuoteFormProps {
  category?: string;
}

export default function QuickQuoteForm({ category }: QuickQuoteFormProps) {
  const router = useRouter();
  const { trackLeadFormSubmit, trackFileUpload, trackLeadFormOpen } = useAnalytics();

  // Отслеживаем открытие страницы /quote как form_open
  useEffect(() => {
    trackLeadFormOpen(category || "quote");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", company: "", phone: "", whatsapp: "", city: "", message: "", company_site: "",
  });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!form.name || !form.phone) { setError("Укажите имя и телефон"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: category || "",
          page_url: window.location.href,
          ...getUtmParams(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        trackLeadFormSubmit(category);
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
    <section id="quote" className="bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
              Получить коммерческое предложение
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              Можно отправить Excel, PDF, фото бумажной заявки, скан или просто
              вставить список текстом.
            </p>
            <div className="space-y-4 text-slate-400">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-black text-xl mt-0.5">01</span>
                <div>
                  <div className="text-white font-medium">Отправьте список</div>
                  <div className="text-sm">Файл, фото или просто текстом</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-black text-xl mt-0.5">02</span>
                <div>
                  <div className="text-white font-medium">Проверяем наличие</div>
                  <div className="text-sm">Менеджер разбирает позиции</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-black text-xl mt-0.5">03</span>
                <div>
                  <div className="text-white font-medium">Ответ за 30 минут</div>
                  <div className="text-sm">В WhatsApp или на email</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
              <input name="company_site" value={form.company_site} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-medium block mb-1.5">Имя *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Иван Петров"
                  className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium block mb-1.5">Компания</label>
                <input name="company" value={form.company} onChange={handleChange}
                  placeholder="ТОО Стройком"
                  className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-medium block mb-1.5">Телефон *</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+7 (700) 000-00-00"
                  className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium block mb-1.5">Город</label>
                <input name="city" value={form.city} onChange={handleChange}
                  placeholder="Алматы"
                  className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1.5">Список товаров / комментарий</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Болты М10х60 DIN 933 — 500 шт&#10;Гайки М10 DIN 934 — 500 шт"
                rows={4}
                className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder-slate-500 resize-none" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1.5">Загрузить файл</label>
              <div
                className="border border-dashed border-slate-600 hover:border-orange-500 transition-colors p-4 text-center cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={20} className="mx-auto text-slate-500 mb-1" />
                {fileName ? (
                  <span className="text-green-400 text-sm flex items-center justify-center gap-1">
                    <CheckCircle size={14} /> {fileName}
                  </span>
                ) : (
                  <span className="text-slate-500 text-sm">Excel, PDF, JPG, PNG, DOCX</span>
                )}
              </div>
              <input ref={fileRef} type="file"
                accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png,.docx,.doc"
                onChange={handleFile} className="hidden" />
            </div>
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-3 py-2">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-4 font-medium text-base transition-colors">
              {loading ? "Отправляем..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
