import "server-only"; // make sure this thing only run on server!
import { Client, Account, Databases, Users, ID, Models } from "node-appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/features/auth/constants";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = await cookies().get(AUTH_COOKIE);
  if (!session || !session.value) {
    throw new Error("Unauthorized");
  }

  client.setSession(session.value);

  const databases = new Databases(client);

  type DbType = {
    databaseId: string;
    id: string;
    name: string;
  };
  type collectionType = {
    get: (id: string) => Promise<Models.Document>;
    list: (x: string[]) => Promise<Models.DocumentList<Models.Document>>;
    create: (payload: Models.Document, id: string) => Promise<Models.Document>;
    update: (id: string, payload: Models.Document) => Promise<Models.Document>;
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    delete: (id: string) => Promise<{}>;
  };

  const collections: DbType[] = [
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

  const db: collectionType[] = [];

  collections.forEach((col: DbType) => {
    const colType: collectionType = {
      get: (id: string) => databases.getDocument(col.databaseId, col.id, id),
      list: (queries: string[]) =>
        databases.listDocuments(col.databaseId!, col.id!, queries),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create: (payload: any, id: string = ID.unique()) =>
        databases.createDocument(col.databaseId!, col.id!, id, payload),

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: (id: string, payload: any) =>
        databases.updateDocument(col.databaseId, col.id, id, payload),

      delete: (id: string) =>
        databases.deleteDocument(col.databaseId, col.id, id),
    };
    db.push(colType);
  });

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return databases; //  new Databases(client);
    },
    get db() {
      return db;
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
}
