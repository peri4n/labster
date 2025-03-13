CREATE TYPE alphabet AS ENUM ('dna', 'rna', 'protein');

-- Initial scheme for the database in PostgreSQL
CREATE TABLE SEQUENCES (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  sequence TEXT NOT NULL,
  alphabet alphabet NOT NULL
);
