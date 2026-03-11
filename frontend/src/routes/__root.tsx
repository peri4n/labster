import "./app.css";
import {
  BarChart,
  Biotech,
  ChangeHistory,
  Collections,
  CompareArrows,
  FileDownload,
  FileUpload,
  Home,
  ManageSearch,
  Science,
  Summarize,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

const drawerWidth = 220;

const createMenuItem = (text: string, icon: React.ReactNode, to: string) => (
  <Link to={to}>
    <ListItem key={text} disablePadding>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  </Link>
);

function RootComponent() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Labster
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", pt: 1 }}>
          <List dense>
            {createMenuItem("Home", <Home color="primary" />, "/")}

            <Divider sx={{ mx: 2, my: 1 }} />

            {createMenuItem("Sequences", <Biotech color="primary" />, "/sequences")}
            {createMenuItem("Collections", <Collections color="primary" />, "/collections")}
            {createMenuItem("Annotations", <Summarize color="primary" />, "/annotations")}
            {createMenuItem("Primers", <Science color="primary" />, "/primers")}
            {createMenuItem("Plasmids", <ChangeHistory color="primary" />, "/plasmids")}

            <Divider sx={{ mx: 2, my: 1 }} />

            {createMenuItem("Alignment", <CompareArrows color="primary" />, "/alignment")}
            {createMenuItem("Search", <ManageSearch color="primary" />, "/search")}
            {createMenuItem("Statistics", <BarChart color="primary" />, "/statistics")}

            <Divider sx={{ mx: 2, my: 1 }} />

            {createMenuItem("Import", <FileUpload color="primary" />, "/import")}
            {createMenuItem("Export", <FileDownload color="primary" />, "/export")}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
