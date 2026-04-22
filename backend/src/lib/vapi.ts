import axios from "axios";

const VAPI_BASE = "https://api.vapi.ai";
const VAPI_KEY = process.env.VAPI_PRIVATE_KEY!;

const vapi = axios.create({
  baseURL: VAPI_BASE,
  headers: {
    Authorization: `Bearer ${VAPI_KEY}`,
    "Content-Type": "application/json",
  },
});

interface CreateAssistantParams {
  name: string;
  systemPrompt: string;
  firstMessage: string;
  voiceId?: string;
}

export async function createVapiAssistant(params: CreateAssistantParams) {
  const { data } = await vapi.post("/assistant", {
    name: params.name,
    voice: {
      voiceId: params.voiceId || "Elliot",
      provider: "vapi",
    },
    model: {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: params.systemPrompt }],
      provider: "openai",
      temperature: 0.5,
    },
    firstMessage: params.firstMessage,
    endCallMessage:
      "Thank you for calling. Have a wonderful day!",
    transcriber: {
      model: "nova-3",
      language: "en",
      provider: "deepgram",
      endpointing: 150,
    },
    endCallPhrases: ["goodbye", "bye bye", "talk to you soon"],
    startSpeakingPlan: {
      waitSeconds: 0.4,
      smartEndpointingEnabled: "livekit",
    },
  });
  return data;
}

export async function updateVapiAssistant(
  assistantId: string,
  params: Partial<CreateAssistantParams>
) {
  const update: Record<string, unknown> = {};
  if (params.name) update.name = params.name;
  if (params.firstMessage) update.firstMessage = params.firstMessage;
  if (params.voiceId) update.voice = { voiceId: params.voiceId, provider: "vapi" };
  if (params.systemPrompt) {
    update.model = {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: params.systemPrompt }],
      provider: "openai",
      temperature: 0.5,
    };
  }
  const { data } = await vapi.patch(`/assistant/${assistantId}`, update);
  return data;
}

export async function deleteVapiAssistant(assistantId: string) {
  await vapi.delete(`/assistant/${assistantId}`);
}

export async function listVapiCalls(assistantId?: string) {
  const params: Record<string, string> = {};
  if (assistantId) params.assistantId = assistantId;
  const { data } = await vapi.get("/call", { params });
  return data;
}

export async function getVapiCall(callId: string) {
  const { data } = await vapi.get(`/call/${callId}`);
  return data;
}

export async function linkPhoneToAssistant(
  phoneNumberId: string,
  assistantId: string
) {
  const { data } = await vapi.patch(`/phone-number/${phoneNumberId}`, {
    assistantId,
  });
  return data;
}
