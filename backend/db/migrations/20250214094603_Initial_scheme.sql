SET default_toast_compression=lz4;

CREATE TYPE alphabet AS ENUM ('dna', 'rna', 'protein');

-- Initial scheme for the database in PostgreSQL
CREATE TABLE sequences (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  description TEXT,
  sequence TEXT NOT NULL,
  alphabet alphabet NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
