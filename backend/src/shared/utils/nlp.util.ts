import { ITableSchema } from '../interfaces';

export const getOrCreate = (
  map: Map<string, ITableSchema>,
  key: string,
): ITableSchema => {
  if (!map.has(key)) map.set(key, { name: key, fields: [] });
  return map.get(key)!;
};
