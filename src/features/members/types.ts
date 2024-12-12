import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

// the type contains the basic appwrite shit, plus yours.
export type Member = Models.Document & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
};
