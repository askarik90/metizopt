import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLeads, Lead } from "@/lib/db";

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error reading leads:", error);
    return NextResponse.json({ error: "Failed to read leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, phone, whatsapp, city, message, category, searchQuery } = body;
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
    }
    const leads = await getLeads();
    const newLead: Lead = {
      id: Date.now().toString(),
      name, company: company || "", phone,
      whatsapp: whatsapp || "", city: city || "",
      message: message || "", category: category || "",
      searchQuery: searchQuery || "",
      createdAt: new Date().toISOString(),
    };
    leads.push(newLead);
    await saveLeads(leads);
    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const leads = await getLeads();
    await saveLeads(leads.filter((l) => l.id !== id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
