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
    const { head, getDownloadUrl } = await import("@vercel/blob");
    const blob = await head(`krp/${key}.json`);
    if (!blob) return fallback;
    const downloadUrl = getDownloadUrl(blob.url);
    const res = await fetch(downloadUrl);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function blobSet<T>(key: string, value: T): Promise<void> {
  const { put } = await import("@vercel/blob");
  // Use Buffer with explicit utf-8 encoding to preserve Cyrillic characters
  const buf = Buffer.from(JSON.stringify(value, null, 2), "utf-8");
  await put(`krp/${key}.json`, buf, {
    access: "private",
    addRandomSuffix: false,
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

// ── LEADS ─────────────────────────────────────────────────────────────

export interface Lead {
  id: string; name: string; company: string; phone: string;
  whatsapp?: string; city?: string; message?: string;
  category?: string; createdAt: string;
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

export async function getGroups(): Promise<unknown[]> {
  if (useBlob()) {
    const data = await blobGet<unknown[]>("groups", []);
    if (data.length > 0) return data;
  }
  return fsRead<unknown[]>("groups.json", []);
}

export async function saveGroups(data: unknown[]) {
  if (useBlob()) { await blobSet("groups", data); return; }
  fsWrite("groups.json", data);
}

// ── CATEGORIES ────────────────────────────────────────────────────────

export async function getCategories(): Promise<unknown[]> {
  if (useBlob()) {
    const data = await blobGet<unknown[]>("categories", []);
    if (data.length > 0) return data;
  }
  return fsRead<unknown[]>("categories.json", []);
}

export async function saveCategories(data: unknown[]) {
  if (useBlob()) { await blobSet("categories", data); return; }
  fsWrite("categories.json", data);
}
