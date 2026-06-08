import characteristicsIndex from "@/data/characteristics-index.json";

interface Props {
  slug: string;
}

type IndexEntry = {
  itemCount: number;
  inStockCount: number;
  standards: string[];
  sizes: string[];
  coatings: string[];
  strengthClasses: string[];
  searchTerms: string[];
};

const index = characteristicsIndex as Record<string, IndexEntry>;

export default function CategoryCharacteristics({ slug }: Props) {
  const data = index[slug];
  if (!data || data.itemCount === 0) return null;

  const hasStandards = data.standards.length > 0;
  const hasCoatings = data.coatings.length > 0;
  const hasClasses = data.strengthClasses.length > 0;
  const hasSizes = data.sizes.length > 0;

  // Показываем только если есть хоть что-то кроме счётчика
  if (!hasStandards && !hasCoatings && !hasClasses && !hasSizes) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
          Характеристики
        </h2>
        <span className="text-sm text-slate-500">
          {data.inStockCount > 0 && (
            <span className="text-green-600 font-medium">{data.inStockCount} в наличии</span>
          )}
          {data.itemCount > data.inStockCount && (
            <span className="text-slate-400"> / {data.itemCount} позиций</span>
          )}
        </span>
      </div>

      <dl className="space-y-3 text-sm">
        {hasStandards && (
          <div className="flex gap-3">
            <dt className="w-36 flex-shrink-0 text-slate-500 font-medium">Стандарты</dt>
            <dd className="flex flex-wrap gap-1">
              {data.standards.slice(0, 12).map((s) => (
                <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono">
                  {s}
                </span>
              ))}
              {data.standards.length > 12 && (
                <span className="text-slate-400 text-xs self-center">+{data.standards.length - 12}</span>
              )}
            </dd>
          </div>
        )}

        {hasSizes && (
          <div className="flex gap-3">
            <dt className="w-36 flex-shrink-0 text-slate-500 font-medium">Размеры</dt>
            <dd className="text-slate-700">
              {data.sizes.slice(0, 8).join(", ")}
              {data.sizes.length > 8 && <span className="text-slate-400"> и др.</span>}
            </dd>
          </div>
        )}

        {hasCoatings && (
          <div className="flex gap-3">
            <dt className="w-36 flex-shrink-0 text-slate-500 font-medium">Покрытие</dt>
            <dd className="text-slate-700">{data.coatings.join(", ")}</dd>
          </div>
        )}

        {hasClasses && (
          <div className="flex gap-3">
            <dt className="w-36 flex-shrink-0 text-slate-500 font-medium">Класс прочности</dt>
            <dd className="flex gap-1 flex-wrap">
              {data.strengthClasses.map((c) => (
                <span key={c} className="bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded text-xs font-medium">
                  {c}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
