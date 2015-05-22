-- Run 'psql -U myuser mydb' with appropriate user, db, and password on prompt
-- Run '\i path/to/schema.sql' to generate tables locally

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id  SERIAL ,
  organization_id INTEGER ,
  first_name TEXT NOT NULL ,
  middle_name TEXT ,
  last_name TEXT NOT NULL ,
  password_hash TEXT ,
  phone BIGINT,
  email TEXT NOT NULL UNIQUE,
  photo TEXT ,
  department TEXT ,
  title TEXT ,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS organizations CASCADE;
CREATE TABLE organizations (
  id  SERIAL ,
  admin_id INTEGER NOT NULL UNIQUE,
  default_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  logo TEXT ,
  welcome_message TEXT ,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (id)
);

ALTER TABLE users ADD FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE;
ALTER TABLE organizations ADD FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE RESTRICT;
ALTER TABLE organizations ADD FOREIGN KEY (default_id) REFERENCES users (id) ON DELETE RESTRICT;
