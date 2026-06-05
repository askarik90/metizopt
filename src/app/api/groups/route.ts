import { NextRequest, NextResponse } from "next/server";
import { getGroups, saveGroups } from "@/lib/db";

export async function GET() {
  try {
    const groups = await getGroups();
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error reading groups:", error);
    return NextResponse.json({ error: "Failed to read groups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Slug and title required" }, { status: 400 });
    }
    const groups = await getGroups() as Record<string, unknown>[];
    if (groups.some((g) => g.slug === body.slug)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    groups.push(body);
    await saveGroups(groups);
    return NextResponse.json({ success: true, group: body });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const groups = await getGroups() as Record<string, unknown>[];
    const index = groups.findIndex((g) => g.slug === body.slug);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    groups[index] = body;
    await saveGroups(groups);
    return NextResponse.json({ success: true, group: body });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
    const groups = await getGroups() as Record<string, unknown>[];
    await saveGroups(groups.filter((g) => g.slug !== slug));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
