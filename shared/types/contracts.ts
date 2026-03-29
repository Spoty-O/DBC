export type TCharacter = 'morpheus' | 'smith';

export interface IGenerateSchemaRequest {
  text: string;
  character: TCharacter;
}

export interface IGenerateSchemaResponse {
  requirements: unknown;
  schema: unknown;
  narrative?: string;
}
