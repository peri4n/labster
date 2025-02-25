import type { Sequence } from '~/models/sequence';
import type { Route } from './+types/main';
import { SequenceListPage } from '~/routes/SequenceListPage';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Labster" },
    { name: "description", content: "Welcome to Labster!" },
  ];
}

export async function clientLoader(): Promise<Sequence[]> {
  const response = await fetch('http://localhost:3000/sequences')
  const result: Promise<Sequence[]> = response.json();
  return result;
}

export function Main({ loaderData }: Route.ComponentProps) {
  return (<SequenceListPage entries={loaderData} />);
}

export default Main
