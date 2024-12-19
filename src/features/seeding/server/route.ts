import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { workspaces } from "../data/workspaces";
import { projects } from "../data/projects";
import { tasks } from "../data/tasks";
import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";
import { deleteAllSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";
import { TaskStatus } from "@/features/tasks/types";
import { addDays } from "date-fns";

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
  )
  .post(
    "/tasks",
    sessionMiddleware,
    zValidator("json", deleteAllSchema),
    async (c) => {
      const databases = c.get("databases");
      const { deleteAll } = c.req.valid("json");

      // delete all before seeding
      if (deleteAll) {
        const existingTasks = await databases.listDocuments(
          DATABASE_ID,
          TASKS_ID,
          []
        );
        const promises: Promise<unknown>[] = [];
        existingTasks.documents.forEach((task) => {
          const promise = databases.deleteDocument(
            DATABASE_ID,
            TASKS_ID,
            task.$id
          );
          promises.push(promise);
        });
        await Promise.all(promises);
        console.log("tasks deleted");
      }

      // prepare data for seeding
      const statuses = [
        TaskStatus.BACKLOG,
        TaskStatus.TODO,
        TaskStatus.IN_PROGRESS,
        TaskStatus.IN_REVIEW,
        TaskStatus.DONE,
      ];

      // get all workspaces.
      // for each one we will add tasks to members
      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        []
      );

      // maybe within each ws? currently global
      let position = 1000;

      workspaces.documents.forEach(async (ws) => {
        // find members of this ws
        const wsMembers = await databases.listDocuments(
          DATABASE_ID,
          MEMBERS_ID,
          [Query.equal("workspaceId", ws.$id)]
        );

        console.log("members", wsMembers);

        // find projects for this ws
        const wsProjects = await databases.listDocuments(
          DATABASE_ID,
          PROJECTS_ID,
          [Query.equal("workspaceId", ws.$id)]
        );

        console.log("projects", wsProjects);

        // create tasks

        tasks.forEach(async (task) => {
          //   await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
          //     workspaceId: ws.$id,
          //     name: task.name,
          //     description: "lorem ipsum", // task.description,
          //     position: position,
          //     status: statuses[Math.floor(Math.random() * statuses.length)], // choose random status
          //     dueDate: addDays(new Date(), 3 + Math.floor(Math.random() * 30)),
          //     assigneeId:
          //       wsMembers.documents[
          //         Math.floor(Math.random() * wsMembers.documents.length - 1)
          //       ].$id,
          //     projectId:
          //       wsProjects.documents[
          //         Math.floor(Math.random() * wsProjects.documents.length - 1)
          //       ].$id,
          //   });
          //   position += 1000;
        });
      });
      return c.json({ success: true });
    }
  );

export default app;
