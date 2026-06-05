"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Edit2 } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      const res = await fetch("/api/faq");
      const data = await res.json();
      setFaqs(data.faq);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      alert("Заполните все поля");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch("/api/faq", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            question: formData.question,
            answer: formData.answer,
          }),
        });

        if (res.ok) {
          setFaqs(
            faqs.map((f) =>
              f.id === editingId
                ? { ...f, question: formData.question, answer: formData.answer }
                : f
            )
          );
        }
      } else {
        // Create
        const res = await fetch("/api/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: formData.question,
            answer: formData.answer,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setFaqs([...faqs, data.item]);
        }
      }

      setFormData({ question: "", answer: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Ошибка при сохранении");
    }
  };

  const handleEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот вопрос?")) return;

    try {
      const res = await fetch(`/api/faq?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs(faqs.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ question: "", answer: "" });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900">FAQ</h1>
              <p className="text-xs text-slate-500">Управление вопросами</p>
            </div>
            <a
              href="/admin/dashboard"
              className="text-slate-600 hover:text-slate-900 font-bold"
            >
              ← Назад
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition"
          >
            <Plus size={18} />
            Добавить вопрос
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? "Редактировать вопрос" : "Новый вопрос"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Вопрос
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="Какой вопрос?"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Ответ
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Ответ на вопрос"
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  {editingId ? "Сохранить" : "Добавить"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-500 py-8">
              Загрузка FAQ...
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Нет вопросов. Добавьте первый!
            </div>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 text-sm">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
