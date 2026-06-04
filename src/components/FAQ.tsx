"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { COMPANY } from "@/config/company";
import { useFAQ } from "@/hooks/useFAQ";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { faqs, loading } = useFAQ();

  // Fallback to company config if faqs not loaded
  const faqItems = faqs && faqs.length > 0 ? faqs : COMPANY.faq;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Частые вопросы
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqItems.map((item: any, i: number) => {
            const id = item.id || i;
            const question = item.question || item.q;
            const answer = item.answer || item.a;

            return (
              <div key={id}>
                <button
                  onClick={() => setOpenId(openId === id ? null : id)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-orange-600 transition"
                >
                  <span className="font-medium text-slate-900 text-base">
                    {question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-slate-400 transition-transform ${
                      openId === id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openId === id && (
                  <div className="pb-5 text-slate-600 leading-relaxed">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
