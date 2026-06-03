"use client";
import { Upload, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, COMPANY } from "@/config/company";
import { useAnalytics } from "@/hooks/useAnalytics";

interface UploadRequestBlockProps {
  onUploadClick?: () => void;
}

export default function UploadRequestBlock({ onUploadClick }: UploadRequestBlockProps) {
  const { trackWhatsAppClick } = useAnalytics();

  const formats = ["XLS", "PDF", "JPG", "PNG", "DOCX"];

  return (
    <section className="bg-slate-900 border-y border-slate-700 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-3">
              Не хотите искать товары в каталоге?
            </h2>
            <p className="text-slate-300 text-lg max-w-xl">
              Просто отправьте список. Мы сами разберём позиции, проверим наличие,
              подберём аналоги и подготовим КП.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-slate-500 text-sm">Принимаем:</span>
              {formats.map((f) => (
                <span
                  key={f}
                  className="bg-slate-800 border border-slate-600 text-slate-300 text-xs font-medium px-2 py-1"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={onUploadClick}
              className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 font-medium text-base transition-colors min-h-[48px]"
            >
              <Upload size={20} />
              Загрузить список
            </button>
            <a
              href={getWhatsAppUrl(COMPANY.whatsappDefaultText)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick()}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-medium text-base transition-colors min-h-[48px]"
            >
              <MessageCircle size={20} />
              Отправить фото в WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
