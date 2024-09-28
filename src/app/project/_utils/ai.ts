import { submitMessage } from "../actions/copilotActions";
import { createAI } from "ai/rsc";

export const AI = createAI({
  actions: {
    submitMessage,
  },
  initialAIState: [],
  initialUIState: [],
});
