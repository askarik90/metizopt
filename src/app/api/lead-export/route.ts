import { NextRequest, NextResponse } from "next/server";
import { getLeads } from "@/lib/db";

/**
 * Экспорт заявок для Хаба лидов (pull-модель): хаб сам забирает новые заявки.
 *   GET /api/lead-export?key=<LEADHUB_EXPORT_KEY>&since=<id>
 *   -> { "leads": [ { id, name, phone, email, message, created_at }, ... ] }
 * Защита: ключ из env LEADHUB_EXPORT_KEY (задать в Vercel).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.LEADHUB_EXPORT_KEY || key !== process.env.LEADHUB_EXPORT_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const since = req.nextUrl.searchParams.get("since");

  const all = await getLeads();
  const leads = all
    // id у krp — это Date.now() (13 цифр), поэтому строковое сравнение сохраняет порядок
    .filter((l: { id?: string }) => !since || String(l.id) > String(since))
    .map((l: {
      id?: string; name?: string; phone?: string; message?: string;
      category?: string; searchQuery?: string; company?: string; city?: string; createdAt?: string;
    }) => ({
      id: String(l.id ?? ""),
      name: l.name ?? "",
      phone: l.phone ?? "",
      email: "",
      message: [
        l.message,
        l.category ? `Категория: ${l.category}` : "",
        l.searchQuery ? `Искал: ${l.searchQuery}` : "",
        l.company ? `Компания: ${l.company}` : "",
        l.city ? `Город: ${l.city}` : "",
      ].filter(Boolean).join("\n"),
      created_at: l.createdAt ?? "",
    }));

  return NextResponse.json({ leads });
}
