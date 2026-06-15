// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require("@prisma/client");

type PrismaClientType = InstanceType<typeof PrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClientType | undefined;
}

const prisma: PrismaClientType =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export default prisma;
