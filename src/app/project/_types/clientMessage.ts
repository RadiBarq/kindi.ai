import { ReactNode } from "react";
import { StreamableValue } from "ai/rsc";

export default interface ClientMessage {
  id: string;
  text?: ReactNode;
  role: string;
  rawTextStream?: StreamableValue<string, any>;
}
