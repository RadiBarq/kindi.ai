"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
    <div className="flex w-full flex-col flex-wrap gap-4">
      {text && (
        <div className="flex w-full max-w-[250px] flex-wrap overflow-hidden whitespace-pre-wrap sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-4xl">
          <ReactMarkdown
            className="w-full whitespace-pre-wrap"
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    customStyle={customStyle}
                    style={oneLight}
                    PreTag="div"
                    language={match[1]}
                    wrapLines={true}
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
