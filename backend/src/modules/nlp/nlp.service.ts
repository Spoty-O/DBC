import { Injectable } from '@nestjs/common';
import {
  IFieldParser,
  ITableField,
  ITableSchema,
} from 'src/shared/interfaces/nlp.interface';
import * as parsers from 'src/shared/utils/parsers';
import { TableNameParser } from 'src/shared/utils/parsers/tableNameParser.util';
import { ErrorService } from '../error/error.service';

@Injectable()
export class NlpService {
  private readonly fieldParsers: IFieldParser[];
  private readonly tableNameParser: IFieldParser;

  constructor(private readonly errorService: ErrorService) {
    this.fieldParsers = Object.values(parsers).map(
      (ParserClass) => new ParserClass(),
    );
    this.tableNameParser = new TableNameParser();
  }

  public parseTemplateText(text: string): ITableSchema[] {
    const tables = new Map<string, ITableSchema>();
    const lines = text.split('\n').map((line) => line.trim());
    for (const line of lines) {
      const tableName = this.tableNameParser.parse(line);
      if (!tableName?.name) continue;
      if (!tables.get(tableName.name)) {
        tables.set(tableName.name, { name: tableName.name, fields: [] });
      }
      let field: ITableField = { name: '' };
      for (const parser of this.fieldParsers) {
        const parameter = parser.parse(line);
        if (parameter) {
          field = { ...field, ...parameter };
        }
      }
      tables.get(tableName.name)?.fields.push(field);
    }
    return Array.from(tables.values());
  }
}
