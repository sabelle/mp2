import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Required for GitHub Pages.
  // This must match the repository name.
  base: "/mp2/",
});