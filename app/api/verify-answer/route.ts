import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { answer, questionId, isPrelimsQuestion, shift } = await request.json();
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, msg: "Not authenticated" }, { status: 401 });
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timestamp = `${hours}:${minutes}`;

    const filePath = path.join(process.cwd(), "private", "data", "QnA.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    const questions = isPrelimsQuestion ? data.prelims_questions : data.final_questions;
    const question = questions.find((q: any) => q.id === questionId && q.shift === shift);

    if (!question) {
      return NextResponse.json({
        success: false,
        msg: `Question not found or not available in shift ${shift}.`
      }, { status: 404 });
    }

    const userAnswer = question.case_sensitive ? answer.trim() : answer.trim().toLowerCase();

    let isCorrect = false;
    if (Array.isArray(question.answer)) {
      const possibleAnswers = question.case_sensitive
        ? question.answer.map((ans: string) => ans.trim())
        : question.answer.map((ans: string) => ans.trim().toLowerCase());
      isCorrect = possibleAnswers.includes(userAnswer);
    } else {
      const correctAnswer = question.case_sensitive
        ? question.answer.trim()
        : question.answer.trim().toLowerCase();
      isCorrect = userAnswer === correctAnswer;
    }

    // Use transaction to prevent race conditions
    const questionKey = `${isPrelimsQuestion ? 'p' : 'f'}-${questionId}`;

    const result = await prisma.$transaction(async (tx) => {
      // Get the most up-to-date team data within this transaction
      const email = session.user?.email;
      if (!email) {
        return { success: false, msg: "Invalid user email", status: 401 };
      }

      const team = await tx.team.findUnique({
        where: { email }, // Now we're sure this is a string
      });

      if (!team) {
        return { success: false, msg: "Team not found", status: 404 };
      }

      const alreadyAnswered = team.questions.includes(questionKey);

      if (isCorrect && !alreadyAnswered) {
        // First time correct — award point and save question
        await tx.team.update({
          where: { id: team.id },
          data: {
            score: { increment: 1 },
            questions: { push: questionKey },
            submissionTimes: { push: timestamp }
          },
        });

        return {
          success: true,
          msg: "Correct answer! +1 point"
        };
      }

      return {
        success: isCorrect,
        msg: isCorrect
          ? "Correct answer! (No points - already answered)"
          : "Incorrect answer. Try again!"
      };
    });

    if (result.status) {
      return NextResponse.json({ success: result.success, msg: result.msg }, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
  }
}