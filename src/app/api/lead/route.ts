import { NextRequest, NextResponse } from "next/server";
import { Lead, LeadResponse } from "@/types/lead";

export async function POST(req: NextRequest): Promise<NextResponse<LeadResponse>> {
  try {
    const body = await req.json();

    const lead: Lead = {
      name: body.name,
      company: body.company || "",
      phone: body.phone,
      whatsapp: body.whatsapp || "",
      city: body.city || "",
      message: body.message || "",
      category: body.category || "",
      fileUrl: body.fileUrl || "",
      page_url: body.page_url || "",
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      utm_content: body.utm_content || "",
      utm_term: body.utm_term || "",
      created_at: new Date().toISOString(),
    };

    if (!lead.name || !lead.phone) {
      return NextResponse.json(
        { success: false, message: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    console.log("NEW LEAD:", JSON.stringify(lead, null, 2));

    // --- CRM WEBHOOK ---
    // const webhookUrl = process.env.CRM_WEBHOOK_URL;
    // if (webhookUrl) {
    //   await fetch(webhookUrl, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(lead),
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: "Заявка принята",
      leadId: `lead_${Date.now()}`,
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
