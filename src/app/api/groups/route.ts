import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const GROUPS_FILE = path.join(DATA_DIR, "groups.json");

interface Group {
  slug: string;
  title: string;
  shortTitle: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  image: string;
  categories: string[];
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(GROUPS_FILE)) {
    const defaultGroups: Group[] = [
      {
        slug: "krepezh",
        title: "Крепеж оптом в Алматы",
        shortTitle: "Крепеж",
        desc: "Болты, гайки, анкера, шайбы, шпильки и другой крепёж всех размеров и стандартов",
        metaTitle: "Крепеж оптом в Алматы — болты, гайки, анкера, шайбы | KRP",
        metaDesc: "Оптовые поставки крепежа в Алматы и по Казахстану. Болты, гайки, анкера, шайбы всех размеров и стандартов ГОСТ, DIN, ISO.",
        fullDescription:
          "Крепеж оптом для любых задач: строительства, производства и ремонта. Широкий выбор болтов, гаек, анкеров, шайб и шпилек всех размеров и материалов.",
        image: "/images/groups/krepezh.jpg",
        categories: ["bolty-optom", "gayki-optom", "shayby-optom", "ankera-optom", "shpilki-optom", "konus-optom", "samorezi-optom", "shaiby-pruzhinni-optom"],
      },
    ];
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(defaultGroups, null, 2));
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const groups = JSON.parse(
      fs.readFileSync(GROUPS_FILE, "utf-8")
    ) as Group[];
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error reading groups:", error);
    return NextResponse.json(
      { error: "Failed to read groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const { slug, title, shortTitle, desc, metaTitle, metaDesc, fullDescription, image, categories } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title required" },
        { status: 400 }
      );
    }

    const groups = JSON.parse(fs.readFileSync(GROUPS_FILE, "utf-8")) as Group[];

    // Check if slug already exists
    if (groups.some((g) => g.slug === slug)) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const newGroup: Group = {
      slug,
      title,
      shortTitle: shortTitle || title,
      desc: desc || "",
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || desc || "",
      fullDescription: fullDescription || "",
      image: image || "/images/groups/placeholder.jpg",
      categories: categories || [],
    };

    groups.push(newGroup);
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));

    return NextResponse.json({ success: true, group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const { slug, title, shortTitle, desc, metaTitle, metaDesc, fullDescription, image, categories } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title required" },
        { status: 400 }
      );
    }

    const groups = JSON.parse(fs.readFileSync(GROUPS_FILE, "utf-8")) as Group[];
    const index = groups.findIndex((g) => g.slug === slug);

    if (index === -1) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    groups[index] = {
      slug,
      title,
      shortTitle: shortTitle || title,
      desc: desc || "",
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || desc || "",
      fullDescription: fullDescription || "",
      image: image || "/images/groups/placeholder.jpg",
      categories: categories || [],
    };

    fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));

    return NextResponse.json({ success: true, group: groups[index] });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDataFile();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const groups = JSON.parse(fs.readFileSync(GROUPS_FILE, "utf-8")) as Group[];
    const filtered = groups.filter((g) => g.slug !== slug);

    fs.writeFileSync(GROUPS_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
