# Hugging Face API Setup для KRP.kz

## 1️⃣ Регистрация и API Token

1. Перейди на https://huggingface.co
2. Создай аккаунт (или войди)
3. Перейди в Settings → Access Tokens
4. Создай новый token (выбери "Fine-grained" → Read access)
5. Скопируй token

## 2️⃣ Создать .env.local

```bash
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxx
```

## 3️⃣ Промпт для Крепежа (Fasteners)

**НА АНГЛИЙСКОМ (для лучшего качества):**

```
Professional product photography of industrial fasteners assortment. 
High resolution, studio lighting, white background.
Shows: shiny hexagon bolts M8, M10, M12, 
stainless steel nuts DIN 985, M8-M12,
chrome washers, 
metal lock washers.
All elements concentrated on right side of image.
Photorealistic, detailed metallic texture, sharp focus, 
professional product shot, e-commerce quality.
4K resolution, studio lighting setup, soft shadows.
```

**ИЛИ НА РУССКОМ:**

```
Профессиональная фотография промышленного крепежа.
Студийное освещение, белый фон.
Болты шестигранные блестящие M8, M10, M12,
гайки нержавеющие DIN 985 M8-M12,
шайбы хромированные,
шайбы стопорные металлические.
Все элементы сконцентрированы справа.
Реалистичная фотография, металлический блеск, резкий фокус.
Высокое качество для интернет-магазина, студийное освещение.
```

## 4️⃣ Модель для использования

**Лучшие модели для реалистичных фото:**

```
stabilityai/stable-diffusion-3.5-large
```
или
```
black-forest-labs/FLUX.1-dev
```

## 5️⃣ Что дальше

- Создам API endpoint: `/api/generate-image`
- Endpoint принимает промпт и сохраняет фото
- Обновлю группу Крепежа для показа сгенерированного фото
