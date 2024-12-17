import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { workspaces } from "../data/workspaces";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono().post("/workspaces", sessionMiddleware, async (c) => {
  const databases = c.get("databases");
  const user = c.get("user");

  workspaces.forEach(async (ws) => {
    console.log(ws.name);
    await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
      name: "abc",
      userId: user.$id,
      imageUrl: "",
      inviteCode: "",
    });
  });

  return c.json({ data: "hoho" });
});

export default app;
