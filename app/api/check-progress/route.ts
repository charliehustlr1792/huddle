import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ score: 0 }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { email: session.user.email },
      select: { score: true }
    });

    if (!team) {
      return NextResponse.json({ score: 0 }, { status: 404 });
    }

    return NextResponse.json({
      score: team.score
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ score: 0 }, { status: 500 });
  }
}