"use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    // need to await cookies in next 15
    const session = await cookies().get(AUTH_COOKIE);
    if (!session) return null;

    const account = new Account(client);
    return await account.get();
  } catch (error) {
    return null;
  }
};
