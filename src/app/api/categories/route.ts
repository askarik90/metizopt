import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

interface Category {
  slug: string;
  title: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  standards: string[];
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CATEGORIES_FILE)) {
    const defaultCategories: Category[] = [
      {
        slug: "bolty-optom",
        title: "Болты оптом в Алматы",
        desc: "Болты высокой прочности всех размеров",
        metaTitle: "Болты оптом — все размеры и стандарты | KRP",
        metaDesc: "Болты оптом в Алматы. Высокопрочные болты DIN 933, ISO 4017 всех размеров.",
        fullDescription:
          "Болты оптом для строительства и производства. Полный ассортимент болтов высокой прочности от М4 до М64, стандарты DIN 933, ISO 4017, ГОСТ.",
        standards: ["DIN 933", "ISO 4017", "ГОСТ 7805"],
      },
    ];
    fs.writeFileSync(
      CATEGORIES_FILE,
      JSON.stringify(defaultCategories, null, 2)
    );
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const categories = JSON.parse(
      fs.readFileSync(CATEGORIES_FILE, "utf-8")
    ) as Category[];
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error reading categories:", error);
    return NextResponse.json(
      { error: "Failed to read categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const { slug, title, desc, metaTitle, metaDesc, fullDescription, standards } =
      body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title required" },
        { status: 400 }
      );
    }

    const categories = JSON.parse(
      fs.readFileSync(CATEGORIES_FILE, "utf-8")
    ) as Category[];

    if (categories.some((c) => c.slug === slug)) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const newCategory: Category = {
      slug,
      title,
      desc: desc || "",
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || desc || "",
      fullDescription: fullDescription || "",
      standards: standards || [],
    };

    categories.push(newCategory);
    fs.writeFileSync(
      CATEGORIES_FILE,
      JSON.stringify(categories, null, 2)
    );

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataFile();
    const body = await request.json();
    const { slug, title, desc, metaTitle, metaDesc, fullDescription, standards } =
      body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title required" },
        { status: 400 }
      );
    }

    const categories = JSON.parse(
      fs.readFileSync(CATEGORIES_FILE, "utf-8")
    ) as Category[];
    const index = categories.findIndex((c) => c.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    categories[index] = {
      slug,
      title,
      desc: desc || "",
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || desc || "",
      fullDescription: fullDescription || "",
      standards: standards || [],
    };

    fs.writeFileSync(
      CATEGORIES_FILE,
      JSON.stringify(categories, null, 2)
    );

    return NextResponse.json({ success: true, category: categories[index] });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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

    const categories = JSON.parse(
      fs.readFileSync(CATEGORIES_FILE, "utf-8")
    ) as Category[];
    const filtered = categories.filter((c) => c.slug !== slug);

    fs.writeFileSync(
      CATEGORIES_FILE,
      JSON.stringify(filtered, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
