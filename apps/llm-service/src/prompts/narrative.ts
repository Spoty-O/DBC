import { TCharacter } from 'types';

export function buildNarrativePrompt(
  character: TCharacter,
  schemaJson: string,
): string {
  return `
You explain the already designed database in the style of ${character}.
Do not add any new tables, fields, or relations.
Do not quote the movie directly.
Keep it short, 6-8 sentences.

Schema JSON:
<<<
${schemaJson}
>>>
`.trim();
}
