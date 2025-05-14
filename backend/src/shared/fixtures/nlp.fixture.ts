import { ITableSchema } from '../interfaces/nlp.interface';

export const simpleFixture = `
product has title type varchar length 255 default 'easy_name' autoIncrement check = (title != '') foreign key references product(id) index nullable primary key unique
product has price type decimal default 0.0
product has count type int default 0 nullable
`;
export const simpleResultFixture: ITableSchema = {
  name: 'product',
  fields: [
    {
      name: 'title',
      type: 'varchar',
      length: 255,
      defaultValue: 'easy_name',
      autoIncrement: true,
      check: "(title != '')",
      foreignKey: { columnName: 'id', tableName: 'product' },
      index: true,
      nullable: true,
      primaryKey: true,
      unique: true,
    },
    { name: 'price', type: 'decimal', defaultValue: 0.0 },
    { name: 'count', type: 'int', defaultValue: 0, nullable: true },
  ],
};
