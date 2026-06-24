"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "krp_edit";
function editOn() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Значок ✎ на hero/картинке. Виден только в режиме правки. Клик → панель
// положения с живым превью; сохранение пишет позицию по slug в image-positions.
export default function ImageEditOverlay({ slug }: { slug: string }) {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(100);
  const [y, setY] = useState(50);
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () => setOn(editOn());
    read();
    window.addEventListener("krp-edit-change", read);
    return () => window.removeEventListener("krp-edit-change", read);
  }, []);

  // Находим элемент с фоновым фото: hero — предок-секция со стилем фона;
  // бокс/карточка — фоновый div внутри той же ссылки.
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

  // живое превью положения фото (image — последний слой; градиент справа не трогаем)
  useEffect(() => {
    if (!open) return;
    const el = findBgEl();
    if (el) el.style.backgroundPosition = `right center, ${x}% ${y}%`;
  }, [x, y, open]);

  const openPanel = async () => {
    setOpen(true);
    setMsg("");
    try {
      const d = await (await fetch("/api/image-positions")).json();
      const p = d?.[slug] ?? {};
      setX(typeof p.x === "number" ? p.x : 100);
      setY(typeof p.y === "number" ? p.y : 50);
    } catch {}
  };

  const save = async () => {
    setMsg("Сохраняю…");
    try {
      const cur = (await (await fetch("/api/image-positions")).json()) || {};
      cur[slug] = { ...(cur[slug] || {}), x, y };
      const r = await fetch("/api/image-positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cur),
      });
      setMsg(r.ok ? "Сохранено · появится после обновления страницы" : "Ошибка: нужен вход в админку");
    } catch {
      setMsg("Ошибка сети");
    }
  };

  if (!on) return <div ref={ref} className="hidden" />;

  return (
    <div ref={ref} className="absolute right-3 top-3 z-30">
      {!open ? (
        <button
          onClick={openPanel}
          title="Изменить положение фото"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-slate-800 shadow-lg ring-1 ring-black/10 hover:bg-white"
        >
          ✎
        </button>
      ) : (
        <div className="w-64 rounded-lg bg-white p-3 text-slate-800 shadow-2xl ring-1 ring-black/10">
          <div className="mb-2 text-xs font-bold uppercase tracking-tight">Положение фото</div>
          <label className="block text-xs text-slate-500">
            По горизонтали: {x}%
            <input type="range" min={0} max={100} value={x} onChange={(e) => setX(+e.target.value)} className="w-full" />
          </label>
          <label className="block text-xs text-slate-500">
            По вертикали: {y}%
            <input type="range" min={0} max={100} value={y} onChange={(e) => setY(+e.target.value)} className="w-full" />
          </label>
          <div className="mt-2 flex gap-2">
            <button onClick={save} className="flex-1 rounded bg-orange-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-orange-700">
              Сохранить
            </button>
            <button onClick={() => setOpen(false)} className="rounded bg-slate-100 px-2 py-1.5 text-xs hover:bg-slate-200">
              Закрыть
            </button>
          </div>
          {msg && <div className="mt-1.5 text-[11px] text-slate-500">{msg}</div>}
          <div className="mt-1 text-[11px] text-slate-400">Смена самой картинки — после восстановления Blob.</div>
        </div>
      )}
    </div>
  );
}
