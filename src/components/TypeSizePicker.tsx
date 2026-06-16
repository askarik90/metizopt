"use client";
import { useState } from "react";
import { MessageCircle, Check } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";
import LeadFormModal from "@/components/LeadFormModal";

interface Size { label: string; code: string }

export default function TypeSizePicker({
  typeName, sizes, category,
}: {
  typeName: string;
  sizes: Size[];
  category: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { trackWhatsAppClick, trackLeadFormOpen } = useAnalytics();

  const toggle = (l: string) =>
    setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  const lines = picked.length
    ? picked.map((s) => `• ${typeName} ${s}`).join("\n")
    : typeName;
  const waText = `Здравствуйте! Интересует ${typeName}.\n${
    picked.length ? "Размеры:\n" + lines : ""
  }\nПодскажите наличие и цену, пожалуйста.`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
          Выберите размер
        </h2>
        <span className="text-sm text-slate-500">{sizes.length} размеров</span>
      </div>

      {sizes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = picked.includes(s.label);
            return (
              <button
                key={s.code || s.label}
                onClick={() => toggle(s.label)}
                className={`flex items-center gap-1.5 border-2 px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-orange-600 bg-orange-50 text-orange-700"
                    : "border-slate-200 text-slate-700 hover:border-orange-400"
                }`}
              >
                {active && <Check size={14} className="shrink-0" />}
                {s.label}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-500">Уточните размер у менеджера — поможем подобрать.</p>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <span className="text-sm text-slate-500 sm:mr-auto">
          {picked.length > 0
            ? `Выбрано размеров: ${picked.length}`
            : "Отметьте нужные размеры — или запросите весь вид"}
        </span>
        <a
          href={getWhatsAppUrl(waText)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(typeName)}
          className="flex items-center justify-center gap-2 bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          <MessageCircle size={18} />
          Запросить в WhatsApp
        </a>
        <button
          onClick={() => { setModalOpen(true); trackLeadFormOpen(typeName); }}
          className="bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Запросить КП
        </button>
      </div>

      <LeadFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={picked.length ? `${typeName} (${picked.join(", ")})` : typeName}
      />
    </div>
  );
}
