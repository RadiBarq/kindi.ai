import type { Metadata } from "next";
import ProjectMembers from "./component/ProjectMembers";
import ErrorMessage from "@/components/misc/Error";
import { getProjectMembers } from "./actions";

export const metadata: Metadata = {
  title: "Project settings | Kindi AI",
};

export default async function Settings({ params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const members = await getProjectMembers(projectId);
    return (
      <div className="flex max-w-7xl flex-col items-start justify-start gap-10 p-10">
        {/* Header */}
        <div className="text-4xl font-bold">Settings</div>
        <ProjectMembers members={members} />
      </div>
    );
  } catch (error: any) {
    console.error(error);
    return (
      <div className="px-10 py-32">
        <ErrorMessage withImage={false} message={error.message} />
      </div>
    );
  }
}
