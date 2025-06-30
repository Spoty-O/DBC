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
