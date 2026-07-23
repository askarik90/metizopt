"use client";
import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, MessageCircle, Phone } from "lucide-react";
import { COMPANY, getWhatsAppUrl } from "@/config/company";

export default function ThanksPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "lead_form_submit_success" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
          Заявка принята
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          Менеджер свяжется с вами и подготовит коммерческое предложение.
          Обычно это занимает не более 30 минут.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-medium transition-colors"
          >
            <MessageCircle size={20} />
            Написать в WhatsApp
          </a>
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            className="flex items-center justify-center gap-2 border border-slate-500 text-slate-300 hover:border-white hover:text-white px-6 py-3.5 font-medium transition-colors"
          >
            <Phone size={20} />
            Позвонить
          </a>
        </div>
        <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
          ← На главную
        </Link>
      </div>
    </div>
  );
}
