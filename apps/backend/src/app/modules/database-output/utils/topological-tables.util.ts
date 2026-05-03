import type { DatabaseSchema } from '../../schema-generator/schemas/database-schema.type';

export interface TopologicalSortResult {
  order: string[];
  warnings: string[];
}

/**
 * FK from table T to ref.table implies ref.table must be created before T.
 * Edges: ref.table -> T
 */
export function topologicalTableOrder(schema: DatabaseSchema): TopologicalSortResult {
  const tableNames = schema.tables.map((t) => t.name);
  const nameSet = new Set(tableNames);
  const warnings: string[] = [];

  const adj = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  for (const name of tableNames) {
    adj.set(name, new Set());
    inDegree.set(name, 0);
  }

  for (const table of schema.tables) {
    for (const field of table.fields) {
      const ref = field.references;
      if (!ref) {
        continue;
      }
      if (!nameSet.has(ref.table)) {
        warnings.push(
          `Field "${table.name}"."${field.name}" references unknown table "${ref.table}"; foreign key skipped.`,
        );
        continue;
      }
      if (ref.table === table.name) {
        warnings.push(
          `Self-referential FK on "${table.name}"."${field.name}"; foreign key skipped for ordering.`,
        );
        continue;
      }
      const deps = adj.get(ref.table);
      if (deps && !deps.has(table.name)) {
        deps.add(table.name);
        inDegree.set(table.name, (inDegree.get(table.name) ?? 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const name of tableNames) {
    if ((inDegree.get(name) ?? 0) === 0) {
      queue.push(name);
    }
  }
  queue.sort();

  const order: string[] = [];
  while (queue.length > 0) {
    const n = queue.shift()!;
    order.push(n);
    const outs = [...(adj.get(n) ?? [])].sort();
    for (const m of outs) {
      const d = (inDegree.get(m) ?? 0) - 1;
      inDegree.set(m, d);
      if (d === 0) {
        queue.push(m);
        queue.sort();
      }
    }
  }

  if (order.length !== tableNames.length) {
    warnings.push(
      'Circular or unresolved foreign-key dependencies detected; remaining tables are appended in stable name order.',
    );
    const remaining = tableNames.filter((n) => !order.includes(n)).sort();
    order.push(...remaining);
  }

  return { order, warnings };
}
