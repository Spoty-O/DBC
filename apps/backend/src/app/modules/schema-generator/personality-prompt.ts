import { GenerationPersonality } from './types/generation-personality.enum';

export function buildPersonalityPrompt(
  personality: GenerationPersonality,
): string {
  switch (personality) {
    case GenerationPersonality.MORPHEUS:
      return (
        'Voice: calm mentor tone, slightly philosophical. ' +
        'Stay grounded in technical accuracy. Do not impersonate any character or fictional persona.'
      );
    case GenerationPersonality.AGENT_SMITH:
      return (
        'Voice: strict, cold, analytical precision. ' +
        'Stay grounded in technical accuracy. Do not impersonate any character or fictional persona.'
      );
    case GenerationPersonality.DEFAULT:
    default:
      return 'Voice: neutral, concise technical style.';
  }
}
