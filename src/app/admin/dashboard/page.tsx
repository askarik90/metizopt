"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Download, LogOut, Eye } from "lucide-react";
import * as XLSX from "xlsx";

interface DayStats {
  whatsappClicks: number;
  phoneClicks: number;
  formOpens: number;
  formOpenSessions: number;
  formSubmits: number;
  fileUploads: number;
}
type AnalyticsData = Record<string, DayStats>;

interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  message?: string;
  category?: string;
  searchQuery?: string;
  createdAt: string;
}

interface EventLog {
  id: string;
  type: "whatsapp" | "phone" | "form_open" | "form_submit";
  timestamp: string;
  category?: string;
  page?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsDays, setAnalyticsDays] = useState<7 | 30>(7);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [activeTab, setActiveTab] = useState<"leads" | "activity">("leads");

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
    fetchEvents();
    const params = new URLSearchParams(window.location.search);
    setImportStatus(params.get("import"));
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.analytics ?? {});
      }
    } catch {
      // analytics not critical
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents([...(data.events || [])].reverse());
      }
    } catch {}
  };

  // Aggregate last N days from analytics data
  const getAggregated = (days: number) => {
    const result: DayStats = { whatsappClicks: 0, phoneClicks: 0, formOpens: 0, formOpenSessions: 0, formSubmits: 0, fileUploads: 0 };
    if (!analytics) return result;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    for (const [date, stats] of Object.entries(analytics)) {
      if (new Date(date) >= cutoff) {
        result.whatsappClicks += stats.whatsappClicks ?? 0;
        result.phoneClicks += stats.phoneClicks ?? 0;
        result.formOpens += stats.formOpens ?? 0;
        result.formOpenSessions += stats.formOpenSessions ?? 0;
        result.formSubmits += stats.formSubmits ?? 0;
        result.fileUploads += stats.fileUploads ?? 0;
      }
    }
    return result;
  };

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

  const handleExportXLSX = () => {
    if (leads.length === 0) {
      alert("Нет заявок для экспорта");
      return;
    }

    const rows = leads.map((lead) => ({
      "Дата": new Date(lead.createdAt).toLocaleString("ru-RU"),
      "Имя": lead.name,
      "Компания": lead.company || "",
      "Телефон": lead.phone,
      "WhatsApp": lead.whatsapp || "",
      "Город": lead.city || "",
      "Категория": lead.category || "",
      "Сообщение": (lead as Lead & { message?: string; searchQuery?: string }).message || "",
      "Искал на сайте": (lead as Lead & { searchQuery?: string }).searchQuery || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    // Ширина колонок
    ws["!cols"] = [
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 },
      { wch: 18 }, { wch: 14 }, { wch: 20 }, { wch: 30 }, { wch: 25 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Заявки");
    XLSX.writeFile(wb, `krp_leads_${new Date().toISOString().split("T")[0]}.xlsx`);
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
          <a
            href="/admin/image-positions"
            className="px-2 py-3 font-bold text-slate-600 transition hover:border-b-2 hover:border-slate-300 hover:text-slate-900"
          >
            🖼️ Фото
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
            onClick={handleExportXLSX}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-700"
          >
            <Download size={18} />
            Экспорт XLSX
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

        {/* ── FUNNEL ANALYTICS ──────────────────────────────────────── */}
        {analytics !== null && (() => {
          const stats = getAggregated(analyticsDays);
          const totalContacts = stats.whatsappClicks + stats.phoneClicks + stats.formSubmits;
          // знаменатель конверсии — уникальные сессии; на старых днях fallback на сырые открытия
          const uniqueOpens = stats.formOpenSessions || stats.formOpens;
          const convRate = uniqueOpens > 0
            ? Math.round((stats.formSubmits / uniqueOpens) * 100)
            : 0;
          const maxVal = Math.max(stats.formOpens, stats.whatsappClicks, stats.phoneClicks, stats.formSubmits, 1);
          const bar = (val: number, color: string) => (
            <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${color} transition-all duration-500`}
                style={{ width: `${Math.round((val / maxVal) * 100)}%` }}
              />
            </div>
          );
          return (
            <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-black text-slate-900">📊 Воронка продаж</h2>
                <div className="flex rounded-lg border border-slate-200 text-xs font-bold overflow-hidden">
                  <button
                    onClick={() => setAnalyticsDays(7)}
                    className={`px-3 py-1.5 transition ${analyticsDays === 7 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >7 дней</button>
                  <button
                    onClick={() => setAnalyticsDays(30)}
                    className={`px-3 py-1.5 transition ${analyticsDays === 30 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >30 дней</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs font-bold text-blue-700 uppercase">Открыли форму</p>
                  <p className="mt-1 text-2xl font-black text-blue-800">{stats.formOpens}</p>
                  <p className="text-xs text-blue-600">уник. сессий: {uniqueOpens}</p>
                  {bar(stats.formOpens, "bg-blue-500")}
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs font-bold text-green-700 uppercase">WhatsApp</p>
                  <p className="mt-1 text-2xl font-black text-green-800">{stats.whatsappClicks}</p>
                  {bar(stats.whatsappClicks, "bg-green-500")}
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs font-bold text-purple-700 uppercase">Звонки</p>
                  <p className="mt-1 text-2xl font-black text-purple-800">{stats.phoneClicks}</p>
                  {bar(stats.phoneClicks, "bg-purple-500")}
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <p className="text-xs font-bold text-orange-700 uppercase">Заявки с формы</p>
                  <p className="mt-1 text-2xl font-black text-orange-800">{stats.formSubmits}</p>
                  {bar(stats.formSubmits, "bg-orange-500")}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm">
                <div>
                  <span className="text-slate-500">Всего обращений: </span>
                  <span className="font-black text-slate-900">{totalContacts}</span>
                </div>
                <div>
                  <span className="text-slate-500">Конверсия формы: </span>
                  <span className={`font-black ${convRate >= 20 ? "text-green-600" : convRate >= 10 ? "text-orange-600" : "text-red-600"}`}>
                    {convRate}%
                  </span>
                  <span className="text-xs text-slate-400 ml-1">(уник. сессии → заявки)</span>
                </div>
                {stats.fileUploads > 0 && (
                  <div>
                    <span className="text-slate-500">Загрузок файлов: </span>
                    <span className="font-black text-slate-900">{stats.fileUploads}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <div className="mb-4 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 text-sm font-bold transition border-b-2 -mb-px ${activeTab === "leads" ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
          >📋 Заявки ({leads.length})</button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 text-sm font-bold transition border-b-2 -mb-px ${activeTab === "activity" ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
          >⚡ Активность ({events.length})</button>
        </div>

        {/* ── CATEGORY CONVERSION ───────────────────────────────────────── */}
        {activeTab === "activity" && events.length > 0 && (() => {
          // Группируем по категории: сколько form_open и form_submit
          const catMap: Record<string, { opens: number; submits: number; whatsapp: number; phone: number }> = {};
          events.forEach(e => {
            const key = e.category || "(без категории)";
            if (!catMap[key]) catMap[key] = { opens: 0, submits: 0, whatsapp: 0, phone: 0 };
            if (e.type === "form_open") catMap[key].opens++;
            if (e.type === "form_submit") catMap[key].submits++;
            if (e.type === "whatsapp") catMap[key].whatsapp++;
            if (e.type === "phone") catMap[key].phone++;
          });
          const rows = Object.entries(catMap).sort((a, b) => (b[1].submits + b[1].whatsapp + b[1].phone) - (a[1].submits + a[1].whatsapp + a[1].phone));
          return (
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h3 className="font-black text-slate-900 text-sm">📈 Конверсия по категориям</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold uppercase text-slate-600">Категория / Страница</th>
                      <th className="px-4 py-2 text-center text-xs font-bold uppercase text-slate-600">Открыли форму</th>
                      <th className="px-4 py-2 text-center text-xs font-bold uppercase text-slate-600">Заявки</th>
                      <th className="px-4 py-2 text-center text-xs font-bold uppercase text-slate-600">WhatsApp</th>
                      <th className="px-4 py-2 text-center text-xs font-bold uppercase text-slate-600">Звонки</th>
                      <th className="px-4 py-2 text-center text-xs font-bold uppercase text-slate-600">Конверсия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([cat, s]) => {
                      const conv = s.opens > 0 ? Math.round((s.submits / s.opens) * 100) : null;
                      return (
                        <tr key={cat} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-2 font-medium text-slate-900">{cat}</td>
                          <td className="px-4 py-2 text-center text-blue-700">{s.opens || "—"}</td>
                          <td className="px-4 py-2 text-center text-orange-700 font-bold">{s.submits || "—"}</td>
                          <td className="px-4 py-2 text-center text-green-700">{s.whatsapp || "—"}</td>
                          <td className="px-4 py-2 text-center text-purple-700">{s.phone || "—"}</td>
                          <td className="px-4 py-2 text-center">
                            {conv !== null ? (
                              <span className={`font-bold ${conv >= 30 ? "text-green-600" : conv >= 10 ? "text-orange-600" : "text-red-500"}`}>{conv}%</span>
                            ) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          {activeTab === "activity" ? (
            events.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Нет событий. Активность появится после первых кликов.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Время</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Тип</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Категория</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-600">Страница</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e, i) => {
                      const typeLabel: Record<EventLog["type"], { label: string; color: string }> = {
                        form_open:   { label: "Открыл форму",  color: "bg-blue-100 text-blue-700" },
                        form_submit: { label: "Заявка",         color: "bg-orange-100 text-orange-700" },
                        whatsapp:    { label: "WhatsApp",        color: "bg-green-100 text-green-700" },
                        phone:       { label: "Звонок",          color: "bg-purple-100 text-purple-700" },
                      };
                      const { label, color } = typeLabel[e.type];
                      return (
                        <tr key={e.id} className={`border-b border-slate-200 transition hover:bg-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                          <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                            {new Date(e.timestamp).toLocaleString("ru-RU")}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color}`}>{label}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">{e.category || "—"}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 truncate max-w-xs">{e.page || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : null}
          {activeTab === "leads" && (loading ? (
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
          ))}
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
