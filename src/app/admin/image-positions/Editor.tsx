"use client";
import { useState } from "react";

interface Item { slug: string; label: string; img: string }
interface Pos { x?: number; y?: number; size?: "cover" | "contain" }

export default function ImagePositionsEditor({
  items,
  initial,
}: {
  items: Item[];
  initial: Record<string, Pos>;
}) {
  const [pos, setPos] = useState<Record<string, Pos>>(initial || {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");

  const upd = (slug: string, patch: Pos) =>
    setPos((p) => ({ ...p, [slug]: { ...p[slug], ...patch } }));
  const reset = (slug: string) =>
    setPos((p) => {
      const n = { ...p };
      delete n[slug];
      return n;
    });

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const r = await fetch("/api/image-positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pos),
      });
      const d = await r.json();
      setMsg(r.ok ? `Сохранено (${d.count} настроек)` : `Ошибка: ${d.error || r.status}`);
    } catch {
      setMsg("Ошибка сети");
    }
    setSaving(false);
  };

  const ql = q.trim().toLowerCase();
  const shown = ql
    ? items.filter((i) => i.label.toLowerCase().includes(ql) || i.slug.includes(ql))
    : items;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-1 text-2xl font-black text-slate-900">Настройка фото (положение и размер)</h1>
      <p className="mb-4 text-sm text-slate-500">
        Положение фото справа в hero и блоках описания. По умолчанию — «целиком», справа по центру.
        Сохранение пишет в Blob (заработает после его восстановления) и на скорость сайта не влияет.
      </p>

      <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-3 bg-white/90 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск категории или вида…"
          className="min-w-48 flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          onClick={save}
          disabled={saving}
          className="rounded bg-orange-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
        >
          {saving ? "Сохраняю…" : "Сохранить всё"}
        </button>
        {msg && <span className="text-sm text-slate-600">{msg}</span>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shown.map((it) => {
          const p = pos[it.slug] || {};
          const x = p.x ?? 100;
          const y = p.y ?? 50;
          const size = p.size ?? "contain";
          const edited = !!pos[it.slug] && Object.keys(pos[it.slug]).length > 0;
          return (
            <div key={it.slug} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="truncate text-sm font-semibold text-slate-800">
                  {it.label} {edited && <span className="text-orange-600">●</span>}
                </div>
                <button onClick={() => reset(it.slug)} className="shrink-0 text-xs text-slate-400 hover:text-orange-600">
                  сброс
                </button>
              </div>
              <div
                className="mb-3 h-32 rounded border border-slate-200 bg-slate-100"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0) 100%), url('${it.img}')`,
                  backgroundSize: `cover, ${size}`,
                  backgroundPosition: `right center, ${x}% ${y}%`,
                  backgroundRepeat: "no-repeat, no-repeat",
                }}
              />
              <label className="block text-xs text-slate-500">
                По горизонтали: {x}%
                <input type="range" min={0} max={100} value={x} onChange={(e) => upd(it.slug, { x: +e.target.value })} className="w-full" />
              </label>
              <label className="block text-xs text-slate-500">
                По вертикали: {y}%
                <input type="range" min={0} max={100} value={y} onChange={(e) => upd(it.slug, { y: +e.target.value })} className="w-full" />
              </label>
              <div className="mt-1 flex gap-2 text-xs">
                <button
                  onClick={() => upd(it.slug, { size: "contain" })}
                  className={`rounded px-2 py-1 ${size === "contain" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  Целиком
                </button>
                <button
                  onClick={() => upd(it.slug, { size: "cover" })}
                  className={`rounded px-2 py-1 ${size === "cover" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  Заполнить
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
