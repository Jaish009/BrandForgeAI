import { prisma } from "../lib/prisma";

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
};
