import { Injectable } from '@nestjs/common';
import {
  IFieldParser,
  INlpService,
  ITableField,
  ITableSchema,
} from 'src/shared/interfaces';
import * as parsers from 'src/shared/utils/parsers';
import { ErrorService } from '../error/error.service';
import { getOrCreate } from 'src/shared/utils';

@Injectable()
export class NlpService implements INlpService {
  readonly fieldParsers: IFieldParser[];
  readonly tableNameParser: IFieldParser;

  constructor(private readonly errorService: ErrorService) {
    const { TableNameParser, ...otherParsers } = parsers;
    this.fieldParsers = Object.values(otherParsers).map(
      (ParserClass) => new ParserClass(),
    );
    this.tableNameParser = new TableNameParser();
  }

  public async parseTemplateText(text: string): Promise<ITableSchema[]> {
    const tables = new Map<string, ITableSchema>();
    const lines = text.split('\n').map((line) => line.trim());
    for (const line of lines) {
      const tableName = await this.tableNameParser.parse(line);
      if (!tableName?.name) continue;
      let field: ITableField = {
        name: '',
        type: 'varchar(255)',
        nullable: true,
      };
      const promiseList = this.fieldParsers.map((parser) => parser.parse(line));
      const resolvedPromiseList = await Promise.allSettled(promiseList);
      resolvedPromiseList.forEach((res) => {
        if (res.status === 'fulfilled' && res.value)
          field = { ...field, ...res.value };
      });
      const table = getOrCreate(tables, tableName.name);
      table.fields.push(field);
    }
    return Array.from(tables.values());
  }
}
