import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schemas";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .post(
    "/login",
    // "/login/:userId",     // if you need...
    zValidator("json", loginSchema),
    // zValidator("param", z.object({ userId: z.number() })),
    async (c) => {
      const { email, password } = c.req.valid("json");
      // const {userId}=c.req.valid('param');

      console.log({ email, password });
      return c.json({ email, password });
    }
  )
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    console.log({ name, email, password });
    const { account } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 + 24 * 30,
    });
    return c.json({ data: user });
  });

export default app;
