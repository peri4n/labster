import "./app.css";
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";

import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

const drawerWidth = 180;

function RootComponent() {
  return (
    <Box sx={{ display: 'flex' }}>
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Link to="/">
              <ListItem key="Home" disablePadding>
                <ListItemButton disableRipple>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/sequences">
              <ListItem key="Sequences" disablePadding>
                <ListItemButton disableRipple>
                  <ListItemText primary="Sequences" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
