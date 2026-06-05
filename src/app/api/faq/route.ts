import { NextRequest, NextResponse } from "next/server";
import { getFAQ, saveFAQ, FAQItem } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await getFAQ();
    return NextResponse.json({ faqs, faq: faqs });
  } catch (error) {
    console.error("Error reading FAQ:", error);
    return NextResponse.json({ error: "Failed to read FAQ" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer } = body;
    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
    }
    const faqs = await getFAQ();
    const newItem: FAQItem = { id: Date.now().toString(), question, answer };
    faqs.push(newItem);
    await saveFAQ(faqs);
    return NextResponse.json({ success: true, faq: newItem, item: newItem });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, question, answer } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const faqs = await getFAQ();
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    faqs[index] = { id, question, answer };
    await saveFAQ(faqs);
    return NextResponse.json({ success: true, faq: faqs[index], item: faqs[index] });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const faqs = await getFAQ();
    await saveFAQ(faqs.filter((f) => f.id !== id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
