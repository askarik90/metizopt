"use client";
import Link from "next/link";
import { COMPANY } from "@/config/company";
import {
  Wrench, Wind, BarChart3, Star, Link2,
  Zap, Droplet, Pin,
} from "lucide-react";

const GROUP_ICONS: Record<string, React.ElementType> = {
  krepezh: Wrench,
  ventilatsiya: Wind,
  perfo: BarChart3,
  nerzhaveyushchiy: Star,
  takelazh: Link2,
  kanaty: Link2,
  elektrody: Zap,
  shlangi: Droplet,
};

export default function GroupsSection() {
  return (
    <section className="bg-white py-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Категории по группам
          </h2>
          <p className="text-slate-500">
            Выберите группу товаров — познакомьтесь со всеми подкатегориями
          </p>
        </div>

        {/* Сетка групп */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPANY.groups.map((group) => {
            const Icon = GROUP_ICONS[group.slug] || Wrench;
            const categoryCount = group.categories.length;

            return (
              <Link
                key={group.slug}
                href={`/catalog/${group.slug}`}
                className="group flex flex-col p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-orange-400 hover:shadow-lg hover:from-orange-50 transition-all duration-200"
              >
                {/* Иконка */}
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Icon size={24} className="text-orange-600" />
                </div>

                {/* Название */}
                <h3 className="font-black text-slate-900 text-base uppercase tracking-tight mb-2 group-hover:text-orange-600 transition-colors">
                  {group.shortTitle}
                </h3>

                {/* Описание */}
                <p className="text-slate-600 text-sm leading-snug mb-4 flex-grow">
                  {group.desc}
                </p>

                {/* Количество категорий */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500">
                    {categoryCount} {categoryCount === 1 ? "категория" : "категорий"}
                  </span>
                  <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Подсказка */}
        <div className="mt-10 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Совет:</strong> Каждая группа содержит все подкатегории с полным описанием,
            техническими характеристиками и возможностью заказать товары оптом.
          </p>
        </div>
      </div>
    </section>
  );
}
