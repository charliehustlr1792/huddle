import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get("id") || "1");
    const isPrelims = url.searchParams.get("isPrelims") === "true";
    const shift = parseInt(url.searchParams.get("shift") || "1");

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    // Load questions from the private JSON file
    const filePath = path.join(process.cwd(), "private", "data", "QnA.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    // Find the requested question
    const questions = isPrelims ? data.prelims_questions : data.final_questions;
    const question = questions.find((q: any) => q.id === id && q.shift === shift);

    if (!question) {
      return NextResponse.json({ 
        error: `Question not found or not available in shift ${shift}.` 
      }, { status: 404 });
    }
    return NextResponse.json({
      question: {
        id: question.id,
        question: question.question,
        type: question.type,
        media: question.media,
        case_sensitive: question.case_sensitive
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}