// Домен krp.kz раньше был музыкальным порталом KURMET-RECORDS; старые URL вида
// http://krp.kz/ru/musica/..., /ru/shopping/... до сих пор в индексе Google.
// Отдаём им 410 Gone (страница удалена навсегда) — более сильный сигнал, чем 404,
// чтобы Google быстрее выкинул легаси из выдачи. На новом сайте роутов с префиксом /ru нет,
// поэтому catch-all ничего живого не перехватывает.
export const dynamic = "force-dynamic";

function gone(): Response {
  return new Response("410 Gone — страница удалена", {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const GET = gone;
export const HEAD = gone;
