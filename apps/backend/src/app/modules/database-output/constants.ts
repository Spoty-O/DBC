import { SchemaResultType } from 'types';

export const OUTPUT_RESULT_TYPES = [
  SchemaResultType.SQL,
  SchemaResultType.TYPEORM,
  SchemaResultType.PRISMA,
] as const;

export const DEFAULT_RESULT_TYPE = SchemaResultType.SQL;
