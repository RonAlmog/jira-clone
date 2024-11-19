import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schemas";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })
  .post(
    "/login",
    // "/login/:userId",     // if you need...
    zValidator("json", loginSchema),
    // zValidator("param", z.object({ userId: z.number() })),
    async (c) => {
      const { email, password } = c.req.valid("json");
      // const {userId}=c.req.valid('param');
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);
      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 + 24 * 30 * 1000,
      });

      // console.log({ email, password });
      return c.json({ success: true });
    }
  )
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    // console.log({ name, email, password });
    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 + 24 * 30,
    });
    return c.json({ success: true });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    // thanks to middleware, get the account from context.
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    // delete current session
    await account.deleteSession("current");

    return c.json({ success: true });
  });

export default app;
