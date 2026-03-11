import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, Router, RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { SnackbarProvider } from "util/snackbar-provider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function getRouter(queryClient: QueryClient) {
  return new Router({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    context: { queryClient },
  });
}

const theme = createTheme({
  components: {
    MuiTextField: { defaultProps: { variant: "outlined" } },
    MuiButton: { defaultProps: { variant: "outlined" } },
    MuiCard: { defaultProps: { variant: "outlined" } },
    MuiPaper: { defaultProps: { variant: "outlined" } },
    MuiChip: { defaultProps: { variant: "outlined" } },
    MuiAlert: { defaultProps: { variant: "outlined" } },
    MuiFormControl: { defaultProps: { variant: "outlined" } },
    MuiSelect: { defaultProps: { variant: "outlined" } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "& .MuiTableCell-root": {
            fontWeight: 700,
          },
        },
      },
    },
  },
});

export function App() {
  const queryClient = new QueryClient();

  const [router] = useState(() => getRouter(queryClient));

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
  );
}
