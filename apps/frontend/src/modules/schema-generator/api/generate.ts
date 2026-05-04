import axios, { type AxiosError } from "axios";
import type { GenerateRequest, GenerateResponse } from "types";

function endpointUrl(): string {
  const base = (import.meta.env.VITE_BE_URL as string | undefined)?.trim();
  if (!base) return "/api/generate";
  return `${base.replace(/\/$/, "")}/api/generate`;
}

export function getGenerateErrorMessage(err: unknown): string {
  const ax = err as AxiosError<{ message?: string | string[]; error?: string }>;
  if (!axios.isAxiosError(ax)) {
    return err instanceof Error ? err.message : "Request failed.";
  }
  const data = ax.response?.data;
  if (data && typeof data === "object") {
    if (typeof data.message === "string") return data.message;
    if (Array.isArray(data.message)) return data.message.join(" ");
    if (typeof data.error === "string") return data.error;
  }
  if (ax.response?.status === 400) return "Invalid request. Check your input.";
  if (ax.response?.status === 502 || ax.response?.status === 503) {
    return "Generation service is unavailable. Try again later.";
  }
  if (ax.code === "ERR_NETWORK") {
    return "Network error. Is the API running and CORS enabled?";
  }
  return ax.message || "Request failed.";
}

export async function postGenerate(
  body: GenerateRequest,
): Promise<GenerateResponse> {
  const { data } = await axios.post<GenerateResponse>(endpointUrl(), body, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
