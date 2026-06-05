import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Lock size={32} className="text-orange-600" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900">KRP Admin</h1>
            <p className="text-slate-500 text-sm mt-2">Панель администратора</p>
          </div>

          <form method="POST" action="/api/auth/login" className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-900 mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Введите пароль"
                autoComplete="current-password"
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Войти
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            KRP.kz © 2026 | Защищённая область
          </p>
        </div>
      </div>
    </div>
  );
}
