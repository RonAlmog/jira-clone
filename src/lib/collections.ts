import { DbType } from "./get-db";

export const collections: DbType[] = [
  {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    id: process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
    name: "workspaces",
  },
  {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    id: process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
    name: "projects",
  },
];
