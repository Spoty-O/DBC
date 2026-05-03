import { Injectable } from '@nestjs/common';
import type { DatabaseOutputRequest, DatabaseOutputResult } from 'types';
import { SchemaResultType } from 'types';
import type { DatabaseSchema } from '../schema-generator/schemas/database-schema.type';
import { DEFAULT_RESULT_TYPE } from './constants';
import {
  InvalidSchemaError,
  UnsupportedModeError,
} from './errors/database-output.errors';
import { DatabaseDescriptionService } from './services/database-description.service';
import { PrismaRendererService } from './services/prisma-renderer.service';
import { SqlDdlRendererService } from './services/sql-ddl-renderer.service';
import { TypeOrmRendererService } from './services/typeorm-renderer.service';
import { DatabaseOutputRequestZod } from './validation/database-output-request.validation';

const RESULT_TYPES: SchemaResultType[] = [
  SchemaResultType.SQL,
  SchemaResultType.TYPEORM,
  SchemaResultType.PRISMA,
];

@Injectable()
export class DatabaseOutputService {
  constructor(
    private readonly sqlRenderer: SqlDdlRendererService,
    private readonly typeOrmRenderer: TypeOrmRendererService,
    private readonly prismaRenderer: PrismaRendererService,
    private readonly descriptionService: DatabaseDescriptionService,
  ) {}

  generateOutput(request: DatabaseOutputRequest): DatabaseOutputResult {
    if (
      request.resultType !== undefined &&
      request.resultType !== null &&
      !RESULT_TYPES.includes(request.resultType)
    ) {
      throw new UnsupportedModeError(String(request.resultType));
    }

    const parsed = DatabaseOutputRequestZod.safeParse({
      userPrompt: request.userPrompt,
      schema: request.schema,
      resultType: request.resultType,
    });
    if (!parsed.success) {
      const issues = parsed.error.issues.map(
        (i) => `${i.path.join('.') || 'root'}: ${i.message}`,
      );
      throw new InvalidSchemaError('Invalid database output request', issues);
    }

    const data = parsed.data;
    const resultType = data.resultType ?? DEFAULT_RESULT_TYPE;

    const dbSchema = data.schema;
    const description = this.descriptionService.describeBrief(dbSchema);

    const { schema: schemaText, warnings: genWarnings } =
      this.renderForResultType(resultType, dbSchema);
    const warnings = [...genWarnings];

    return {
      schema: schemaText,
      description,
      warnings: warnings.length ? warnings : undefined,
    };
  }

  private renderForResultType(
    resultType: SchemaResultType,
    schema: DatabaseSchema,
  ): { schema: string; warnings: string[] } {
    switch (resultType) {
      case SchemaResultType.SQL: {
        const { sql, warnings } = this.sqlRenderer.render(schema);
        return { schema: sql, warnings };
      }
      case SchemaResultType.TYPEORM: {
        const { code, warnings } = this.typeOrmRenderer.render(schema);
        return { schema: code, warnings };
      }
      case SchemaResultType.PRISMA: {
        const { code, warnings } = this.prismaRenderer.render(schema);
        return { schema: code, warnings };
      }
      default: {
        throw new UnsupportedModeError(String(resultType));
      }
    }
  }
}
