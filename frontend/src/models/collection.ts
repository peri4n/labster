import type { Alphabet } from "./sequence";

export type Collection = {
  id: number;
  name: string;
  description: string;
  alphabet: Alphabet;
  created_at: Date;
  last_modified: Date;
};
