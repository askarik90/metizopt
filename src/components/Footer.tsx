import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-white font-black text-xl tracking-tighter uppercase mb-4">
              Метиз<span className="text-orange-500">Опт</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Оптовые поставки крепежа, метизов и такелажа в Казахстане.
              Работаем с юридическими лицами.
            </p>
          </div>

          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-tight mb-4">
              Каталог
            </h3>
            <ul className="space-y-2">
              {COMPANY.categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-tight mb-4">
              Компания
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "О компании" },
                { href: "/delivery", label: "Доставка и оплата" },
                { href: "/contacts", label: "Контакты" },
                { href: "/quote", label: "Оставить заявку" },
                { href: "/catalog", label: "Каталог" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-tight mb-4">
              Контакты
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                {COMPANY.address}
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Phone size={16} className="text-orange-500" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <MessageCircle size={16} className="text-green-500" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Mail size={16} className="text-orange-500" />
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <Clock size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div>{COMPANY.workingHours}</div>
                  <div>{COMPANY.workingHoursSat}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {COMPANY.legalName}. Все права защищены.
          </p>
          <p className="text-slate-600 text-xs">
            {COMPANY.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
