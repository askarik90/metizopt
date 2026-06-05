import { NextResponse } from "next/server";
import {
  exportDataSnapshot,
  importDataSnapshot,
  normalizeDataSnapshot,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await exportDataSnapshot();
    const fileName = `krp-backup-${snapshot.exportedAt.slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(snapshot, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"${fileName}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error exporting backup:", error);
    return NextResponse.json(
      { error: "Failed to export backup" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("backup");

    if (!(file instanceof File)) {
      return NextResponse.redirect(
        new URL("/admin/dashboard?import=missing", request.url),
        { status: 303 },
      );
    }

    const text = (await file.text()).replace(/^\uFEFF/, "");
    const parsed: unknown = JSON.parse(text);
    const snapshot = normalizeDataSnapshot(parsed);

    if (!snapshot) {
      return NextResponse.redirect(
        new URL("/admin/dashboard?import=invalid", request.url),
        { status: 303 },
      );
    }

    await importDataSnapshot(snapshot);

    return NextResponse.redirect(
      new URL("/admin/dashboard?import=success", request.url),
      { status: 303 },
    );
  } catch (error) {
    console.error("Error importing backup:", error);
    return NextResponse.redirect(
      new URL("/admin/dashboard?import=error", request.url),
      { status: 303 },
    );
  }
}
