import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "../schemas";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

const app = new Hono().post(
  "/",
  zValidator("form", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const { name, image } = c.req.valid("form");
    // upload image
    let uploadImageUrl: string | undefined;
    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id
      );

      uploadImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    }
    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadImageUrl,
      }
    );

    return c.json({ data: workspace });
  }
);

export default app;
