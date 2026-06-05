"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Edit2, ArrowLeft, Filter } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface Category {
  slug: string;
  title: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  standards: string[];
}

interface Group {
  slug: string;
  title: string;
  categories: string[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState<string>("");
  const [formData, setFormData] = useState<Partial<Category>>({
    slug: "",
    title: "",
    desc: "",
    metaTitle: "",
    metaDesc: "",
    fullDescription: "",
    standards: [],
  });
  const [standardsInput, setStandardsInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, groupRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/groups"),
      ]);
      const catData = await catRes.json();
      const groupData = await groupRes.json();
      setCategories(catData.categories);
      setGroups(groupData.groups);
      if (groupData.groups.length > 0) {
        setFilterGroup(groupData.groups[0].slug);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

    const standards = standardsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    const submitData = {
      ...formData,
      standards,
    };

    try {
      if (editingSlug) {
        // Update
        const res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });

        if (res.ok) {
          setCategories(
            categories.map((c) =>
              c.slug === editingSlug ? (submitData as Category) : c
            )
          );
        }
      } else {
        // Create
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });

        if (res.ok) {
          const data = await res.json();
          setCategories([...categories, data.category]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Ошибка при сохранении");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingSlug(category.slug);
    setFormData(category);
    setStandardsInput(category.standards.join(", "));
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Удалить эту категорию?")) return;

    try {
      const res = await fetch(`/api/categories?slug=${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.slug !== slug));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSlug(null);
    setFormData({
      slug: "",
      title: "",
      desc: "",
      metaTitle: "",
      metaDesc: "",
      fullDescription: "",
      standards: [],
    });
    setStandardsInput("");
  };

  const getFilteredCategories = () => {
    if (!filterGroup) return categories;
    const selectedGroup = groups.find((g) => g.slug === filterGroup);
    if (!selectedGroup) return categories;
    const categorySet = new Set(selectedGroup.categories);
    return categories.filter((c) => categorySet.has(c.slug));
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Категории</h1>
              <p className="text-xs text-slate-500">Управление категориями товаров</p>
            </div>
            <a
              href="/admin/catalog"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold"
            >
              <ArrowLeft size={18} />
              К группам
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Buttons */}
        {!showForm && (
          <div className="flex flex-col lg:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center gap-2">
              <Filter size={18} className="text-slate-600" />
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none bg-white text-slate-900"
              >
                <option value="">Все группы ({categories.length})</option>
                {groups.map((group) => {
                  const count = group.categories.length;
                  return (
                    <option key={group.slug} value={group.slug}>
                      {group.title.split(" оптом")[0]} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap"
            >
              <Plus size={18} />
              Добавить категорию
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingSlug ? "Редактировать категорию" : "Новая категория"}
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
                    placeholder="bolty-optom"
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
                    placeholder="Болты оптом в Алматы"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                  />
                </div>
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
                  placeholder="Болты высокой прочности всех размеров"
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
                  placeholder="Болты оптом — все размеры | KRP"
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
                  placeholder="Болты оптом в Алматы. Все размеры и стандарты..."
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Полное описание
                </label>
                <RichTextEditor
                  value={formData.fullDescription || ""}
                  onChange={(html) =>
                    setFormData({ ...formData, fullDescription: html })
                  }
                />
                <p className="text-xs text-slate-500 mt-1">
                  Используйте панель для форматирования: жирный, списки, заголовки, ссылки.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Стандарты (через запятую)
                </label>
                <input
                  type="text"
                  value={standardsInput}
                  onChange={(e) => setStandardsInput(e.target.value)}
                  placeholder="DIN 933, ISO 4017, ГОСТ 7805"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Разделяйте стандарты запятыми. Например: DIN 933, ISO 4017, ГОСТ 7805
                </p>
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

        {/* Categories List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-500 py-8">
              Загрузка категорий...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              {categories.length === 0
                ? "Нет категорий. Добавьте первую!"
                : "Нет категорий в этой группе"}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.slug}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">{category.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {category.standards.map((std) => (
                        <span
                          key={std}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      <strong>Slug:</strong> {category.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.slug)}
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
