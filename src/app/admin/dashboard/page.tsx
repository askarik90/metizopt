"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated, clearAdminSession } from "@/utils/auth";
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

  // Check authentication
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  // Load leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data.leads.reverse()); // Newest first
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
      alert("Нет leads для экспорта");
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
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `krp_leads_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">KRP Admin</h1>
            <p className="text-xs text-slate-500">Панель управления</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <LogOut size={18} />
            Выход
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-50 border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
          <a
            href="/admin/dashboard"
            className="py-3 px-2 font-bold text-orange-600 border-b-2 border-orange-600"
          >
            📋 Leads
          </a>
          <a
            href="/admin/faq"
            className="py-3 px-2 font-bold text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition"
          >
            ❓ FAQ
          </a>
          <a
            href="/admin/settings"
            className="py-3 px-2 font-bold text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition"
          >
            ⚙️ Контакты
          </a>
          <a
            href="/admin/catalog"
            className="py-3 px-2 font-bold text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-slate-300 transition"
          >
            📦 Каталог
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <p className="text-slate-600 text-sm font-bold uppercase">
              Всего leads
            </p>
            <p className="text-3xl font-black text-orange-600 mt-2">
              {leads.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <p className="text-slate-600 text-sm font-bold uppercase">
              Сегодня
            </p>
            <p className="text-3xl font-black text-blue-600 mt-2">
              {
                leads.filter(
                  (l) =>
                    new Date(l.createdAt).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <p className="text-slate-600 text-sm font-bold uppercase">
              На этой неделе
            </p>
            <p className="text-3xl font-black text-green-600 mt-2">
              {
                leads.filter((l) => {
                  const leadDate = new Date(l.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return leadDate > weekAgo;
                }).length
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            <Download size={18} />
            Экспорт CSV
          </button>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            🔄 Обновить
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Загрузка leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Нет leads. Начните получать заявки!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                      Имя
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                      Компания
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                      Телефон
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                      Город
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
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
                      <td className="px-4 py-3 text-sm font-mono text-slate-900">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {lead.city || "-"}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetail(true);
                          }}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded transition"
                          title="Просмотр"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded transition"
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

      {/* Detail Modal */}
      {showDetail && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Детали lead'а
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  ID
                </p>
                <p className="text-xs font-mono text-slate-900">
                  {selectedLead.id}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Имя
                </p>
                <p className="text-slate-900">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Компания
                </p>
                <p className="text-slate-900">
                  {selectedLead.company || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Телефон
                </p>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="text-orange-600 hover:underline font-mono"
                >
                  {selectedLead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  WhatsApp
                </p>
                <p className="text-slate-900">
                  {selectedLead.whatsapp || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Город
                </p>
                <p className="text-slate-900">
                  {selectedLead.city || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Сообщение
                </p>
                <p className="text-slate-900 text-sm">
                  {selectedLead.message || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Категория
                </p>
                <p className="text-slate-900">
                  {selectedLead.category || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Дата
                </p>
                <p className="text-slate-900 text-sm">
                  {new Date(selectedLead.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="w-full mt-6 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-2 px-4 rounded-lg transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
