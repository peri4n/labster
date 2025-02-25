import type { Route } from './+types/main';
import { Typography } from '@mui/material';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Labster" },
    { name: "description", content: "Welcome to Labster!" },
  ];
}

export function WelcomePage({ loaderData }: Route.ComponentProps) {
  return (<Typography>foo</Typography>);
}

export default WelcomePage
