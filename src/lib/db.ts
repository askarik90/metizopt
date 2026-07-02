/**
 * Unified data layer:
 * - Production (Vercel): uses @vercel/blob (private store)
 * - Development (local): uses filesystem JSON files
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function useBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// ── Blob helpers ──────────────────────────────────────────────────────

async function blobGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const { get } = await import("@vercel/blob");
    // Private store: read with access:"private". useCache:false → always the
    // freshest version right after a save (no CDN staleness).
    const result = await get(`krp/${key}.json`, {
      access: "private",
      useCache: false,
    });
    // SDK возвращает { stream, headers, blob } (без statusCode). Раньше проверка
    // result.statusCode !== 200 была всегда истинной → чтение всегда падало в fallback,
    // из-за чего getLeads возвращал [] и перезаписывал историю заявок.
    if (!result || !result.stream) return fallback;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

async function blobSet<T>(key: string, value: T): Promise<void> {
  const { put } = await import("@vercel/blob");
  // Pass a plain string — the SDK encodes it as UTF-8 (TextEncoder).
  // Passing a Node Buffer here corrupts multibyte (Cyrillic) characters.
  await put(`krp/${key}.json`, JSON.stringify(value, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });
}

// ── FS helpers ────────────────────────────────────────────────────────

function fsRead<T>(filename: string, fallback: T): T {
  try {
    const file = path.join(DATA_DIR, filename);
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {}
  return fallback;
}

function fsWrite<T>(filename: string, data: T): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// ── SETTINGS ──────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  address: "Республика Казахстан, г. Алматы, ул. Нарынкольская, 1А",
  phone: "+7 (708) 800-31-50",
  email: "140@bugel.kz",
  whatsapp: "+7 (771) 070-75-52",
  workingHours: "Пн–Пт: 09:00–18:00",
  workingHoursSat: "Сб: 09:00–16:00",
};

export async function getSettings() {
  // Статичный контент — источник истины в git (data/*.json), НЕ в Blob.
  // Убирает поштучные чтения Blob на каждый запрос (причина превышения лимита).
  return fsRead("settings.json", DEFAULT_SETTINGS);
}

export async function saveSettings(data: typeof DEFAULT_SETTINGS) {
  if (useBlob()) { await blobSet("settings", data); return; }
  fsWrite("settings.json", data);
}

// ── IMAGE POSITIONS (фон фото у hero/описаний/карточек) ───────────────
// Безопасно для Blob: читается только при ISR-пересборке страницы (≤1/сутки
// на страницу), пишется только при сохранении из админки. НЕ на каждый визит.
export interface ImagePosition { x?: number; y?: number; size?: "cover" | "contain" | number }
export type ImagePositions = Record<string, ImagePosition>;

// Временный режим записи в git через GitHub Contents API (пока Blob лежит).
// Токен — fine-grained PAT с Contents:write на репо, в Vercel env GITHUB_TOKEN.
// Код токен не хранит. Убрать GITHUB_TOKEN → код вернётся на Blob автоматически.
function ghConf() {
  const token = process.env.GITHUB_TOKEN!;
  return {
    repo: process.env.GITHUB_REPO || "askarik90/metizopt",
    branch: process.env.GITHUB_BRANCH || "master",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "krp-inline-editor",
      "X-GitHub-Api-Version": "2022-11-28",
    } as Record<string, string>,
  };
}

const IMG_MSG = "edit: правка фото через инлайн-редактор";

// Чтение файла + его sha со свежего HEAD (не из отстающей сборки).
// status: 200 — ок; 404 — файла ещё нет (пустая база, это НЕ ошибка); иначе — сбой чтения
// (писать нельзя, иначе затрём файл одним батчем).
async function githubGetFile(path: string): Promise<{ status: number; text?: string; sha?: string }> {
  const { repo, branch, headers } = ghConf();
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (res.status === 404) return { status: 404 };
  if (!res.ok) return { status: res.status };
  const j = (await res.json()) as { content?: string; sha?: string };
  const text = j.content ? Buffer.from(j.content, "base64").toString("utf8") : "";
  return { status: 200, text, sha: j.sha };
}

// Запись файла. Возвращает HTTP-статус; 409 (конфликт sha) отдаём вызывающему для повтора.
async function githubPutFile(path: string, content: string, sha: string | undefined): Promise<number> {
  const { repo, branch, headers } = ghConf();
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: IMG_MSG,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (res.status === 409) return 409;
  if (!res.ok) throw new Error(`GitHub save ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.status;
}

async function saveJsonToGitHub(path: string, content: string): Promise<void> {
  const g = await githubGetFile(path);
  if (g.status !== 200 && g.status !== 404) throw new Error(`GitHub read ${g.status}`);
  await githubPutFile(path, content, g.status === 200 ? g.sha : undefined);
}

export async function getImagePositions(): Promise<ImagePositions> {
  const fromGit = fsRead<ImagePositions>("image-positions.json", {});
  // GitHub-режим: источник истины — закоммиченный git-файл (читается из сборки).
  if (process.env.GITHUB_TOKEN) return fromGit;
  if (useBlob()) return blobGet<ImagePositions>("image-positions", fromGit);
  return fromGit;
}

export async function saveImagePositions(data: ImagePositions) {
  const json = JSON.stringify(data, null, 2) + "\n";
  if (process.env.GITHUB_TOKEN) { await saveJsonToGitHub("data/image-positions.json", json); return; }
  if (useBlob()) { await blobSet("image-positions", data); return; }
  fsWrite("image-positions.json", data);
}

// Частичное обновление: подмешивает только изменённые слаги в САМУЮ свежую версию
// хранилища (GitHub HEAD / Blob без кэша / fs), а не в отстающую сборку. Убирает гонку,
// из-за которой быстрые правки нескольких фото затирали друг друга.
export async function mergeImagePositions(partial: ImagePositions): Promise<ImagePositions> {
  if (process.env.GITHUB_TOKEN) {
    const path = "data/image-positions.json";
    // Атомарно: читаем content+sha, пишем с тем же sha; при 409 (кто-то закоммитил между)
    // перечитываем свежий HEAD и мёржим заново. При сбое ЧТЕНИЯ бросаем ошибку и НЕ пишем.
    for (let attempt = 0; attempt < 3; attempt++) {
      const g = await githubGetFile(path);
      if (g.status !== 200 && g.status !== 404) throw new Error(`GitHub read ${g.status}`);
      const cur: ImagePositions = g.text ? (JSON.parse(g.text) as ImagePositions) : {};
      const merged = { ...cur, ...partial };
      const st = await githubPutFile(path, JSON.stringify(merged, null, 2) + "\n", g.status === 200 ? g.sha : undefined);
      if (st !== 409) return merged;
    }
    throw new Error("GitHub merge: конфликт sha после 3 попыток");
  }
  if (useBlob()) {
    const cur = await blobGet<ImagePositions>("image-positions", {});
    const merged = { ...cur, ...partial };
    await blobSet("image-positions", merged);
    return merged;
  }
  const cur = fsRead<ImagePositions>("image-positions.json", {});
  const merged = { ...cur, ...partial };
  fsWrite("image-positions.json", merged);
  return merged;
}

// ── FAQ ───────────────────────────────────────────────────────────────

export interface FAQItem { id: string; question: string; answer: string }

export async function getFAQ(): Promise<FAQItem[]> {
  return fsRead<FAQItem[]>("faq.json", []); // статичный контент → git
}

export async function saveFAQ(data: FAQItem[]) {
  if (useBlob()) { await blobSet("faq", data); return; }
  fsWrite("faq.json", data);
}

export interface GroupItem {
  slug: string;
  title: string;
  shortTitle: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  image: string;
  categories: string[];
}

export interface CategoryItem {
  slug: string;
  title: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  standards: string[];
  classes?: string[];
  whatsappText?: string;
}

// ── ANALYTICS ─────────────────────────────────────────────────────────

export interface DayStats {
  whatsappClicks: number;
  phoneClicks: number;
  formOpens: number;
  formOpenSessions: number; // уникальные сессии, открывшие форму (для конверсии)
  formSubmits: number;
  fileUploads: number;
}

export type AnalyticsData = Record<string, DayStats>; // key = YYYY-MM-DD

const EMPTY_DAY: DayStats = {
  whatsappClicks: 0, phoneClicks: 0,
  formOpens: 0, formOpenSessions: 0, formSubmits: 0, fileUploads: 0,
};

export async function getAnalytics(): Promise<AnalyticsData> {
  // Аналитику в Blob не держим — это выжигало лимит Hobby. Метрики ведут GA4 + Яндекс.Метрика.
  if (useBlob()) return {};
  return fsRead<AnalyticsData>("analytics.json", {});
}

export async function trackEvent(
  type: keyof DayStats,
  date?: string,
): Promise<void> {
  // В проде (Blob) аналитику НЕ пишем — каждый визит = чтение+запись Blob → выжигание лимита.
  // Метрики уже собирают GA4 и Яндекс.Метрика. Локально (fs) оставляем для дев-отладки.
  if (useBlob()) return;
  const day = date ?? new Date().toISOString().slice(0, 10);
  const data = await getAnalytics();
  const prev: DayStats = { ...EMPTY_DAY, ...data[day] };
  const updated: AnalyticsData = { ...data, [day]: { ...prev, [type]: prev[type] + 1 } };
  fsWrite("analytics.json", updated);
}

// ── EVENT LOG ─────────────────────────────────────────────────────────

export interface EventLog {
  id: string;
  type: "whatsapp" | "phone" | "form_open" | "form_submit";
  timestamp: string;
  category?: string;
  page?: string;
}

export async function getEvents(): Promise<EventLog[]> {
  // Лог событий в Blob не держим (лимит). В проде пусто, локально — fs для отладки.
  if (useBlob()) return [];
  return fsRead<EventLog[]>("events.json", []);
}

export async function addEvent(event: Omit<EventLog, "id">): Promise<void> {
  // В проде (Blob) события НЕ пишем — выжигало лимит. Локально (fs) оставляем.
  if (useBlob()) return;
  const events = await getEvents();
  events.push({ id: Date.now().toString(), ...event });
  const trimmed = events.slice(-1000); // последние 1000
  fsWrite("events.json", trimmed);
}

// ── LEADS ─────────────────────────────────────────────────────────────

export interface Lead {
  id: string; name: string; company: string; phone: string;
  whatsapp?: string; city?: string; message?: string;
  category?: string; searchQuery?: string; createdAt: string;
}

export async function getLeads(): Promise<Lead[]> {
  if (useBlob()) return blobGet<Lead[]>("leads", []);
  return fsRead<Lead[]>("leads.json", []);
}

export async function saveLeads(data: Lead[]) {
  if (useBlob()) { await blobSet("leads", data); return; }
  fsWrite("leads.json", data);
}

// ── GROUPS ────────────────────────────────────────────────────────────

export async function getGroups(): Promise<GroupItem[]> {
  return fsRead<GroupItem[]>("groups.json", []); // статичный контент → git
}

export async function saveGroups(data: GroupItem[]) {
  if (useBlob()) { await blobSet("groups", data); return; }
  fsWrite("groups.json", data);
}

// ── CATEGORIES ────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryItem[]> {
  return fsRead<CategoryItem[]>("categories.json", []); // статичный контент → git
}

export async function saveCategories(data: CategoryItem[]) {
  if (useBlob()) { await blobSet("categories", data); return; }
  fsWrite("categories.json", data);
}

export interface DataSnapshot {
  version: 1;
  exportedAt: string;
  source: "blob" | "fs";
  data: {
    settings: typeof DEFAULT_SETTINGS;
    faq: FAQItem[];
    leads: Lead[];
    groups: GroupItem[];
    categories: CategoryItem[];
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export async function exportDataSnapshot(): Promise<DataSnapshot> {
  const [settings, faq, leads, groups, categories] = await Promise.all([
    getSettings(),
    getFAQ(),
    getLeads(),
    getGroups(),
    getCategories(),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: useBlob() ? "blob" : "fs",
    data: {
      settings,
      faq,
      leads,
      groups,
      categories,
    },
  };
}

export function isDataSnapshot(value: unknown): value is DataSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<DataSnapshot>;

  return (
    snapshot.version === 1 &&
    !!snapshot.data &&
    typeof snapshot.data === "object" &&
    Array.isArray(snapshot.data.faq) &&
    Array.isArray(snapshot.data.leads) &&
    Array.isArray(snapshot.data.groups) &&
    Array.isArray(snapshot.data.categories) &&
    !!snapshot.data.settings
  );
}

export function normalizeDataSnapshot(value: unknown): DataSnapshot | null {
  if (!isPlainObject(value)) return null;

  const root = value as Record<string, unknown>;
  const data = isPlainObject(root.data) ? root.data : null;
  if (!data) return null;

  const faq = Array.isArray(data.faq) ? data.faq : [];
  const leads = Array.isArray(data.leads) ? data.leads : [];
  const groups = Array.isArray(data.groups) ? data.groups : [];
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const settings = isPlainObject(data.settings)
    ? {
        ...DEFAULT_SETTINGS,
        ...data.settings,
      }
    : DEFAULT_SETTINGS;

  return {
    version: 1,
    exportedAt:
      typeof root.exportedAt === "string" && root.exportedAt
        ? root.exportedAt
        : new Date().toISOString(),
    source: root.source === "blob" ? "blob" : "fs",
    data: {
      settings,
      faq: faq as FAQItem[],
      leads: leads as Lead[],
      groups: groups as GroupItem[],
      categories: categories as CategoryItem[],
    },
  };
}

export async function importDataSnapshot(snapshot: DataSnapshot): Promise<void> {
  await Promise.all([
    saveSettings(snapshot.data.settings),
    saveFAQ(snapshot.data.faq),
    saveLeads(snapshot.data.leads),
    saveGroups(snapshot.data.groups),
    saveCategories(snapshot.data.categories),
  ]);
}
