import type { AccountStatus, Role } from "../../../generated/enums.js";

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  oldPassword?: string;
  role?: Role;
  status?: AccountStatus;
}
