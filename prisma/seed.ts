import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";
import { AccountStatus, Role } from "../src/generated/enums";
import config from "../src/config/index.js";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super admin already exist!");
    }

    if (!isSuperAdminExist) {
      const hashedPassword: string = await bcrypt.hash(
        config.super_admin.passwrod as string,
        12,
      );

      const superAdmin = await prisma.user.create({
        data: {
          name: "Super Admin",
          email: config.super_admin.email as string,
          password: hashedPassword,
          role: Role.SUPER_ADMIN,
          status: AccountStatus.ACTIVE,
        },
      });

      console.log(superAdmin);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
