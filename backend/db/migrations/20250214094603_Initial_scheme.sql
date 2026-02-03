SET default_toast_compression=lz4;

CREATE TYPE alphabet AS ENUM ('dna', 'rna', 'protein');

-- Initial scheme for the database in PostgreSQL
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE sequences (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id),
  identifier VARCHAR(255) NOT NULL,
  alphabet alphabet NOT NULL,
  description TEXT,
  sequence TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
