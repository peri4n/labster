import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { darkTeal, ghostWhite, silver, paleSlate, frostedBlue } from './theme/palette';
import { useState } from 'react';
import { Router } from '@tanstack/react-router';
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { SnackbarProvider } from "util/snackbar-provider";

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function getRouter(queryClient: QueryClient) {
  return new Router({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    context: { queryClient }
  });
}

const theme = createTheme({
  palette: {
    primary: {
      main: darkTeal,
      contrastText: '#ffffff',
    },
    secondary: {
      main: frostedBlue,
      contrastText: '#074f57',
    },
    info: {
      main: ghostWhite,
      contrastText: '#074f57',
    },
    background: {
      default: ghostWhite,
      paper: '#ffffff',
    },
    text: {
      primary: darkTeal,
      secondary: paleSlate,
    },
    divider: silver,
    darkTeal,
    ghostWhite,
    silver,
    paleSlate,
    frostedBlue,
  },
});

export function App() {
  const queryClient = new QueryClient();

  const [router] = useState(() => getRouter(queryClient))

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <TanStackRouterDevtools router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
};
