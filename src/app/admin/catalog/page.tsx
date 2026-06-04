"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/utils/auth";
import { Trash2, Plus, Edit2, ArrowLeft } from "lucide-react";

interface Group {
  slug: string;
  title: string;
  shortTitle: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  image: string;
  categories: string[];
}

export default function AdminCatalogPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Group>>({
    slug: "",
    title: "",
    shortTitle: "",
    desc: "",
    metaTitle: "",
    metaDesc: "",
    fullDescription: "",
    image: "",
    categories: [],
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      setGroups(data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.title) {
      alert("Заполните обязательные поля");
      return;
    }

    try {
      if (editingSlug) {
        // Update
        const res = await fetch("/api/groups", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setGroups(
            groups.map((g) =>
              g.slug === editingSlug ? (formData as Group) : g
            )
          );
        }
      } else {
        // Create
        const res = await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const data = await res.json();
          setGroups([...groups, data.group]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving group:", error);
      alert("Ошибка при сохранении");
    }
  };

  const handleEdit = (group: Group) => {
    setEditingSlug(group.slug);
    setFormData(group);
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Удалить эту группу?")) return;

    try {
      const res = await fetch(`/api/groups?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        setGroups(groups.filter((g) => g.slug !== slug));
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSlug(null);
    setFormData({
      slug: "",
      title: "",
      shortTitle: "",
      desc: "",
      metaTitle: "",
      metaDesc: "",
      fullDescription: "",
      image: "",
      categories: [],
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Каталог</h1>
              <p className="text-xs text-slate-500">Управление группами товаров</p>
            </div>
            <a
              href="/admin/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold"
            >
              <ArrowLeft size={18} />
              Назад
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition"
          >
            <Plus size={18} />
            Добавить группу
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingSlug ? "Редактировать группу" : "Новая группа"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Slug (уникальный код)
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    disabled={!!editingSlug}
                    placeholder="krepezh"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Крепеж оптом в Алматы"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Короткое название
                </label>
                <input
                  type="text"
                  value={formData.shortTitle || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shortTitle: e.target.value })
                  }
                  placeholder="Крепеж"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Описание (короткое)
                </label>
                <textarea
                  value={formData.desc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="Болты, гайки, анкера..."
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Meta Title (для SEO)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  placeholder="Крепеж оптом — болты, гайки | KRP"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Meta Description (для SEO)
                </label>
                <textarea
                  value={formData.metaDesc || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDesc: e.target.value })
                  }
                  placeholder="Оптовые поставки крепежа в Алматы..."
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Полное описание
                </label>
                <textarea
                  value={formData.fullDescription || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullDescription: e.target.value,
                    })
                  }
                  placeholder="Подробное описание для страницы каталога..."
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  URL изображения
                </label>
                <input
                  type="text"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/images/groups/krepezh.jpg"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  {editingSlug ? "Сохранить" : "Добавить"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Groups List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-500 py-8">
              Загрузка групп...
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Нет групп. Добавьте первую!
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.slug}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {group.image && (
                        <img
                          src={group.image}
                          alt={group.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">
                          {group.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {group.categories.length} категорий
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{group.desc}</p>
                    <p className="text-xs text-slate-500">
                      <strong>Slug:</strong> {group.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(group)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(group.slug)}
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
