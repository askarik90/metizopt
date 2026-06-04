"use client";

import { useEffect, useState } from "react";

export default function DesignToggle() {
  const [variant, setVariant] = useState<1 | 2>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("design-variant");
    if (saved === "2") setVariant(2);
  }, []);

  const handleToggle = (v: 1 | 2) => {
    setVariant(v);
    localStorage.setItem("design-variant", String(v));
    document.documentElement.setAttribute("data-design-variant", String(v));
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-lg p-1 flex gap-1 border border-slate-200">
      <button
        onClick={() => handleToggle(1)}
        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
          variant === 1
            ? "bg-orange-600 text-white shadow-md"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        V1: Текущий
      </button>
      <button
        onClick={() => handleToggle(2)}
        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
          variant === 2
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        V2: Улучшенный
      </button>
    </div>
  );
}
