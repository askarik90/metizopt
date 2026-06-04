import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bgColor, bgImage, overlayOpacity, overlayColor, overlayType } =
      body;

    // Путь к файлу конфига
    const configPath = join(process.cwd(), "src/config/hero-settings.json");

    // Новые настройки
    const heroSettings = {
      bgColor,
      bgImage, // base64 если есть, иначе null
      overlayOpacity,
      overlayColor,
      overlayType,
      approved: true,
      approvedAt: new Date().toISOString(),
    };

    // Сохраняем в файл
    writeFileSync(configPath, JSON.stringify(heroSettings, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Настройки утверждены для production ✅",
      settings: heroSettings,
    });
  } catch (error) {
    console.error("Error saving hero settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - читать текущие настройки
export async function GET() {
  try {
    const configPath = join(process.cwd(), "src/config/hero-settings.json");
    const settings = JSON.parse(readFileSync(configPath, "utf-8"));
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error reading hero settings:", error);
    return NextResponse.json(
      {
        bgColor: "rgb(123, 147, 204)",
        bgImage: null,
        overlayOpacity: 40,
        overlayColor: "#000000",
        overlayType: "solid",
        approved: false,
      },
      { status: 200 }
    );
  }
}
