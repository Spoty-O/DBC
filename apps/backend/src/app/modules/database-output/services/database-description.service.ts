import { Injectable } from '@nestjs/common';
import type { DatabaseSchema } from '../../schema-generator/schemas/database-schema.type';

@Injectable()
export class DatabaseDescriptionService {
  /**
   * Short (1–3 sentences) technical summary: entities created and relationship cardinality.
   */
  describeBrief(schema: DatabaseSchema): string {
    const sorted = [...schema.tables].sort((a, b) => a.name.localeCompare(b.name));
    const tableNames = sorted.map((t) => t.name);
    const n = tableNames.length;
    const list =
      tableNames.length <= 6
        ? tableNames.join(', ')
        : `${tableNames.slice(0, 5).join(', ')}, and ${n - 5} more`;

    let fk = 0;
    let selfRef = 0;
    for (const t of schema.tables) {
      for (const f of t.fields) {
        if (f.references) {
          fk++;
          if (f.references.table === t.name) {
            selfRef++;
          }
        }
      }
    }

    const s1 = `Generated ${n} table(s): ${list}.`;

    if (fk === 0) {
      return `${s1} No foreign keys were declared, so there are no cross-table referential constraints in this output.`;
    }

    let s2 = `Declared ${fk} foreign key(s). Each is modeled as many-to-one from the referencing row toward the parent row (relational 1:N on the referencing side).`;
    if (selfRef > 0) {
      s2 += ` ${selfRef} of these reference(s) are self-referential on the same table.`;
    }

    const manyToManyHint = detectLikelyJoinTables(sorted)
      ? ' Some tables may act as implicit link tables for many-to-many associations if the schema encodes them that way.'
      : '';

    return limitSentences(`${s1} ${s2}${manyToManyHint}`.trim(), 3);
  }
}

function limitSentences(text: string, max: number): string {
  const raw = text.split(/(?<=[.!?])\s+/).filter((p) => p.length > 0);
  return raw.slice(0, max).join(' ').trim();
}

function detectLikelyJoinTables(
  sorted: { name: string; fields: { references?: { table: string } }[] }[],
): boolean {
  for (const t of sorted) {
    const fkTargets = new Set(
      t.fields.map((f) => f.references?.table).filter(Boolean) as string[],
    );
    if (fkTargets.size >= 2) {
      return true;
    }
  }
  return false;
}
