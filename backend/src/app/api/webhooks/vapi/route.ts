import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json({ ok: true });
  }

  if (message.type === "end-of-call-report") {
    const call = message.call;
    if (!call?.id) return NextResponse.json({ ok: true });

    const assistant = await prisma.voiceAssistant.findFirst({
      where: { vapiAssistantId: call.assistantId },
    });

    if (assistant) {
      await prisma.callLog.upsert({
        where: { vapiCallId: call.id },
        create: {
          vapiCallId: call.id,
          tenantId: assistant.tenantId,
          assistantId: assistant.id,
          callerNumber: call.customer?.number || null,
          direction: call.type === "inboundPhoneCall" ? "inbound" : "outbound",
          status: "completed",
          duration: call.costs?.find(
            (c: { type: string }) => c.type === "total"
          )
            ? Math.round((call.endedAt
                ? (new Date(call.endedAt).getTime() -
                    new Date(call.startedAt).getTime()) /
                  1000
                : 0))
            : 0,
          summary: message.summary || null,
          recordingUrl: message.recordingUrl || null,
          startedAt: call.startedAt ? new Date(call.startedAt) : null,
          endedAt: call.endedAt ? new Date(call.endedAt) : null,
        },
        update: {
          status: "completed",
          summary: message.summary || null,
          recordingUrl: message.recordingUrl || null,
          endedAt: call.endedAt ? new Date(call.endedAt) : null,
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
