import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  message?: string;
  category?: string;
  fileUrl?: string;
  pageUrl?: string;
  createdAt: string;
}

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
}

// GET all leads
export async function GET(request: NextRequest) {
  try {
    ensureDataFile();

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8")) as Lead[];
    return NextResponse.json({ leads, total: leads.length });
  } catch (error) {
    console.error("Error reading leads:", error);
    return NextResponse.json(
      { error: "Failed to read leads" },
      { status: 500 }
    );
  }
}

// POST new lead
export async function POST(request: NextRequest) {
  try {
    ensureDataFile();

    const body = await request.json();
    const { name, company, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone required" },
        { status: 400 }
      );
    }

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8")) as Lead[];
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      company: company || "",
      phone,
      whatsapp: body.whatsapp,
      city: body.city,
      message: body.message,
      category: body.category,
      fileUrl: body.fileUrl,
      pageUrl: body.pageUrl,
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    console.log("✅ New lead saved:", newLead);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}

// DELETE lead
export async function DELETE(request: NextRequest) {
  try {
    ensureDataFile();

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("id");

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID required" },
        { status: 400 }
      );
    }

    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8")) as Lead[];
    const filtered = leads.filter((lead) => lead.id !== leadId);

    fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
