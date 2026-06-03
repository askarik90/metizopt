"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMPANY, getWhatsAppUrl } from "@/config/company";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { useAnalytics, getUtmParams } from "@/hooks/useAnalytics";
import { useRouter } from "next/navigation";

function ContactForm() {
  const router = useRouter();
  const { trackLeadFormSubmit } = useAnalytics();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Укажите имя и телефон"); return; }
    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          page_url: window.location.href,
          ...getUtmParams(),
        }),
      });
      trackLeadFormSubmit();
      router.push("/thanks");
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h3 className="font-black text-slate-900 text-xl uppercase tracking-tight">
        Написать нам
      </h3>
      <input name="name" value={form.name} onChange={handleChange}
        placeholder="Ваше имя *"
        className="w-full border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500" />
      <input name="phone" value={form.phone} onChange={handleChange}
        placeholder="Телефон *"
        className="w-full border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500" />
      <textarea name="message" value={form.message} onChange={handleChange}
        placeholder="Сообщение" rows={4}
        className="w-full border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 resize-none" />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" disabled={loading}
        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 font-medium transition-colors">
        {loading ? "Отправляем..." : "Отправить"}
      </button>
    </form>
  );
}

export default function ContactsPage() {
  const { trackWhatsAppClick, trackPhoneClick } = useAnalytics();

  return (
    <>
      <Header />
      <main>
        <section className="bg-slate-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">
              Контакты
            </h1>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.9206584748837!2d76.94160277350267!3d43.23816197107937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836ec8b7d3e3dd%3A0x1234567890!2z0KeU0LDQtdGA0LPRitGB0LrQsCDQnNCw0LvQtdC90YHRgtC-0YLQviDQndC70Y_QvdC-0LLQutC80LXQvQ!5e0!3m2!1sru!2skz!4v1686741234567"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Адрес</div>
                    <div className="text-slate-600">{COMPANY.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Телефон</div>
                    <a href={`tel:${COMPANY.phoneRaw}`} onClick={trackPhoneClick}
                      className="text-slate-600 hover:text-orange-600">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle size={20} className="text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">WhatsApp</div>
                    <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick()}
                      className="text-slate-600 hover:text-green-600">
                      Написать в WhatsApp
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Email</div>
                    <a href={`mailto:${COMPANY.email}`} className="text-slate-600 hover:text-orange-600">
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Режим работы</div>
                    <div className="text-slate-600">{COMPANY.workingHours}</div>
                    <div className="text-slate-600">{COMPANY.workingHoursSat}</div>
                  </div>
                </div>
              </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
