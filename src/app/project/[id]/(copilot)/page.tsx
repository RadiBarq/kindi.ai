"use client";

import AICopilot from "../../_components/AICopilot";

export default function Copilot() {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col py-24">
      <AICopilot conversationId={null} />
    </div>
  );
}
