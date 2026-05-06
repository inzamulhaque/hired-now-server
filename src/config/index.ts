import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,

  prisma: {
    db_url: process.env.DATABASE_URL,
    direct_url: process.env.DIRECT_URL,
  },
};

export default config;
