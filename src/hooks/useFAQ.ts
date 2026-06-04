import { useState, useEffect } from "react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      const res = await fetch("/api/faq", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch FAQ");
      const data = await res.json();
      setFaqs(data.faq || []);
    } catch (err) {
      console.error("Error fetching FAQ:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { faqs, loading, error };
}
