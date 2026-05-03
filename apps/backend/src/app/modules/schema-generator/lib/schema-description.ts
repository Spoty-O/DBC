/** Expected JSON shape for repair prompts and initial system instructions. */
export const DATABASE_SCHEMA_JSON_DESCRIPTION = `Root object with a "tables" array (at least one table).
Each table has:
- "name": non-empty string, snake_case plural table name
- "fields": non-empty array of field objects

Each field has:
- "name": non-empty string, snake_case
- "type": one of "string" | "text" | "number" | "integer" | "boolean" | "date" | "datetime" | "uuid"
- "nullable": boolean
- "primary": boolean
- "unique": boolean
- "references": optional object { "table": string, "field": string } for foreign keys

Do not add extra top-level keys. Do not omit required field properties.`;
