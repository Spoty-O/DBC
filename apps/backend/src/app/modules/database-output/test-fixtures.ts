import type { DatabaseSchema } from '../schema-generator/schemas/database-schema.type';

export const usersPostsSchema: DatabaseSchema = {
  tables: [
    {
      name: 'users',
      fields: [
        {
          name: 'id',
          type: 'uuid',
          nullable: false,
          primary: true,
          unique: true,
        },
        {
          name: 'email',
          type: 'string',
          nullable: false,
          primary: false,
          unique: true,
        },
        {
          name: 'age',
          type: 'integer',
          nullable: true,
          primary: false,
          unique: false,
        },
      ],
    },
    {
      name: 'posts',
      fields: [
        {
          name: 'id',
          type: 'uuid',
          nullable: false,
          primary: true,
          unique: true,
        },
        {
          name: 'user_id',
          type: 'uuid',
          nullable: false,
          primary: false,
          unique: false,
          references: { table: 'users', field: 'id' },
        },
      ],
    },
  ],
};
