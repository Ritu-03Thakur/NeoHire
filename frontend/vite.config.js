import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://neohire-backend.onrender.com/, //localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf",
    },
  },
  optimizeDeps: {
    include: ["pdfjs-dist/legacy/build/pdf"],
  },
});
