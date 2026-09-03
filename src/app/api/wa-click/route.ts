import { NextRequest, NextResponse } from "next/server";
import { sendWaClickBeacon, type WaClickBeaconFields } from "@/lib/email";

/**
 * POST /api/wa-click
 *
 * Принимает маячок клика WhatsApp с атрибуцией.
 * Валидирует токен, отправляет email-письмо в CRM.
 *
 * Body: {
 *   token: "KRP-XXXXXXXXXXXXXXXX",
 *   gclid?: string,
 *   gbraid?: string,
 *   wbraid?: string,
 *   utm_source?: string,
 *   utm_medium?: string,
 *   utm_campaign?: string,
 *   utm_content?: string,
 *   utm_term?: string,
 *   landing_page?: string
 * }
 */

interface WaClickBody {
  token?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  ga_client_id?: string;
  ga_session_id?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: WaClickBody = await req.json();

    // Валидация токена
    if (!body.token || !/^KRP-[A-Z2-7]{16}$/.test(body.token)) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
    }

    // Берём только известные поля
    const fields: WaClickBeaconFields = {
      token: body.token,
      gclid: body.gclid,
      gbraid: body.gbraid,
      wbraid: body.wbraid,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_content: body.utm_content,
      utm_term: body.utm_term,
      landing_page: body.landing_page,
      ga_client_id: body.ga_client_id,
      ga_session_id: body.ga_session_id,
    };

    // ВАЖНО: на Vercel serverless нельзя fire-and-forget после ответа — функция
    // замораживается и письмо не успевает уйти. Клиент и так не ждёт (keepalive fetch),
    // поэтому ДОЖИДАЕМСЯ отправки письма здесь. Ошибку глушим (маячок не критичен для UX).
    try {
      await sendWaClickBeacon(fields);
    } catch {
      // маячок не ушёл — не страшно, лид всё равно придёт (просто без атрибуции)
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    // Невалидный JSON или другая ошибка — 400
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
