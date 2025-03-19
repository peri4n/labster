import { Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

function WelcomePage() {
  return (<Typography>foo</Typography>);
}

export const Route = createFileRoute('/')({
  component: WelcomePage,
})
