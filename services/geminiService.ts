
import { GoogleGenAI, Type } from "@google/genai";
import { KNOWLEDGE_BASE_DATA, SYSTEM_INSTRUCTION } from "../constants";

/* ======================================
   TYPES
====================================== */

export type CopilotResponse = {
  answer: string;
  sopId: string;
  confidence: number;
};

export type TicketClassification = {
  category: string;
  priority: "Low" | "Medium" | "High";
  urgency: "Low" | "Medium" | "High";
  recommendedTeam: string;
  summary: string;
  stepsTaken: string[];
};

/* ======================================
   COPILOT CHAT FUNCTION
====================================== */

export const getCopilotResponse = async (
  history: { role: string; content: string }[],
  message: string
): Promise<CopilotResponse> => {
  // Always create a fresh instance to use the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const contents = history.map((h) => ({
    role: h.role === "user" ? "user" : "model",
    parts: [{ text: h.content }],
  }));

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const response = await ai.models.generateContent({
    model,
    contents: contents as any,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + `\n\nAvailable SOPs for reference:\n${JSON.stringify(KNOWLEDGE_BASE_DATA)}`,
      temperature: 0.4,
    },
  });

  const rawText = response.text || "";
  const sopMatch = rawText.match(/SOP-\d+/i);
  const sopId = sopMatch ? sopMatch[0].toUpperCase() : "General Guidance";
  
  let confidence = 0.95;
  if (!sopMatch) confidence = 0.75;
  if (rawText.toLowerCase().includes("not sure") || rawText.toLowerCase().includes("escalate")) confidence = 0.6;

  return {
    answer: rawText,
    sopId,
    confidence,
  };
};

/* ======================================
   TICKET CLASSIFICATION FUNCTION
====================================== */

export const classifyTicket = async (
  history: string
): Promise<TicketClassification> => {
  // Always create a fresh instance to use the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use gemini-3-pro-preview for complex classification and extraction tasks
  const model = "gemini-3-pro-preview";

  const prompt = `
Analyze the following IT support chat and classify the ticket for escalation.
You MUST extract every troubleshooting step attempted from the chat history to prevent Tier-2 from repeating work.

Classification Rules:
- Priority: 
    * High: Work is completely stopped for one or more users.
    * Medium: Work is significantly degraded but possible.
    * Low: General inquiries, feature requests, or minor cosmetic issues.
- Urgency:
    * High: Requires immediate attention (e.g., security breach, production outage).
    * Medium: Needs resolution within current business day.
    * Low: Can wait for next maintenance window.

Respond in JSON format only with strictly these values: [Low, Medium, High] for Priority and Urgency.

Chat History:
${history}
`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          priority: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High"],
          },
          urgency: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High"],
          },
          recommendedTeam: { type: Type.STRING },
          summary: { type: Type.STRING },
          stepsTaken: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of specific troubleshooting steps already tried."
          }
        },
        required: [
          "category",
          "priority",
          "urgency",
          "recommendedTeam",
          "summary",
          "stepsTaken"
        ],
      },
    },
  });

  return JSON.parse(response.text || "{}") as TicketClassification;
};
