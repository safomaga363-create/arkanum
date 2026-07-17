const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Admin123!", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@arkanum.io" },
    update: { role: "SUPER_ADMIN" },
    create: {
      email: "admin@arkanum.io",
      username: "admin",
      displayName: "Admin",
      passwordHash: hash,
      role: "SUPER_ADMIN",
      country: "Global",
    },
  });
  console.log("Admin user created:", user.email, user.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
