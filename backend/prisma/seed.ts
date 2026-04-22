import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("WavesAI2026!", 10);

  await prisma.user.upsert({
    where: { email: "admin@wavesai.com" },
    update: {},
    create: {
      email: "admin@wavesai.com",
      password: hashedPassword,
      name: "Shaazia",
      role: "SUPER_ADMIN",
      tenantId: null,
    },
  });

  console.log("Seeded super admin: admin@wavesai.com / WavesAI2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
