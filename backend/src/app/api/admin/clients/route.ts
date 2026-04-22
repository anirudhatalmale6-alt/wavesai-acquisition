import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: { select: { users: true, assistants: true, callLogs: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tenants);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, password, plan } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const tenant = await prisma.tenant.create({
    data: {
      name,
      slug,
      plan: plan || "STARTER",
      users: {
        create: {
          email,
          password: await hashPassword(password),
          name,
          role: "CLIENT_ADMIN",
        },
      },
    },
    include: { users: true },
  });

  return NextResponse.json(tenant, { status: 201 });
}
