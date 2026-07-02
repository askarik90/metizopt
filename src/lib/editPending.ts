// Клиентский буфер несохранённых правок позиций фото (батч-сохранение).
// Правки копятся в localStorage и публикуются ОДНИМ запросом по кнопке «Сохранить всё»,
// чтобы был один коммит и один редеплой (без гонки и пачки пересборок).
import type { ImagePosition } from "@/lib/db";

const KEY = "krp_edit_pending";
const EVENT = "krp-edit-pending-change";

export type PendingMap = Record<string, ImagePosition>;

export function getPending(): PendingMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as PendingMap;
  } catch {
    return {};
  }
}

export function setPending(slug: string, pos: ImagePosition): void {
  const cur = getPending();
  cur[slug] = pos;
  try {
    localStorage.setItem(KEY, JSON.stringify(cur));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function clearPending(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function pendingCount(): number {
  return Object.keys(getPending()).length;
}

// Подписка на изменения буфера. Возвращает функцию отписки.
export function onPendingChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
