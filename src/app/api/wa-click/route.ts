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
    };

    // Fire-and-forget: шлём маячок в CRM, но не ждём
    sendWaClickBeacon(fields).catch(() => {
      // Тихо игнорируем ошибки отправки
    });

    // Сразу возвращаем 204 (no content) чтобы не блокировать пользователя
    return new NextResponse(null, { status: 204 });
  } catch {
    // Невалидный JSON или другая ошибка — 400
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
