import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || !session.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calls = await prisma.callLog.findMany({
    where: { tenantId: session.tenantId },
    include: { assistant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(calls);
}
