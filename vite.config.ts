import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/infraai-dx-assessment/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "InfraAI Field Assessment",
        short_name: "InfraAI Assess",
        description: "Offline-capable field assessment for construction operations & digital transformation blueprint.",
        theme_color: "#0B1220",
        background_color: "#0B1220",
        display: "standalone",
        scope: "/infraai-dx-assessment/",
        start_url: "/infraai-dx-assessment/",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
      }
    })
  ],
});
