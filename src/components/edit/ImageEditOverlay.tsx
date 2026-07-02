"use client";
import { useEffect, useRef, useState } from "react";
import { sizeCss } from "@/lib/categoryImages";
import { getPending, setPending } from "@/lib/editPending";

const KEY = "krp_edit";
function editOn() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Значок ✎ на hero/боксе. Виден только в режиме правки. Панель — плавающая
// (fixed), чтобы не обрезалась рамкой бокса (overflow-hidden). Клики не проваливаются
// в ссылку-карточку (preventDefault+stopPropagation).
export default function ImageEditOverlay({ slug }: { slug: string }) {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(100);
  const [y, setY] = useState(50);
  const [size, setSize] = useState<"cover" | "contain" | number>("cover");
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () => setOn(editOn());
    read();
    window.addEventListener("krp-edit-change", read);
    return () => window.removeEventListener("krp-edit-change", read);
  }, []);

  // Элемент с фоновым фото: hero — предок-секция со стилем фона; бокс — фоновый div рядом.
  const findBgEl = (): HTMLElement | null => {
    const start = ref.current;
    if (!start) return null;
    let el: HTMLElement | null = start.parentElement;
    while (el) {
      if (el.style?.backgroundImage && el.style.backgroundImage !== "none") return el;
      el = el.parentElement;
    }
    const host = start.closest("a") ?? start.parentElement;
    return host?.querySelector<HTMLElement>('div[style*="background-image"]') ?? null;
  };

  // живое превью (image — последний слой; градиент не трогаем)
  useEffect(() => {
    if (!open) return;
    const el = findBgEl();
    if (!el) return;
    el.style.backgroundPosition = `right center, ${x}% ${y}%`;
    el.style.backgroundSize = `cover, ${sizeCss(size)}`;
    el.style.backgroundRepeat = "no-repeat, no-repeat";
  }, [x, y, size, open]);

  const openPanel = async () => {
    setOpen(true);
    setMsg("");
    // Сначала берём несохранённую правку из буфера (если её уже правили в этой сессии).
    const pend = getPending()[slug];
    if (pend) {
      setX(typeof pend.x === "number" ? pend.x : 100);
      setY(typeof pend.y === "number" ? pend.y : 50);
      setSize(typeof pend.size === "number" ? pend.size : pend.size === "contain" ? "contain" : "cover");
      setMsg("В очереди на сохранение");
      return;
    }
    try {
      const d = await (await fetch("/api/image-positions")).json();
      const p = d?.[slug] ?? {};
      setX(typeof p.x === "number" ? p.x : 100);
      setY(typeof p.y === "number" ? p.y : 50);
      setSize(typeof p.size === "number" ? p.size : p.size === "contain" ? "contain" : "cover");
    } catch {}
  };

  // Кладём правку в общий буфер. Публикуются все разом по кнопке «Сохранить всё» в плашке.
  const apply = () => {
    setPending(slug, { x, y, size });
    setMsg("✓ В очереди. Нажмите «Сохранить всё» в плашке снизу.");
  };

  // клик/нажатие внутри overlay не должны срабатывать как переход по ссылке-карточке
  const stop = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!on) return <div ref={ref} className="hidden" />;

  return (
    <div ref={ref} className="absolute right-2 top-2 z-30" onClick={stop}>
      <button
        onClick={(e) => {
          stop(e);
          if (open) setOpen(false);
          else openPanel();
        }}
        title="Изменить фото"
        className={`flex h-8 w-8 items-center justify-center rounded-full text-base shadow-lg ring-1 ring-black/10 ${
          open ? "bg-orange-600 text-white" : "bg-white/95 text-slate-800 hover:bg-white"
        }`}
      >
        ✎
      </button>

      {open && (
        <div
          onClick={stop}
          className="fixed bottom-24 left-1/2 z-[70] w-72 -translate-x-1/2 rounded-xl bg-white p-4 text-left text-slate-800 shadow-2xl ring-1 ring-black/10"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-tight">Фото · {slug}</span>
            <button onClick={(e) => { stop(e); setOpen(false); }} className="text-sm text-slate-400 hover:text-slate-700">✕</button>
          </div>

          <div className="mb-2 flex gap-2 text-xs">
            <button onClick={(e) => { stop(e); setSize("cover"); }} className={`flex-1 rounded px-2 py-1.5 font-semibold ${size === "cover" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Заполнить</button>
            <button onClick={(e) => { stop(e); setSize("contain"); }} className={`flex-1 rounded px-2 py-1.5 font-semibold ${size === "contain" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Целиком</button>
          </div>
          <label className="block text-xs text-slate-500">
            Масштаб: {typeof size === "number" ? `${size}%` : "авто"}
            <input type="range" min={20} max={300} value={typeof size === "number" ? size : 100} onClick={stop} onChange={(e) => setSize(+e.target.value)} className="w-full" />
          </label>

          <label className="block text-xs text-slate-500">
            По горизонтали: {x}%
            <input type="range" min={-50} max={150} value={x} onClick={stop} onChange={(e) => setX(+e.target.value)} className="w-full" />
          </label>
          <label className="block text-xs text-slate-500">
            По вертикали: {y}%
            <input type="range" min={-50} max={150} value={y} onClick={stop} onChange={(e) => setY(+e.target.value)} className="w-full" />
          </label>

          <button onClick={(e) => { stop(e); apply(); }} className="mt-3 w-full rounded bg-orange-600 px-2 py-2 text-sm font-semibold text-white hover:bg-orange-700">
            Применить
          </button>
          {msg && <div className="mt-2 text-[11px] text-slate-500">{msg}</div>}
          <div className="mt-1 text-[11px] text-slate-400">Правки копятся — публикуются кнопкой «Сохранить всё» внизу.</div>
        </div>
      )}
    </div>
  );
}
