"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { COMPANY } from "@/config/company";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Частые вопросы
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {COMPANY.faq.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
              >
                <span className="font-medium text-slate-900 text-base">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="pb-5 text-slate-600 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
