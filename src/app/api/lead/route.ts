import { NextRequest, NextResponse } from "next/server";
import { Lead, LeadResponse } from "@/types/lead";
import { sendLeadNotification } from "@/lib/email";
import { getLeads, saveLeads, addEvent } from "@/lib/db";

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

    // Сохраняем напрямую через db — без внутреннего HTTP-запроса
    try {
      const leads = await getLeads();
      const newEntry = {
        id: Date.now().toString(),
        name: lead.name,
        company: lead.company || "",
        phone: lead.phone,
        whatsapp: lead.whatsapp || "",
        city: lead.city || "",
        message: lead.message || "",
        category: lead.category || "",
        searchQuery: lead.search_query || "",
        createdAt: lead.created_at,
      };
      leads.push(newEntry);
      await saveLeads(leads);
      console.log("✅ Lead saved to Blob:", newEntry.id);
      await addEvent({
        type: "form_submit",
        timestamp: lead.created_at,
        category: lead.category || undefined,
        page: lead.page_url || undefined,
      });
    } catch (storageError) {
      console.error("Warning: Could not save to Blob:", storageError);
    }

    // --- EMAIL NOTIFICATION ---
    try {
      await sendLeadNotification({
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
      });
      console.log("✅ Email sent successfully");
    } catch (e) {
      console.error("Email send error:", e);
    }

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
