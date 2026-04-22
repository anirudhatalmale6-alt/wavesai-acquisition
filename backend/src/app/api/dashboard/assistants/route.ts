import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || !session.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assistants = await prisma.voiceAssistant.findMany({
    where: { tenantId: session.tenantId },
    include: { _count: { select: { callLogs: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assistants);
}
