import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FAQ_FILE = path.join(DATA_DIR, "faq.json");

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FAQ_FILE)) {
    // Default FAQ from company.ts
    const defaultFAQ: FAQItem[] = [
      {
        id: "faq_1",
        question: "Какие способы оплаты вы принимаете?",
        answer:
          "Мы принимаем безналичную оплату, банковские переводы и другие варианты согласно договору.",
      },
      {
        id: "faq_2",
        question: "Какой минимальный заказ?",
        answer:
          "Минимальный заказ зависит от типа товара. Пожалуйста, свяжитесь с нашим менеджером для уточнения.",
      },
      {
        id: "faq_3",
        question: "Как долго доставка?",
        answer:
          "Доставка по Казахстану занимает 1-3 дня в зависимости от города. Для Алматы - в день заказа.",
      },
      {
        id: "faq_4",
        question: "Есть ли гарантия на товар?",
        answer:
          "Все товары соответствуют стандартам ГОСТ, DIN и ISO. Гарантия определяется контрактом.",
      },
    ];
    fs.writeFileSync(FAQ_FILE, JSON.stringify(defaultFAQ, null, 2));
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const faq = JSON.parse(fs.readFileSync(FAQ_FILE, "utf-8")) as FAQItem[];
    return NextResponse.json({ faq });
  } catch (error) {
    console.error("Error reading FAQ:", error);
    return NextResponse.json({ error: "Failed to read FAQ" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer required" },
        { status: 400 }
      );
    }

    const faq = JSON.parse(fs.readFileSync(FAQ_FILE, "utf-8")) as FAQItem[];
    const newItem: FAQItem = {
      id: `faq_${Date.now()}`,
      question,
      answer,
    };

    faq.push(newItem);
    fs.writeFileSync(FAQ_FILE, JSON.stringify(faq, null, 2));

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const { id, question, answer } = body;

    if (!id || !question || !answer) {
      return NextResponse.json(
        { error: "ID, question and answer required" },
        { status: 400 }
      );
    }

    const faq = JSON.parse(fs.readFileSync(FAQ_FILE, "utf-8")) as FAQItem[];
    const index = faq.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "FAQ item not found" }, { status: 404 });
    }

    faq[index] = { id, question, answer };
    fs.writeFileSync(FAQ_FILE, JSON.stringify(faq, null, 2));

    return NextResponse.json({ success: true, item: faq[index] });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDataFile();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const faq = JSON.parse(fs.readFileSync(FAQ_FILE, "utf-8")) as FAQItem[];
    const filtered = faq.filter((item) => item.id !== id);

    fs.writeFileSync(FAQ_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
