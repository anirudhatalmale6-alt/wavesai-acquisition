import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createVapiAssistant, updateVapiAssistant, deleteVapiAssistant } from "@/lib/vapi";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = req.nextUrl.searchParams.get("tenantId");

  const where = tenantId ? { tenantId } : {};
  const assistants = await prisma.voiceAssistant.findMany({
    where,
    include: { tenant: true, phoneNumbers: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assistants);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tenantId, name, systemPrompt, firstMessage, voiceId } = await req.json();

  if (!tenantId || !name || !systemPrompt) {
    return NextResponse.json(
      { error: "tenantId, name, and systemPrompt are required" },
      { status: 400 }
    );
  }

  const vapiResult = await createVapiAssistant({
    name,
    systemPrompt,
    firstMessage: firstMessage || `Hi there! Thanks for calling. How can I help you today?`,
    voiceId: voiceId || "Elliot",
  });

  const assistant = await prisma.voiceAssistant.create({
    data: {
      tenantId,
      name,
      vapiAssistantId: vapiResult.id,
      systemPrompt,
      firstMessage: firstMessage || `Hi there! Thanks for calling. How can I help you today?`,
      voiceId: voiceId || "Elliot",
    },
  });

  return NextResponse.json(assistant, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, systemPrompt, firstMessage, voiceId } = await req.json();

  const existing = await prisma.voiceAssistant.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Assistant not found" }, { status: 404 });
  }

  if (existing.vapiAssistantId) {
    await updateVapiAssistant(existing.vapiAssistantId, {
      name,
      systemPrompt,
      firstMessage,
      voiceId,
    });
  }

  const updated = await prisma.voiceAssistant.update({
    where: { id },
    data: { name, systemPrompt, firstMessage, voiceId },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const existing = await prisma.voiceAssistant.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Assistant not found" }, { status: 404 });
  }

  if (existing.vapiAssistantId) {
    try {
      await deleteVapiAssistant(existing.vapiAssistantId);
    } catch {
      // Vapi assistant may already be deleted
    }
  }

  await prisma.voiceAssistant.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
