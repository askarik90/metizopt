import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

interface Settings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  workingHours: string;
  workingHoursSat: string;
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings: Settings = {
      address: "Республика Казахстан, г. Алматы, ул. Нарынкольская, 1А",
      phone: "+7 (708) 800-31-50",
      email: "140@bugel.kz",
      whatsapp: "+7 (771) 070-75-52",
      workingHours: "Пн–Пт: 09:00–18:00",
      workingHoursSat: "Сб: 09:00–14:00",
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const settings = JSON.parse(
      fs.readFileSync(SETTINGS_FILE, "utf-8")
    ) as Settings;
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error reading settings:", error);
    return NextResponse.json(
      { error: "Failed to read settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();

    const settings: Settings = {
      address: body.address || "",
      phone: body.phone || "",
      email: body.email || "",
      whatsapp: body.whatsapp || "",
      workingHours: body.workingHours || "",
      workingHoursSat: body.workingHoursSat || "",
    };

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
