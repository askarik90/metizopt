/**
 * Unified data layer:
 * - Production (Vercel): uses @vercel/kv (Redis)
 * - Development (local): uses filesystem JSON files
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// ── helpers ──────────────────────────────────────────────────────────

function useKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvGet<T>(key: string): Promise<T | null> {
  const { kv } = await import("@vercel/kv");
  return kv.get<T>(key);
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(key, value);
}

function fsRead<T>(filename: string, fallback: T): T {
  try {
    const file = path.join(DATA_DIR, filename);
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
    }
  } catch {}
  return fallback;
}

function fsWrite<T>(filename: string, data: T): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// ── SETTINGS ─────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  address: "Республика Казахстан, г. Алматы, ул. Нарынкольская, 1А",
  phone: "+7 (708) 800-31-50",
  email: "140@bugel.kz",
  whatsapp: "+7 (771) 070-75-52",
  workingHours: "Пн–Пт: 09:00–18:00",
  workingHoursSat: "Сб: 09:00–14:00",
};

export async function getSettings() {
  if (useKV()) {
    return (await kvGet<typeof DEFAULT_SETTINGS>("settings")) ?? DEFAULT_SETTINGS;
  }
  return fsRead("settings.json", DEFAULT_SETTINGS);
}

export async function saveSettings(data: typeof DEFAULT_SETTINGS) {
  if (useKV()) {
    await kvSet("settings", data);
  } else {
    fsWrite("settings.json", data);
  }
}

// ── FAQ ───────────────────────────────────────────────────────────────

export interface FAQItem { id: string; question: string; answer: string }

export async function getFAQ(): Promise<FAQItem[]> {
  if (useKV()) {
    return (await kvGet<FAQItem[]>("faq")) ?? [];
  }
  return fsRead<FAQItem[]>("faq.json", []);
}

export async function saveFAQ(data: FAQItem[]) {
  if (useKV()) {
    await kvSet("faq", data);
  } else {
    fsWrite("faq.json", data);
  }
}

// ── LEADS ─────────────────────────────────────────────────────────────

export interface Lead {
  id: string; name: string; company: string; phone: string;
  whatsapp?: string; city?: string; message?: string;
  category?: string; createdAt: string;
}

export async function getLeads(): Promise<Lead[]> {
  if (useKV()) {
    return (await kvGet<Lead[]>("leads")) ?? [];
  }
  return fsRead<Lead[]>("leads.json", []);
}

export async function saveLeads(data: Lead[]) {
  if (useKV()) {
    await kvSet("leads", data);
  } else {
    fsWrite("leads.json", data);
  }
}

// ── GROUPS ────────────────────────────────────────────────────────────

export async function getGroups() {
  if (useKV()) {
    const kv = await kvGet<unknown[]>("groups");
    if (kv && kv.length > 0) return kv;
  }
  return fsRead<unknown[]>("groups.json", []);
}

export async function saveGroups(data: unknown[]) {
  if (useKV()) {
    await kvSet("groups", data);
  } else {
    fsWrite("groups.json", data);
  }
}

// ── CATEGORIES ────────────────────────────────────────────────────────

export async function getCategories() {
  if (useKV()) {
    const kv = await kvGet<unknown[]>("categories");
    if (kv && kv.length > 0) return kv;
  }
  return fsRead<unknown[]>("categories.json", []);
}

export async function saveCategories(data: unknown[]) {
  if (useKV()) {
    await kvSet("categories", data);
  } else {
    fsWrite("categories.json", data);
  }
}
