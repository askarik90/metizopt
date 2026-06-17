"use client";
import { useMemo, useState } from "react";
import { MessageCircle, Check, ChevronDown, ChevronUp } from "lucide-react";
import { getWhatsAppUrl } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";
import LeadFormModal from "@/components/LeadFormModal";

interface Size { label: string; code: string }

// Двухмерный размер крепежа: «М6×20» или «6×10» (диаметр×длина)
const RE2D = /^(М?)\s*(\d+(?:[.,]\d+)?)\s*×\s*(\d+(?:[.,]\d+)?)$/;
const num = (s: string) => parseFloat(s.replace(",", "."));

export default function TypeSizePicker({
  typeName, sizes, category: _category,
}: {
  typeName: string;
  sizes: Size[];
  category: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { trackWhatsAppClick, trackLeadFormOpen } = useAnalytics();

  // Группировка по диаметру (первое число) для двухмерного крепежа
  const { order, groups, other, hasGrid } = useMemo(() => {
    const g: Record<string, Size[]> = {};
    const ord: { key: string; n: number }[] = [];
    const oth: Size[] = [];
    let matched = 0;
    for (const s of sizes) {
      const m = s.label.match(RE2D);
      if (m) {
        matched++;
        const key = (m[1] || "") + m[2];
        if (!g[key]) { g[key] = []; ord.push({ key, n: num(m[2]) }); }
        g[key].push(s);
      } else {
        oth.push(s);
      }
    }
    ord.sort((a, b) => a.n - b.n);
    for (const k in g) {
      g[k].sort((a, b) => num(a.label.match(RE2D)![3]) - num(b.label.match(RE2D)![3]));
    }
    // Сетку по диаметру показываем только когда это реально крепёж М×L:
    // много позиций, минимум 2 диаметра и почти все лейблы двухмерные.
    const has = sizes.length > 12 && ord.length > 1 && matched / sizes.length >= 0.7;
    return { order: ord, groups: g, other: oth, hasGrid: has };
  }, [sizes]);

  const [view, setView] = useState<1 | 2 | 3>(hasGrid ? 2 : 1);
  const [curD, setCurD] = useState(order[0]?.key || "");

  const LIMIT = 24;
  const lengthOf = (label: string) => {
    const m = label.match(RE2D);
    return m ? m[3] : label;
  };
  const toggle = (l: string) =>
    setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  const chip = (s: Size, text?: string) => {
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
        {text ?? s.label}
      </button>
    );
  };

  // Текст для WhatsApp с ограничением длины (Codex: не упираться в длину URL)
  const lines =
    picked.length > 20
      ? picked.slice(0, 20).map((s) => `• ${typeName} ${s}`).join("\n") +
        `\n…и ещё ${picked.length - 20} — уточню списком`
      : picked.map((s) => `• ${typeName} ${s}`).join("\n");
  const waText = `Здравствуйте! Интересует ${typeName}.\n${
    picked.length ? "Размеры:\n" + lines : ""
  }\nПодскажите наличие и цену, пожалуйста.`;

  const swBtn = (v: 1 | 2 | 3, label: string) => (
    <button
      onClick={() => { setView(v); setExpanded(false); }}
      className={`px-3 py-1 text-xs font-semibold transition-colors ${
        view === v ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:text-slate-900"
      }`}
    >
      {v} · {label}
    </button>
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
          Выберите размер
        </h2>
        <div className="flex items-center gap-3">
          {hasGrid && (
            <div className="inline-flex overflow-hidden rounded border border-slate-300">
              {swBtn(1, "список")}
              {swBtn(2, "по диаметру")}
              {swBtn(3, "шаги")}
            </div>
          )}
          <span className="text-sm text-slate-500">{sizes.length} позиций</span>
        </div>
      </div>

      {sizes.length === 0 ? (
        <p className="text-slate-500">Уточните размер у менеджера — поможем подобрать.</p>
      ) : !hasGrid || view === 1 ? (
        // ── Вариант 1: плоский список ──
        <>
          <div className="flex flex-wrap gap-2">
            {(expanded || sizes.length <= LIMIT
              ? sizes
              : sizes.filter((s, i) => i < LIMIT || picked.includes(s.label))
            ).map((s) => chip(s))}
          </div>
          {sizes.length > LIMIT && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              {expanded ? (<>Свернуть <ChevronUp size={16} /></>) : (<>Показать все {sizes.length} позиций <ChevronDown size={16} /></>)}
            </button>
          )}
        </>
      ) : view === 2 ? (
        // ── Вариант 2: группировка по диаметру ──
        <div className="divide-y divide-slate-100">
          {order.map((o) => (
            <div key={o.key} className="flex flex-wrap items-baseline gap-x-3 gap-y-2 py-2.5">
              <div className="w-12 shrink-0 text-sm font-bold text-slate-900">{o.key}</div>
              <div className="flex flex-1 flex-wrap gap-2">
                {groups[o.key].map((s) => chip(s, lengthOf(s.label)))}
              </div>
            </div>
          ))}
          {other.length > 0 && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 py-2.5">
              <div className="w-12 shrink-0 text-sm font-bold text-slate-900">Иные</div>
              <div className="flex flex-1 flex-wrap gap-2">{other.map((s) => chip(s))}</div>
            </div>
          )}
        </div>
      ) : (
        // ── Вариант 3: двухшаговый (диаметр → длины) ──
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {order.map((o) => (
              <button
                key={o.key}
                onClick={() => setCurD(o.key)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  curD === o.key
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-600 hover:border-blue-400"
                }`}
              >
                {o.key}
              </button>
            ))}
          </div>
          <div className="mb-2 text-xs text-slate-400">Длины для {curD || order[0]?.key}, мм:</div>
          <div className="flex flex-wrap gap-2">
            {(groups[curD] || groups[order[0]?.key] || []).map((s) => chip(s, lengthOf(s.label)))}
          </div>
        </>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <span className="text-sm text-slate-500 sm:mr-auto">
          {picked.length > 0
            ? `Выбрано позиций: ${picked.length}${picked.length > 20 ? " — полный список уточним сообщением" : ""}`
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
