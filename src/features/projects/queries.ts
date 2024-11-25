"use server";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "./types";

// export const getWorkspaces = async () => {
//   try {
//     const { databases, account } = await createSessionClient();
//     const user = await account.get();
//     const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
//       Query.equal("userId", user.$id),
//     ]);

//     if (members.total === 0) {
//       return { documents: [], total: 0 };
//     }
//     const workspaceIds = members.documents.map((member) => member.workspaceId);

//     const workspaces = await databases.listDocuments(
//       DATABASE_ID,
//       WORKSPACES_ID,
//       [Query.contains("$id", workspaceIds), Query.orderDesc("$createdAt")]
//     );

//     return workspaces;
//   } catch {
//     return { documents: [], total: 0 };
//   }
// };

interface GetProjectProps {
  projectId: string;
}
export const getProject = async ({ projectId }: GetProjectProps) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();
    // load the project
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );
    // find out if the member belong to the workspace of that project.
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });
    if (!member) {
      return null;
    }

    return project;
  } catch {
    return null;
  }
};

// this allows get workspace without being a member yet.
// for the join thru link
export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { databases } = await createSessionClient();

    // no need to be a member

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    // for security, only return name
    return {
      name: workspace.name,
    };
  } catch {
    return null;
  }
};
