import AICopilot from "../../../../_components/AICopilot";
import { hasAccess } from "@/lib/user/projectAccess";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { CoreMessage } from "ai";
import { conversationMessages } from "@/app/project/actions/copilotActions";
import ErrorMessage from "@/components/misc/Error";

export default async function Conversations({
  params,
}: {
  params: { id: string; conversationId: string };
}) {
  const projectId = params.id;
  const conversationId = params.conversationId;
  const session = await getServerSession(authOptions);
  const hasSendNewMessageAccess = hasAccess({
    projectId: projectId,
    scope: "conversations:create",
    session: session,
  });

  try {
    const messages = await conversationMessages(conversationId);
    const coreMessages = messages.map(
      (conversation) =>
        ({
          role: conversation.role,
          content: conversation.message,
        }) as CoreMessage,
    );
    return (
      <div className="mx-auto flex min-h-screen w-full flex-col lg:py-24">
        <AICopilot
          hasSendNewMessageAccess={hasSendNewMessageAccess}
          projectId={projectId}
          conversationId={conversationId}
          existingMessages={coreMessages}
        />
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
