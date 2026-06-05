import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategories, type CategoryItem } from "@/lib/db";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error reading categories:", error);
    return NextResponse.json({ error: "Failed to read categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Slug and title required" }, { status: 400 });
    }
    const categories = await getCategories();
    if (categories.some((c) => c.slug === body.slug)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    categories.push(body);
    await saveCategories(categories);
    return NextResponse.json({ success: true, category: body });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const categories = await getCategories();
    const index = categories.findIndex((c) => c.slug === body.slug);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    categories[index] = body;
    await saveCategories(categories);
    return NextResponse.json({ success: true, category: body });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const categories = await getCategories();
    await saveCategories(categories.filter((c) => c.slug !== slug));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
