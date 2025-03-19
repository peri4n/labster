export type Alphabet = 'dna' | 'rna' | 'protein';

export type Sequence = {
  id: number;
  alphabet: string;
  identifier: string;
  description: string;
  sequence: string;
  created_at: Date;
}

