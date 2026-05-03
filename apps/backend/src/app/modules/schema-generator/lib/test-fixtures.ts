/** Minimal payload that satisfies manual + DatabaseSchemaSchema checks. */
export const VALID_MINIMAL_SCHEMA_JSON = JSON.stringify({
  tables: [
    {
      name: 'users',
      fields: [
        {
          name: 'id',
          type: 'uuid',
          nullable: false,
          primary: true,
          unique: false,
        },
      ],
    },
  ],
});
