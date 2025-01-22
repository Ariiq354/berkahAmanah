import type {
  UserLucia,
  ROLES as userRole,
} from "~~/server/database/schema/auth";

type Role = keyof typeof ROLES;
export type Permission = (typeof ROLES)[Role][number];
type ROLESTYPE = Record<userRole, Array<(typeof RESOURCE)[number]>>;
const RESOURCE = ["admin"] as const;

const ROLES: ROLESTYPE = {
  admin: [...RESOURCE],
  user: [],
} as const;

export function hasPermission(user: UserLucia, permission: Permission) {
  return (ROLES[user.role] as readonly Permission[]).includes(permission);
}
