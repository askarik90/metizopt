'use client';
import { useState } from 'react';
import { Loader, Copy, Check } from 'lucide-react';

interface ImageGeneratorProps {
  category?: string;
}

export default function ImageGenerator({ category = 'krepezh' }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(
    `Professional product photography of industrial fasteners assortment.
High resolution, studio lighting, white background.
Shows: shiny hexagon bolts M8, M10, M12,
stainless steel nuts DIN 985, M8-M12,
chrome washers,
metal lock washers.
All elements concentrated on right side of image.
Photorealistic, detailed metallic texture, sharp focus,
professional product shot, e-commerce quality.
4K resolution, studio lighting setup, soft shadows.`
  );
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${category}-product-${Date.now()}.jpg`;
    link.click();
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 rounded-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">🖼️ Генератор фото продуктов</h2>

      <div className="space-y-4">
        {/* Промпт */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Промпт для генерации:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Опишите, какое фото генерировать..."
          />
          <button
            onClick={copyPrompt}
            className="mt-2 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Скопировано' : 'Копировать промпт'}
          </button>
        </div>

        {/* Кнопка генерации */}
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {loading && <Loader size={18} className="animate-spin" />}
          {loading ? 'Генерируем фото...' : 'Сгенерировать фото'}
        </button>

        {/* Ошибка */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Результат */}
        {imageUrl && (
          <div className="space-y-4">
            <div className="relative w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Generated product"
                className="w-full h-auto"
              />
            </div>
            <button
              onClick={downloadImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              ⬇️ Скачать фото
            </button>
          </div>
        )}

        {/* Инструкция */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <p className="font-semibold mb-2">💡 Как использовать:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Отредактируй промпт если нужно</li>
            <li>Нажми "Сгенерировать фото"</li>
            <li>Подожди 3-5 сек (первый раз может быть дольше)</li>
            <li>Скачай фото в /public/images/groups/</li>
            <li>Обнови путь в company.ts если нужно</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
