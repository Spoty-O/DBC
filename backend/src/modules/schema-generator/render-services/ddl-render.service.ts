import { Injectable } from '@nestjs/common';
import {
  IRenderService,
  IRenderUtil,
  ITableSchema,
} from 'src/shared/interfaces';
import * as utils from 'src/shared/utils/ddl-render';

@Injectable()
export class DdlRenderService implements IRenderService {
  readonly utils: IRenderUtil[];
  readonly primaryKeyRender: IRenderUtil;
  readonly foreignKeyRender: IRenderUtil;

  constructor() {
    const { PrimaryKeyRender, ForeignKeyRender, ...otherUtils } = utils;
    this.utils = Object.values(otherUtils).map(
      (RenderClass) => new RenderClass(),
    );
    this.primaryKeyRender = new PrimaryKeyRender();
    this.foreignKeyRender = new ForeignKeyRender();
  }

  async renderTable(table: ITableSchema): Promise<string> {
    const tablePropertiesArray: string[] = [];
    const primaryKeyPropertiesArray: string[] = [];
    const foreignKeyPropertiesArray: string[] = [];
    const indexableColumnsArray: string[] = [];
    for (const field of table.fields) {
      const promiseList = this.utils.map((util) => {
        return util.render(field);
      });
      const invalidAdditionalParamsArray = await Promise.all(promiseList);
      const additionalParamsList = invalidAdditionalParamsArray.filter(
        (param) => param,
      );
      const primaryKeyQuery = await this.primaryKeyRender.render(field);
      if (primaryKeyQuery) {
        primaryKeyPropertiesArray.push(`  ${primaryKeyQuery}`);
      }
      if (field.index) {
        indexableColumnsArray.push(field.name);
      }
      const foreignKeyQuery = await this.foreignKeyRender.render(field);
      if (foreignKeyQuery) {
        foreignKeyPropertiesArray.push(`  ${foreignKeyQuery}`);
      }
      tablePropertiesArray.push(
        `  ${field.name} ${field.type.toUpperCase()} ${additionalParamsList.join(` `)}`.trimEnd(),
      );
    }
    const propertiesArray = [
      ...tablePropertiesArray,
      ...primaryKeyPropertiesArray,
      ...foreignKeyPropertiesArray,
    ];
    let query = `CREATE TABLE ${table.name} (\n${propertiesArray.join(`,\n`)}\n);`;
    if (indexableColumnsArray.length > 0) {
      const index = indexableColumnsArray.join(`, `);
      query += `CREATE INDEX idx_${table.name}\nON ${table.name} (${index})`;
    }
    return query;
  }

  async render(tables: ITableSchema[]): Promise<string> {
    const promiseList = tables.map((table) => {
      return this.renderTable(table);
    });
    const tableQueryList = await Promise.all(promiseList);
    const query = tableQueryList.join(`\n\n`);
    return query;
  }
}
