import type { UserLucia } from "~~/server/database/schema/auth";

export const useUser = () => {
  const user = useState<UserLucia | null>("user", () => null);
  return user;
};
