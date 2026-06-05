import sanitizeHtml from "sanitize-html";

// Безопасное подмножество тегов для «Полного описания».
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "a",
];

/**
 * Чистит HTML из редактора перед выводом на публичный сайт.
 * Обратная совместимость: старые описания — это простой текст с переносами,
 * поэтому если тегов нет, переводы строк превращаем в <br>.
 */
export function sanitizeRichText(input?: string | null): string {
  if (!input) return "";
  const hasTags = /<[a-z][\s\S]*>/i.test(input);
  const html = hasTags ? input : input.replace(/\n/g, "<br>");
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
  });
}
