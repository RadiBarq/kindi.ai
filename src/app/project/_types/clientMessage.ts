import { ReactNode } from "react";

export default interface ClientMessage {
  id: string;
  text: ReactNode;
  role: string;
}
