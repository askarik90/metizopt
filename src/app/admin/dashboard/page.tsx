"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download, LogOut, Eye } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  message?: string;
  category?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
    const params = new URLSearchParams(window.location.search);
    setImportStatus(params.get("import"));
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads([...(data.leads || [])].reverse());
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены? Это действие нельзя отменить.")) return;

    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(leads.filter((lead) => lead.id !== id));
        if (selectedLead?.id === id) {
          setShowDetail(false);
          setSelectedLead(null);
        }
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("Нет заявок для экспорта");
      return;
    }

    const headers = [
      "ID",
      "Дата",
      "Имя",
      "Компания",
      "Телефон",
      "WhatsApp",
      "Город",
      "Категория",
    ];

    const rows = leads.map((lead) => [
      lead.id,
      new Date(lead.createdAt).toLocaleString("ru-RU"),
      lead.name,
      lead.company || "-",
      lead.phone,
      lead.whatsapp || "-",
      lead.city || "-",
      lead.category || "-",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `krp_leads_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">KRP Admin</h1>
            <p className="text-xs text-slate-500">Панель управления</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
          >
            <LogOut size={18} />
            Выход
          </button>
        </div>
      </header>

      <nav className="sticky top-16 z-40 border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
          <a
            href="/admin/dashboard"
            className="border-b-2 border-orange-600 px-2 py-3 font-bold text-orange-600"
          >
            📋 Leads
          </a>
          <a
            href="/admin/faq"
            className="px-2 py-3 font-bold text-slate-600 transition hover:border-b-2 hover:border-slate-300 hover:text-slate-900"
          >
            ❓ FAQ
          </a>
          <a
            href="/admin/settings"
            className="px-2 py-3 font-bold text-slate-600 transition hover:border-b-2 hover:border-slate-300 hover:text-slate-900"
          >
            ⚙️ Контакты
          </a>
          <a
            href="/admin/catalog"
            className="px-2 py-3 font-bold text-slate-600 transition hover:border-b-2 hover:border-slate-300 hover:text-slate-900"
          >
            📦 Каталог
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {importStatus && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm font-bold ${
              importStatus === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {importStatus === "success" && "Импорт данных завершён."}
            {importStatus === "missing" && "Файл для импорта не выбран."}
            {importStatus === "invalid" && "Файл импорта имеет неверный формат."}
            {importStatus === "error" && "Не удалось импортировать данные."}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-bold uppercase text-slate-600">
              Всего заявок
            </p>
            <p className="mt-2 text-3xl font-black text-orange-600">
              {leads.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-bold uppercase text-slate-600">
              Сегодня
            </p>
            <p className="mt-2 text-3xl font-black text-blue-600">
              {
                leads.filter(
                  (lead) =>
                    new Date(lead.createdAt).toDateString() ===
                    new Date().toDateString(),
                ).length
              }
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <p className="text-sm font-bold uppercase text-slate-600">
              За 7 дней
            </p>
            <p className="mt-2 text-3xl font-black text-green-600">
              {
                leads.filter((lead) => {
                  const leadDate = new Date(lead.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return leadDate > weekAgo;
                }).length
              }
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-700"
          >
            <Download size={18} />
            Экспорт CSV
          </button>
          <a
            href="/api/admin/data"
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-bold text-white transition hover:bg-orange-700"
          >
            <Download size={18} />
            Экспорт backup JSON
          </a>
          <form
            method="POST"
            action="/api/admin/data"
            encType="multipart/form-data"
            className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <input
              type="file"
              name="backup"
              accept="application/json,.json"
              className="max-w-56 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-bold file:text-slate-700"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 font-bold text-white transition hover:bg-slate-700"
            >
              Импорт backup
            </button>
          </form>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
          >
            🔄 Обновить
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Загрузка leads...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Нет заявок. Начните получать заявки!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                      Имя
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                      Компания
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                      Телефон
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                      Город
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-slate-200 transition hover:bg-slate-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {new Date(lead.createdAt).toLocaleString("ru-RU")}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {lead.company || "-"}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-slate-900">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {lead.city || "-"}
                      </td>
                      <td className="flex gap-2 px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetail(true);
                          }}
                          className="rounded bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                          title="Просмотр"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="rounded bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showDetail && selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Детали заявки
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">ID</p>
                <p className="text-xs text-slate-900">{selectedLead.id}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">Имя</p>
                <p className="text-slate-900">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  Компания
                </p>
                <p className="text-slate-900">{selectedLead.company || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  Телефон
                </p>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="font-mono text-orange-600 hover:underline"
                >
                  {selectedLead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  WhatsApp
                </p>
                <p className="text-slate-900">{selectedLead.whatsapp || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  Город
                </p>
                <p className="text-slate-900">{selectedLead.city || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  Сообщение
                </p>
                <p className="text-sm text-slate-900">
                  {selectedLead.message || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  Категория
                </p>
                <p className="text-slate-900">{selectedLead.category || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-600">
                  Дата
                </p>
                <p className="text-sm text-slate-900">
                  {new Date(selectedLead.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-900 transition hover:bg-slate-300"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
