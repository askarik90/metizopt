import { NextRequest, NextResponse } from "next/server";
import { Lead, LeadResponse } from "@/types/lead";
import { sendLeadNotification } from "@/lib/email";

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
      search_query: body.search_query || "",
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

    // Save to leads storage
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: lead.name,
            company: lead.company,
            phone: lead.phone,
            whatsapp: lead.whatsapp,
            city: lead.city,
            message: lead.message,
            category: lead.category,
            searchQuery: lead.search_query,
            fileUrl: lead.fileUrl,
            pageUrl: lead.page_url,
          }),
        }
      );
      const savedLead = await response.json();
      console.log("✅ Lead saved to storage:", savedLead.lead?.id);
    } catch (storageError) {
      console.error("Warning: Could not save to storage:", storageError);
      // Continue anyway - lead is logged
    }

    // --- EMAIL NOTIFICATION ---
    sendLeadNotification({
      name: lead.name,
      phone: lead.phone,
      company: lead.company,
      city: lead.city,
      message: lead.message,
      category: lead.category,
      searchQuery: lead.search_query,
      pageUrl: lead.page_url,
      utm_source: lead.utm_source,
      utm_campaign: lead.utm_campaign,
    }).catch((e) => console.error("Email send error:", e));

    // --- CRM WEBHOOK (подключить позже) ---
    // const webhookUrl = process.env.CRM_WEBHOOK_URL;
    // if (webhookUrl) { await fetch(webhookUrl, { ... }); }

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
