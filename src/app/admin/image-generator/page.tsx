import ImageGenerator from '@/components/ImageGenerator';

export const metadata = {
  title: 'Image Generator - KRP.kz Admin',
};

export default function ImageGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">🎨 Генератор фото продуктов</h1>
          <p className="text-slate-300">
            Тестируем Hugging Face API для генерации реалистичных фото крепежа
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main generator */}
          <div className="lg:col-span-2">
            <ImageGenerator category="krepezh" />
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">📋 Инструкция</h3>
              <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
                <li>
                  <strong>Регистрация:</strong> Создай аккаунт на{' '}
                  <a
                    href="https://huggingface.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    huggingface.co
                  </a>
                </li>
                <li>
                  <strong>Token:</strong> Settings → Access Tokens → Read token
                </li>
                <li>
                  <strong>.env.local:</strong>
                  <code className="block bg-slate-100 p-2 mt-1 rounded text-xs">
                    HUGGING_FACE_API_KEY=hf_xxx...
                  </code>
                </li>
                <li>
                  <strong>Рестарт:</strong> npm run dev (после изменения .env)
                </li>
                <li>
                  <strong>Генерация:</strong> Отредактируй промпт, нажми кнопку
                </li>
              </ol>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-3">⚡ Быстрые факты</h3>
              <ul className="text-sm text-orange-800 space-y-2">
                <li>✅ Бесплатно для первых генераций</li>
                <li>✅ Реалистичные фото (SD 3.5)</li>
                <li>⏱️ 3-5 сек на фото</li>
                <li>💾 Сохраняй в /public/images/groups/</li>
                <li>🎯 Оптимально для 8 групп</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">🔗 Полезные ссылки</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="https://huggingface.co/models?filter=text-to-image"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  → Все модели HF
                </a>
                <a
                  href="HUGGING_FACE_SETUP.md"
                  className="block text-blue-600 hover:underline"
                >
                  → Полная документация
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
