"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/utils/auth";
import { Save, AlertCircle } from "lucide-react";

interface Settings {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  workingHours: string;
  workingHoursSat: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Ошибка при загрузке настроек");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
      setSaved(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setError("");
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Ошибка при сохранении");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Ошибка при сохранении");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Загрузка настроек...</p>
      </div>
    );

  if (!settings)
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-600">Ошибка при загрузке настроек</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Контакты</h1>
              <p className="text-xs text-slate-500">Управление контактной информацией</p>
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
        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ Настройки сохранены успешно!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              📍 Адрес
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Полный адрес с городом и страной
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              ☎️ Телефон
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              💬 WhatsApp
            </label>
            <input
              type="tel"
              value={settings.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              ✉️ Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@example.com"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
            />
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              🕐 Часы работы (будни)
            </label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => handleChange("workingHours", e.target.value)}
              placeholder="Пн–Пт: 09:00–18:00"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
            />
          </div>

          {/* Working Hours Saturday */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              🕐 Часы работы (суббота)
            </label>
            <input
              type="text"
              value={settings.workingHoursSat}
              onChange={(e) =>
                handleChange("workingHoursSat", e.target.value)
              }
              placeholder="Сб: 09:00–14:00"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:-translate-y-0.5"
            >
              <Save size={20} />
              Сохранить изменения
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-900">
            <strong>💡 Совет:</strong> Все изменения будут использоваться на сайте. Убедитесь что информация правильная перед сохранением.
          </p>
        </div>
      </main>
    </div>
  );
}
