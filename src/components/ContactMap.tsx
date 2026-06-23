import { COMPANY, getWhatsAppUrl } from "@/config/company";

interface ContactMapProps {
  settings: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    workingHours: string;
    workingHoursSat: string;
  };
}

export default function ContactMap({ settings }: ContactMapProps) {
  const { lat, lng } = COMPANY.coordinates;
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.755917768508!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38a68%3A0x0!2zTWFyaw!5e0!3m2!1sru!2skz!4v1234567890`;
  const phoneRaw = settings.phone.replace(/\D/g, "");
  // Ссылки «построить маршрут» к складу (открываются на карте с маршрутом от пользователя)
  const routeYandex = `https://yandex.ru/maps/?rtext=~${lat}%2C${lng}&rtt=auto`;
  const routeGoogle = `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`;
  const route2gis = `https://2gis.kz/almaty/directions/points/%7C${lng}%2C${lat}`;
  const navBtn = "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-400 hover:text-orange-600";

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">
              Наш адрес
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-2">
                  Адрес
                </p>
                <p className="text-lg text-slate-900">{settings.address}</p>
                <div className="mt-3">
                  <p className="text-xs font-bold uppercase tracking-tight text-slate-500 mb-2">
                    Построить маршрут
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href={routeYandex} target="_blank" rel="noopener noreferrer" className={navBtn}>
                      Яндекс Карты
                    </a>
                    <a href={routeGoogle} target="_blank" rel="noopener noreferrer" className={navBtn}>
                      Google Maps
                    </a>
                    <a href={route2gis} target="_blank" rel="noopener noreferrer" className={navBtn}>
                      2ГИС
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-2">
                  Телефон
                </p>
                <a
                  href={`tel:+${phoneRaw}`}
                  className="text-lg text-orange-600 hover:text-orange-700 transition-colors font-semibold"
                >
                  {settings.phone}
                </a>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-2">
                  WhatsApp
                </p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Написать в WhatsApp
                </a>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-lg text-orange-600 hover:text-orange-700 transition-colors font-semibold"
                >
                  {settings.email}
                </a>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight mb-2">
                  Время работы
                </p>
                <div className="text-slate-900">
                  <p>{settings.workingHours}</p>
                  <p>{settings.workingHoursSat}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden shadow-lg h-96 lg:h-full">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
