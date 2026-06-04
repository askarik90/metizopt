import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { prompt, category } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'HUGGING_FACE_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Используем Stable Diffusion XL (более стабильный вариант)
    const modelUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl';

    console.log('Calling HF API with model:', modelUrl);
    console.log('API Key exists:', !!apiKey);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error('HF API Error:', error);
      return NextResponse.json(
        { error: `Failed to generate image: ${error}` },
        { status: response.status }
      );
    }

    // Получаем blob изображения
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      category,
      prompt,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
