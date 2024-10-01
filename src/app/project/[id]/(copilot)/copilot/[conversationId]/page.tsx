import AICopilot from "../../../../_components/AICopilot";
import { hasAccess } from "@/lib/user/projectAccess";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getProject } from "@/app/project/actions/projectActions";
import { conversationMessages } from "@/app/project/actions/copilotActions";
import ErrorMessage from "@/components/misc/Error";

export default async function Conversations({
  params,
}: {
  params: { id: string; conversationId: string };
}) {
  const projectId = params.id;
  const conversationId = params.conversationId;

  try {
    const session = await getServerSession(authOptions);
    const hasCopilotCreateAccess = hasAccess({
      projectId: projectId,
      scope: "copilot:create",
      session: session,
    });

    const project = await getProject(projectId);
    const { messages, threadId } = await conversationMessages(conversationId);
    return (
      <div className="mx-auto flex min-h-screen w-full flex-col lg:py-24">
        <AICopilot
          hasCopilotCreateAccess={hasCopilotCreateAccess}
          projectId={projectId}
          assistantId={project.defaultAssistantId}
          threadId={threadId}
          existingMessages={messages}
        />
      </div>
    );
  } catch (error: any) {
    let errorMessage = "";
    if (error instanceof Error) {
      console.error(error.message);
      errorMessage = error.message;
    } else {
      console.log(error);
      errorMessage = "Something went wrong! Please try again later.";
    }

    return (
      <div className="px-10 py-32">
        <ErrorMessage withImage={false} message={errorMessage} />
      </div>
    );
  }
}
