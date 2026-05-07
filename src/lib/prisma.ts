import config from "../config/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client.js";

const adapter = new PrismaPg({ connectionString: config.prisma.db_url });

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
