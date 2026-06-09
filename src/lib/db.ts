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
    if (!result || result.statusCode !== 200 || !result.stream) return fallback;
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
  workingHoursSat: "Сб: 09:00–14:00",
};

export async function getSettings() {
  if (useBlob()) return blobGet("settings", DEFAULT_SETTINGS);
  return fsRead("settings.json", DEFAULT_SETTINGS);
}

export async function saveSettings(data: typeof DEFAULT_SETTINGS) {
  if (useBlob()) { await blobSet("settings", data); return; }
  fsWrite("settings.json", data);
}

// ── FAQ ───────────────────────────────────────────────────────────────

export interface FAQItem { id: string; question: string; answer: string }

export async function getFAQ(): Promise<FAQItem[]> {
  if (useBlob()) return blobGet<FAQItem[]>("faq", []);
  return fsRead<FAQItem[]>("faq.json", []);
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
  formSubmits: number;
  fileUploads: number;
}

export type AnalyticsData = Record<string, DayStats>; // key = YYYY-MM-DD

const EMPTY_DAY: DayStats = {
  whatsappClicks: 0, phoneClicks: 0,
  formOpens: 0, formSubmits: 0, fileUploads: 0,
};

export async function getAnalytics(): Promise<AnalyticsData> {
  if (useBlob()) return blobGet<AnalyticsData>("analytics", {});
  return fsRead<AnalyticsData>("analytics.json", {});
}

export async function trackEvent(
  type: keyof DayStats,
  date?: string,
): Promise<void> {
  const day = date ?? new Date().toISOString().slice(0, 10);
  const data = await getAnalytics();
  const prev = data[day] ?? { ...EMPTY_DAY };
  const updated: AnalyticsData = { ...data, [day]: { ...prev, [type]: prev[type] + 1 } };
  if (useBlob()) { await blobSet("analytics", updated); return; }
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
  if (useBlob()) return blobGet<EventLog[]>("events", []);
  return fsRead<EventLog[]>("events.json", []);
}

export async function addEvent(event: Omit<EventLog, "id">): Promise<void> {
  const events = await getEvents();
  events.push({ id: Date.now().toString(), ...event });
  // Храним последние 1000 событий
  const trimmed = events.slice(-1000);
  if (useBlob()) { await blobSet("events", trimmed); return; }
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
  if (useBlob()) {
    const data = await blobGet<GroupItem[]>("groups", []);
    if (data.length > 0) return data;
  }
  return fsRead<GroupItem[]>("groups.json", []);
}

export async function saveGroups(data: GroupItem[]) {
  if (useBlob()) { await blobSet("groups", data); return; }
  fsWrite("groups.json", data);
}

// ── CATEGORIES ────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryItem[]> {
  if (useBlob()) {
    const data = await blobGet<CategoryItem[]>("categories", []);
    if (data.length > 0) return data;
  }
  return fsRead<CategoryItem[]>("categories.json", []);
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
