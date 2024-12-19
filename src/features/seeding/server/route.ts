import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { workspaces } from "../data/workspaces";
import { projects } from "../data/projects";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";
import { deleteAllSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .post(
    "/workspaces",
    sessionMiddleware,
    zValidator("json", deleteAllSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { deleteAll } = c.req.valid("json");

      // delete all before seeding
      if (deleteAll) {
        const workspaces = await databases.listDocuments(
          DATABASE_ID,
          WORKSPACES_ID,
          []
        );
        const promises: Promise<unknown>[] = [];
        workspaces.documents.forEach((ws) => {
          const promise = databases.deleteDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ws.$id
          );
          promises.push(promise);
        });
        await Promise.all(promises);
        console.log("workspaces deleted");
      }

      workspaces.forEach(async (ws) => {
        await databases.createDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          ID.unique(),
          {
            name: ws.name,
            userId: user.$id,
            imageUrl: "",
            inviteCode: generateInviteCode(6),
          }
        );
      });

      return c.json({ success: true });
    }
  )

  .post(
    "/members",
    sessionMiddleware,
    zValidator("json", deleteAllSchema),
    async (c) => {
      const databases = c.get("databases");
      const { deleteAll } = c.req.valid("json");

      // delete all before seeding
      if (deleteAll) {
        const members = await databases.listDocuments(
          DATABASE_ID,
          MEMBERS_ID,
          []
        );
        const promises: Promise<unknown>[] = [];
        members.documents.forEach((member) => {
          const promise = databases.deleteDocument(
            DATABASE_ID,
            MEMBERS_ID,
            member.$id
          );
          promises.push(promise);
        });
        await Promise.all(promises);
        console.log("members deleted");
      }

      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        []
      );

      // somewhat awkward way to get ids of all users, because we don't have direct access.
      const userIds = new Set(workspaces.documents.map((ws) => ws.$id));

      // create members, for every user in every workspace
      workspaces.documents.forEach(async (ws) => {
        userIds.forEach(async (userId) => {
          await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
            userId: userId,
            workspaceId: ws.$id,
            role: MemberRole.ADMIN,
          });
        });
      });

      return c.json({ success: true });
    }
  )
  .post(
    "/projects",
    sessionMiddleware,
    zValidator("json", deleteAllSchema),
    async (c) => {
      const databases = c.get("databases");
      const { deleteAll } = c.req.valid("json");

      // delete all projects before seeding
      if (deleteAll) {
        const projects = await databases.listDocuments(
          DATABASE_ID,
          PROJECTS_ID,
          []
        );
        const promises: Promise<unknown>[] = [];
        projects.documents.forEach((project) => {
          const promise = databases.deleteDocument(
            DATABASE_ID,
            PROJECTS_ID,
            project.$id
          );
          promises.push(promise);
        });
        await Promise.all(promises);
        console.log("projects deleted");
      }

      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        []
      );

      workspaces.documents.forEach(async (ws) => {
        projects.forEach(async (proj) => {
          await databases.createDocument(
            DATABASE_ID,
            PROJECTS_ID,
            ID.unique(),
            {
              imageUrl: null,
              workspaceId: ws.$id,
              name: proj.name,
            }
          );
        });
      });

      return c.json({ success: true });
    }
  );

export default app;
