import { Save } from "lucide-react";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();

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
            <a href="/admin/dashboard" className="text-slate-600 hover:text-slate-900 font-bold">
              ← Назад
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {params.saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Настройки сохранены успешно!
          </div>
        )}
        {params.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ Ошибка при сохранении. Попробуйте ещё раз.
          </div>
        )}

        {/* Form */}
        <form method="POST" action="/api/settings" className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              📍 Адрес
            </label>
            <input
              type="text"
              name="address"
              defaultValue={settings.address}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
              required
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
              name="phone"
              defaultValue={settings.phone}
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              💬 WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              defaultValue={settings.whatsapp}
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              ✉️ Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={settings.email}
              placeholder="info@example.com"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
              required
            />
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              🕐 Часы работы (будни)
            </label>
            <input
              type="text"
              name="workingHours"
              defaultValue={settings.workingHours}
              placeholder="Пн–Пт: 09:00–18:00"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
              required
            />
          </div>

          {/* Working Hours Saturday */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              🕐 Часы работы (суббота)
            </label>
            <input
              type="text"
              name="workingHoursSat"
              defaultValue={settings.workingHoursSat}
              placeholder="Сб: 09:00–14:00"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 outline-none"
              required
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:-translate-y-0.5"
            >
              <Save size={20} />
              Сохранить изменения
            </button>
          </div>
        </form>

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
