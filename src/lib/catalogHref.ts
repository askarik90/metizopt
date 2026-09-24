/**
 * Старые короткие slug'и категорий крепежа из COMPANY.categories → настоящие адреса каталога (data/categories.json).
 *
 * Каталожный блок (HierarchicalCatalog) и подвал до загрузки данных рисуют категории из конфига, и в HTML попадали
 * ссылки вида /catalog/bolty → 404 (аудит 24.09.2026: 11 битых ссылок с главной и /catalog — их видит Google и
 * посетитель до гидрации). Короткие slug'и остаются ключами картинок/иконок, поэтому меняем не их, а адрес ссылки.
 * Старые адреса дополнительно перенаправляются навсегда (next.config.ts) — на случай внешних ссылок и индекса.
 */
export const LEGACY_CATEGORY_SLUGS: Record<string, string> = {
  bolty: "krepezh-bolty",
  gayki: "krepezh-gayki",
  shayby: "krepezh-shayby",
  vinty: "krepezh-vintyi",
  ankera: "krepezh-ankera",
  shplinty: "krepezh-shplinty",
  dyubelya: "krepezh-dyubela",
  shurupy: "krepezh-samorezi",
  shpilki: "krepezh-shpilki",
  zaklepki: "krepezh-zaklepki",
  gvozdi: "krepezh-gvozdi",
};

/** Адрес страницы категории/группы каталога с учётом старых slug'ов. */
export function catalogHref(slug: string): string {
  return `/catalog/${LEGACY_CATEGORY_SLUGS[slug] ?? slug}`;
}
