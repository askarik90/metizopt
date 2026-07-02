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
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  // Кладём правку в буфер СРАЗУ при любом изменении — чтобы не терялось, если забыли нажать
  // «Применить». Публикуются все разом кнопкой «Сохранить всё» в плашке.
  const queue = (nx: number, ny: number, nsz: "cover" | "contain" | number) => {
    const ok = setPending(slug, { x: nx, y: ny, size: nsz });
    setMsg(ok ? "✓ В очереди — жмите «Сохранить всё» внизу" : "⚠ Браузер блокирует сохранение (localStorage)");
  };

  // Текущий путь фонового фото (из DOM) — чтобы заменить именно этот файл.
  const currentImgPath = (): string | null => {
    const el = findBgEl();
    if (!el) return null;
    const m = /url\(["']?([^"')]+\.jpe?g)["']?\)/i.exec(el.style.backgroundImage || "");
    if (!m) return null;
    try {
      return new URL(m[1], location.href).pathname;
    } catch {
      return m[1].startsWith("/") ? m[1] : null;
    }
  };

  // Замена самого файла фото: сжимаем в браузере (≤1400px, jpeg) и льём в git по тому же пути.
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    const path = currentImgPath();
    if (!path) {
      setMsg("У этого блока нет фото для замены");
      return;
    }
    setUp(true);
    setMsg("Готовлю фото…");
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.drawImage(bitmap, 0, 0, w, h);
      const blob: Blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("no blob"))), "image/jpeg", 0.82)
      );
      const dataUrl: string = await new Promise<string>((res) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result));
        fr.readAsDataURL(blob);
      });
      const dataBase64 = dataUrl.split(",")[1];
      setMsg("Загружаю…");
      const r = await fetch("/api/image-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, dataBase64 }),
      });
      if (r.ok) setMsg("✓ Фото заменено — применится за ~1 мин (передеплой)");
      else if (r.status === 401) setMsg("Войдите в админку");
      else setMsg("Не удалось загрузить фото");
    } catch {
      setMsg("Не удалось обработать фото");
    }
    setUp(false);
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
            <button onClick={(e) => { stop(e); setSize("cover"); queue(x, y, "cover"); }} className={`flex-1 rounded px-2 py-1.5 font-semibold ${size === "cover" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Заполнить</button>
            <button onClick={(e) => { stop(e); setSize("contain"); queue(x, y, "contain"); }} className={`flex-1 rounded px-2 py-1.5 font-semibold ${size === "contain" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>Целиком</button>
          </div>
          <label className="block text-xs text-slate-500">
            Масштаб: {typeof size === "number" ? `${size}%` : "авто"}
            <input type="range" min={20} max={300} value={typeof size === "number" ? size : 100} onClick={stop} onChange={(e) => { const v = +e.target.value; setSize(v); queue(x, y, v); }} className="w-full" />
          </label>

          <label className="block text-xs text-slate-500">
            По горизонтали: {x}%
            <input type="range" min={-50} max={150} value={x} onClick={stop} onChange={(e) => { const v = +e.target.value; setX(v); queue(v, y, size); }} className="w-full" />
          </label>
          <label className="block text-xs text-slate-500">
            По вертикали: {y}%
            <input type="range" min={-50} max={150} value={y} onClick={stop} onChange={(e) => { const v = +e.target.value; setY(v); queue(x, v, size); }} className="w-full" />
          </label>

          {/* только stopPropagation, БЕЗ preventDefault — иначе отменится открытие диалога выбора файла */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onClick={(e) => e.stopPropagation()} onChange={onFile} />
          <button onClick={(e) => { stop(e); fileRef.current?.click(); }} disabled={up} className="mt-3 w-full rounded border border-slate-300 px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {up ? "Загрузка…" : "Заменить фото"}
          </button>

          <button onClick={(e) => { stop(e); queue(x, y, size); setOpen(false); }} className="mt-2 w-full rounded bg-orange-600 px-2 py-2 text-sm font-semibold text-white hover:bg-orange-700">
            Готово
          </button>
          {msg && <div className="mt-2 text-[11px] text-slate-500">{msg}</div>}
          <div className="mt-1 text-[11px] text-slate-400">Положение копится автоматически → «Сохранить всё» внизу. «Заменить фото» публикуется сразу.</div>
        </div>
      )}
    </div>
  );
}
