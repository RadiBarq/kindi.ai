"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";

export function Message({
  textStream,
  statusStream,
}: {
  textStream: StreamableValue;
  statusStream: StreamableValue;
}) {
  const [text] = useStreamableValue(textStream);
  const [status] = useStreamableValue(statusStream);

  return (
    <div className="flex flex-col gap-4">
      {text && (
        <div className="overflow-hidden whitespace-pre-wrap  border-gray-900 text-gray-900">
          {text}
        </div>
      )}

      {status && <div className="text-gray-900">{status}</div>}
    </div>
  );
}
