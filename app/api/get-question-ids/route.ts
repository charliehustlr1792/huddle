import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const isPrelims = url.searchParams.get("isPrelims") === "true";
    const shift = parseInt(url.searchParams.get("shift") || "1");

    const filePath = path.join(process.cwd(), "private", "data", "QnA.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    const questions = isPrelims ? data.prelims_questions : data.final_questions;

    const ids = questions
      .filter((q: any) => q.shift === shift)
      .map((q: any) => q.id);

    return NextResponse.json({ ids });
  } catch (error) {
    console.error("Error loading question IDs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
