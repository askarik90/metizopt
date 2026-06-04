"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateAdminPassword, setAdminSession } from "@/utils/auth";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (validateAdminPassword(password)) {
        setAdminSession(password);
        router.push("/admin/dashboard");
      } else {
        setError("❌ Неверный пароль");
        setPassword("");
      }
    } catch (err) {
      setError("Ошибка при входе");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Lock size={32} className="text-orange-600" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900">KRP Admin</h1>
            <p className="text-slate-500 text-sm mt-2">
              Панель администратора
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Проверка..." : "Войти в админку"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            KRP.kz © 2026 | Защищённая область
          </p>
        </div>
      </div>
    </div>
  );
}
