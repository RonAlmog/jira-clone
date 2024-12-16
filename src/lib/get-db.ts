import { Databases, ID, Models } from "node-appwrite";

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
type dbOperation = Record<string, collectionType>;

export const getDb = (databases: Databases) => {
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

  const db: dbOperation = {};

  collections.forEach((col: DbType) => {
    db[col.name] = {
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
  });

  console.log({ db });

  return db;
};
