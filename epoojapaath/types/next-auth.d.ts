import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isBlocked: boolean;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    isBlocked: boolean;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isBlocked: boolean;
    avatar?: string;
  }
}
