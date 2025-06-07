import { ITableSchema } from '../interfaces';

export const userInputFixture = `
user has id type int primary key autoIncrement
user has email type varchar unique
user has is_active type boolean default true

post has id type int primary key autoIncrement
post has title type varchar
post has body type text not null
post has author_id type int foreign key references user(id)

comment has id type int primary key autoIncrement
comment has post_id type int foreign key references post(id)
comment has author_id type int foreign key references user(id)
comment has content type text not null`;

export const nlpResultFixture: ITableSchema[] = [
  {
    name: 'user',
    fields: [
      {
        name: 'id',
        type: 'INT',
        primaryKey: true,
        autoIncrement: true,
        nullable: true,
      },
      {
        name: 'email',
        type: 'VARCHAR',
        unique: true,
        nullable: true,
      },
      {
        name: 'is_active',
        type: 'BOOLEAN',
        defaultValue: `TRUE`,
        nullable: true,
      },
    ],
  },
  {
    name: 'post',
    fields: [
      {
        name: 'id',
        type: 'INT',
        primaryKey: true,
        autoIncrement: true,
        nullable: true,
      },
      {
        name: 'title',
        type: 'VARCHAR',
        nullable: true,
      },
      {
        name: 'body',
        type: 'TEXT',
        nullable: false,
      },
      {
        name: 'author_id',
        type: 'INT',
        foreignKey: { tableName: 'user', columnName: 'id' },
        nullable: true,
      },
    ],
  },
  {
    name: 'comment',
    fields: [
      {
        name: 'id',
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        nullable: true,
      },
      {
        name: 'post_id',
        type: 'int',
        foreignKey: { tableName: 'post', columnName: 'id' },
        nullable: true,
      },
      {
        name: 'author_id',
        type: 'int',
        foreignKey: { tableName: 'user', columnName: 'id' },
        nullable: true,
      },
      {
        name: 'content',
        type: 'text',
        nullable: false,
      },
    ],
  },
];

export const ddlRenderResultFixture = `CREATE TABLE user (
  id INT AUTO_INCREMENT,
  email VARCHAR UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id)
);

CREATE TABLE post (
  id INT AUTO_INCREMENT,
  title VARCHAR,
  body TEXT NOT NULL,
  author_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES user(id)
);

CREATE TABLE comment (
  id INT AUTO_INCREMENT,
  post_id INT,
  author_id INT,
  content TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES post(id),
  FOREIGN KEY (author_id) REFERENCES user(id)
);`;
