import AICopilot from "../../_components/AICopilot";
import { hasAccess } from "@/lib/user/projectAccess";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Copilot({ params }: { params: { id: string } }) {
  const projectId = params.id;
  const session = await getServerSession(authOptions);
  const hasSendNewMessageAccess = hasAccess({
    projectId: projectId,
    scope: "conversations:create",
    session: session,
  })

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col py-24">
      <AICopilot
        hasSendNewMessageAccess={hasSendNewMessageAccess}
        projectId={projectId}
        conversationId={null}
      />
    </div>
  );
}
