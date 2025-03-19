import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    tsconfigPaths()],
});
