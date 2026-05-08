import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  prisma: {
    db_url: process.env.DATABASE_URL,
    direct_url: process.env.DIRECT_URL,
  },

  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    passwrod: process.env.SUPER_ADMIN_PASSWORD,
  },

  password_hash_slot: process.env.PASSWORD_HASH_SLOT,

  email: {
    address: process.env.EMAIL_ADDRESS,
    password: process.env.EMAIL_PASSWORD,
  },

  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};

export default config;
