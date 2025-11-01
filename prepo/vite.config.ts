import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const ignoreKeepPlugin = () => ({
  name: "ignore-keep-files",
  load(id: string) {
    if (id.endsWith(".keep")) {
      return "export default \"\";";
    }
  },
});

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), ignoreKeepPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      // Map all latex.js CSS deep imports to real files (incl. with query like ?url)
      { find: /^latexjs\/css\//, replacement: path.resolve(__dirname, "node_modules/latex.js/dist/css/") + "/" },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".keep": "text",
      },
    },
  },
}));
