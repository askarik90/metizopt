# 🚀 Быстрый старт - Hugging Face Image Generator

## Этап 1: Создать Hugging Face аккаунт и получить Token

### Шаг 1.1: Регистрация
1. Перейди на https://huggingface.co
2. Нажми "Sign up" (или войди если уже есть аккаунт)
3. Создай аккаунт (email + пароль)
4. Подтверди email

### Шаг 1.2: Получить API Token
1. Перейди на https://huggingface.co/settings/tokens
2. Нажми кнопку **"New token"**
3. Заполни форму:
   - **Token name**: `krp-image-generator`
   - **Token type**: `Fine-grained token` (или обычный)
   - **Permission**: `Read` (только чтение)
4. Скопируй полученный токен (выглядит так: `hf_xxxxxxxxxxxxxx`)

## Этап 2: Добавить Token в проект

### Шаг 2.1: Создать .env.local
В корне проекта (`C:/Users/sales/projects/metizopt/`) создай файл `.env.local`:

```bash
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxx
```

**Замени `hf_xxxxxxxxxxxxxx` на твой реальный токен!**

### Шаг 2.2: Рестартнуть dev сервер
```bash
# Останови текущий сервер (Ctrl+C если он работает)
# Потом выполни:
npm run dev
```

## Этап 3: Тестирование генератора

### Шаг 3.1: Открыть генератор
```
http://localhost:3000/admin/image-generator
```

### Шаг 3.2: Генерировать фото
1. Промпт уже заполнен для Крепежа
2. Нажми кнопку **"Сгенерировать фото"**
3. Подожди 3-5 сек (первый раз может быть дольше - модель загружается)
4. Когда готово - нажми **"Скачать фото"**

### Шаг 3.3: Сохранить фото
Скачанное фото положи в:
```
C:/Users/sales/projects/metizopt/public/images/groups/
```

Назови его как группу:
- `krepezh.jpg` для Крепежа
- `ventilatsiya.jpg` для Вентиляции
- и т.д.

## Этап 4: Использовать фото в каталоге

После того как скачаешь фото, обнови путь в `src/config/company.ts`:

```typescript
const groups = [
  {
    slug: 'krepezh',
    title: 'Крепеж оптом',
    image: '/images/groups/krepezh.jpg',  // ← Изменить с .svg на .jpg
    // ...
  },
  // ...
];
```

## ⚡ Быстрые советы

### Если ошибка "401 Unauthorized"
- Проверь, скопировал ли токен правильно
- Может быть пробелы в начале/конце? Удали их
- Рестартни dev сервер после изменения .env

### Если ошибка "Model is currently loading"
- Первый раз модель загружается (может быть 10-30 сек)
- Попробуй еще раз через 30 сек

### Если генерация очень медленная (>1 мин)
- Hugging Face может быть перегружен
- Попробуй позже
- Или используй более простой промпт

### Как ускорить генерацию
Сократи промпт до самого важного:
```
Professional product photography of industrial fasteners.
Studio lighting, white background.
Hexagon bolts M8-M12, stainless steel nuts, washers.
Elements on right side.
Photorealistic, sharp, 4K quality.
```

## 🎯 Работает?

Если всё работает и фото выглядит хорошо:
1. Скачай все 8 фото для групп
2. Положи их в `/public/images/groups/`
3. Обнови пути в `company.ts`
4. Rebuild и test!

---

**Вопросы?** Смотри HUGGING_FACE_SETUP.md или оставь фото и я помогу его улучшить!
