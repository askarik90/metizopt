import { getCategories, getImagePositions } from "@/lib/db";
import catalogTreeJson from "@/data/catalog-tree.json";
import { getCategoryImage, getTypeImage } from "@/lib/categoryImages";
import ImagePositionsEditor from "./Editor";

export const dynamic = "force-dynamic";

type TypeNode = { slug: string; name: string };
const tree = catalogTreeJson as Record<string, { types?: TypeNode[] }>;

export default async function ImagePositionsPage() {
  const [categories, positions] = await Promise.all([getCategories(), getImagePositions()]);

  const items: { slug: string; label: string; img: string }[] = [];
  for (const c of categories) {
    const img = getCategoryImage(c.slug);
    if (img) items.push({ slug: c.slug, label: c.title, img });
  }
  for (const [cslug, node] of Object.entries(tree)) {
    for (const t of node.types ?? []) {
      const img = getTypeImage(t.slug);
      if (img) items.push({ slug: t.slug, label: `${cslug} › ${t.name}`, img });
    }
  }
  // дедуп по slug (один и тот же вид может встречаться в нескольких категориях)
  const seen = new Set<string>();
  const uniq = items.filter((i) => (seen.has(i.slug) ? false : (seen.add(i.slug), true)));

  return <ImagePositionsEditor items={uniq} initial={positions} />;
}
