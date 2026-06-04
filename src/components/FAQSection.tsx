"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useFAQ } from "@/hooks/useFAQ";

export default function FAQSection() {
  const { faqs, loading } = useFAQ();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) return null;
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Найдите ответы на самые популярные вопросы о нашей работе, условиях доставки и оплате
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-slate-200 rounded-lg overflow-hidden hover:border-orange-400 transition"
            >
              {/* Question */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
              >
                <span className="font-bold text-slate-900">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-orange-600 flex-shrink-0 transition-transform ${
                    expandedId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {expandedId === faq.id && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Не нашли ответ на свой вопрос?
          </p>
          <a
            href="/contacts"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:-translate-y-0.5"
          >
            Свяжитесь с нами
          </a>
        </div>
      </div>
    </section>
  );
}
