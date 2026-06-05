import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function BreadcrumbNav({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="border-b border-slate-200 bg-white py-2.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-xs">
          <li>
            <Link href="/" className="text-slate-400 hover:text-orange-600 transition-colors">
              Главная
            </Link>
          </li>
          {crumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
              {crumb.href ? (
                <Link href={crumb.href} className="text-slate-500 hover:text-orange-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-medium">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
