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

/**
 * Главная категория для вида товара, который лежит в нескольких категориях сразу (24.09.2026: «Заклепка А2»
 * есть и в «Заклёпках», и в «Нержавеющем крепеже» — две одинаковые страницы-близнеца). Каноническая —
 * в обычном крепеже (krepezh-*), иначе первая по порядку дерева; дубль ссылается на неё canonical и не идёт в sitemap.
 */
export function primaryCategoryForType(
  tree: Record<string, { types?: { slug: string }[] }>,
  typeSlug: string,
  current: string,
): string {
  const owners = Object.entries(tree)
    .filter(([, node]) => node.types?.some((t) => t.slug === typeSlug))
    .map(([slug]) => slug);
  if (owners.length < 2) return current;
  return owners.find((s) => s.startsWith("krepezh-")) ?? owners[0];
}
