import AICopilot from "../../_components/AICopilot";
import { hasAccess } from "@/lib/user/projectAccess";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getProject } from "../../actions/projectActions";
import ErrorMessage from "@/components/misc/Error";

export default async function Copilot({ params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const session = await getServerSession(authOptions);
    const project = await getProject(projectId);
    const hasCopilotCreateAccess = hasAccess({
      projectId: projectId,
      scope: "copilot:create",
      session: session,
    });

    return (
      <div className="mx-auto flex min-h-screen w-full flex-col lg:py-24">
        <AICopilot
          hasCopilotCreateAccess={hasCopilotCreateAccess}
          projectId={projectId}
          threadId={null}
          assistantId={project.defaultAssistantId}
          existingMessages={[]}
        />
      </div>
    );
  } catch (error: any) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    return (
      <div className="px-10 py-32">
        <ErrorMessage withImage={false} message={error.message} />
      </div>
    );
  }
}
