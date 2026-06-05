import Link from "next/link";
import type { GroupItem, CategoryItem } from "@/lib/db";

interface CatalogSidebarProps {
  groups: GroupItem[];
  categories: CategoryItem[];
  currentSlug: string;
}

export default function CatalogSidebar({ groups, categories, currentSlug }: CatalogSidebarProps) {
  const catMap = new Map(categories.map((c) => [c.slug, c]));

  return (
    <nav className="overflow-hidden rounded-lg border border-slate-200 bg-white sticky top-24">
      <Link
        href="/catalog"
        className="flex items-center gap-2 bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition-colors"
      >
        Каталог
      </Link>
      <ul>
        {groups.map((group) => {
          const isActiveGroup = group.slug === currentSlug;
          const hasActiveCat = group.categories.includes(currentSlug);
          const isExpanded = isActiveGroup || hasActiveCat;
          const groupCats = group.categories
            .map((s) => catMap.get(s))
            .filter(Boolean) as CategoryItem[];

          return (
            <li key={group.slug} className="border-t border-slate-100">
              <Link
                href={`/catalog/${group.slug}`}
                className={`flex items-center justify-between px-4 py-2.5 text-xs font-black uppercase tracking-tight transition-colors ${
                  isActiveGroup
                    ? "bg-orange-600 text-white"
                    : hasActiveCat
                    ? "bg-orange-50 text-orange-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                }`}
              >
                <span>{group.shortTitle || group.title.split(" оптом")[0]}</span>
                {!isActiveGroup && (
                  <span className="text-[10px] font-normal text-slate-400">
                    {groupCats.length}
                  </span>
                )}
              </Link>
              {isExpanded && groupCats.length > 0 && (
                <ul className="border-t border-slate-100">
                  {groupCats.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/catalog/${cat.slug}`}
                        className={`block border-l-2 py-1.5 pl-6 pr-4 text-xs transition-colors ${
                          cat.slug === currentSlug
                            ? "border-orange-600 bg-orange-50 font-bold text-orange-600"
                            : "border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-orange-600"
                        }`}
                      >
                        {cat.title.replace(" в Алматы", "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
