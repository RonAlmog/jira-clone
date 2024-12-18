import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { workspaces } from "../data/workspaces";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";

const app = new Hono()
  .post("/workspaces", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    workspaces.forEach(async (ws) => {
      // console.log(ws.name);
      await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
        name: ws.name,
        userId: user.$id,
        imageUrl: "",
        inviteCode: generateInviteCode(6),
      });
    });

    return c.json({ success: true });
  })

  .post("/members", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      []
    );

    workspaces.documents.forEach(async (ws) => {
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: ws.$id,
        role: MemberRole.ADMIN,
      });
    });

    return c.json({ success: true });
  });

export default app;
