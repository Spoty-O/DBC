export function buildRepairedPrompt(first: string, prompt: string): string {
  return `
Your previous answer did not match the required JSON schema.
Fix it and return ONLY valid JSON.

Previous answer:
${first}

Original task:
${prompt}
`.trim();
}
