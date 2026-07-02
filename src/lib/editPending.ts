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

// Возвращает true при успехе. false = localStorage недоступен → UI обязан показать ошибку,
// а не «в очереди» (иначе у пользователя ощущение «применил, но не сохранилось»).
export function setPending(slug: string, pos: ImagePosition): boolean {
  const cur = getPending();
  cur[slug] = pos;
  try {
    localStorage.setItem(KEY, JSON.stringify(cur));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(EVENT));
  return true;
}

export function clearPending(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

// Удаляет из буфера только те ключи, что реально отправлены И не изменились с момента отправки
// (значение совпадает со snapshot). Правки, сделанные во время сохранения, остаются.
export function removeSavedKeys(snapshot: PendingMap): void {
  const cur = getPending();
  for (const [k, v] of Object.entries(snapshot)) {
    if (JSON.stringify(cur[k]) === JSON.stringify(v)) delete cur[k];
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(cur));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function pendingCount(): number {
  return Object.keys(getPending()).length;
}

// Подписка на изменения буфера — в этой вкладке (custom event) и из других вкладок
// (storage event). Возвращает функцию отписки.
export function onPendingChange(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}
