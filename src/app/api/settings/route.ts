import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error reading settings:", error);
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const address = formData.get("address");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const whatsapp = formData.get("whatsapp");
    const workingHours = formData.get("workingHours");
    const workingHoursSat = formData.get("workingHoursSat");

    const settings = {
      address: address?.toString() || "",
      phone: phone?.toString() || "",
      email: email?.toString() || "",
      whatsapp: whatsapp?.toString() || "",
      workingHours: workingHours?.toString() || "",
      workingHoursSat: workingHoursSat?.toString() || "",
    };

    await saveSettings(settings);
    return NextResponse.redirect(new URL("/admin/settings?saved=true", request.url), { status: 303 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.redirect(new URL("/admin/settings?error=true", request.url), { status: 303 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, phone, email, whatsapp, workingHours, workingHoursSat } = body;
    const settings = { address, phone, email, whatsapp, workingHours, workingHoursSat };
    await saveSettings(settings);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
