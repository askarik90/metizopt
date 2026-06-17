import { NextRequest, NextResponse } from "next/server";
import { Lead, LeadResponse } from "@/types/lead";
import { sendLeadNotification } from "@/lib/email";
import { getLeads, saveLeads, addEvent } from "@/lib/db";

// Анти-спам: лимит заявок с одного IP (best-effort, в памяти инстанса).
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 минут
const MAX_PER_WINDOW = 6;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  if (HITS.size > 5000) HITS.clear(); // защита от роста памяти
  return arr.length > MAX_PER_WINDOW;
}

// Ограничение длины строковых полей — против огромных payload'ов.
const cap = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");

export async function POST(req: NextRequest): Promise<NextResponse<LeadResponse>> {
  try {
    const body = await req.json();

    // Honeypot: скрытое поле company_site боты заполняют, люди — нет.
    // Тихо «принимаем» (чтобы бот не понял), но НЕ сохраняем и не шлём.
    if (typeof body.company_site === "string" && body.company_site.trim()) {
      return NextResponse.json({ success: true, message: "Заявка принята", leadId: `lead_${Date.now()}` });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Слишком много заявок. Попробуйте через несколько минут или позвоните нам." },
        { status: 429 }
      );
    }

    const lead: Lead = {
      name: cap(body.name, 120),
      company: cap(body.company, 200),
      phone: cap(body.phone, 40),
      whatsapp: cap(body.whatsapp, 40),
      city: cap(body.city, 80),
      message: cap(body.message, 3000),
      category: cap(body.category, 200),
      search_query: cap(body.search_query, 200),
      fileUrl: cap(body.fileUrl, 500),
      page_url: cap(body.page_url, 500),
      utm_source: cap(body.utm_source, 100),
      utm_medium: cap(body.utm_medium, 100),
      utm_campaign: cap(body.utm_campaign, 100),
      utm_content: cap(body.utm_content, 100),
      utm_term: cap(body.utm_term, 100),
      created_at: new Date().toISOString(),
    };

    if (!lead.name || !lead.phone) {
      return NextResponse.json(
        { success: false, message: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    console.log("NEW LEAD:", lead.name, lead.phone, lead.category);

    // Заявку нельзя терять: считаем принятой только если сохранилась хотя бы в один
    // надёжный канал (Blob или email). Иначе вернём ошибку, чтобы форма не показала «успех».
    let blobOk = false;
    let emailOk = false;

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
      blobOk = true;
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
      emailOk = true;
    } catch (e) {
      console.error("Email send error:", e);
    }

    if (!blobOk && !emailOk) {
      return NextResponse.json(
        { success: false, message: "Не удалось принять заявку, позвоните нам, пожалуйста" },
        { status: 503 }
      );
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
