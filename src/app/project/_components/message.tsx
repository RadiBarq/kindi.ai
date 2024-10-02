"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MessageProps {
  textStream: StreamableValue;
  statusStream: StreamableValue;
}

export function Message({ textStream, statusStream }: MessageProps) {
  const [text] = useStreamableValue(textStream);
  const [status] = useStreamableValue(statusStream);
  const customStyle = {
    lineHeight: "1.5",
    fontSize: "1rem",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    padding: "20px",
  };

  return (
    <div className="flex flex-col gap-4">
      {text && (
        <div className="overflow-hidden whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    customStyle={customStyle}
                    style={solarizedLight}
                    PreTag="div"
                    language={match[1]}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={`${className}`} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      )}

      {status && <div className="text-gray-900">{status}</div>}
    </div>
  );
}
