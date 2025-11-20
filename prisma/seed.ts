import { accountType, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash('password', 10);
  await prisma.users.deleteMany({});
  await prisma.users.createMany({
    data: [
      {
        email: 'johndoe@ubulu.africa',
        fullName: 'John Doe',
        password,
        accountType: accountType.evaluator,
      },
      {
        email: 'gracepen@ubulu.africa',
        fullName: 'Grace Pen',
        password,
        accountType: accountType.screener,
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
