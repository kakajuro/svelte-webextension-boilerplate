import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

import path from "path";

const target = process.env.TARGET || "chrome";
const customOutputDir = process.env.OUTPUT;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webExtension({
      browser: target,
      manifest: `manifests/${target.toLowerCase()}.manifest.json`,
      watchFilePaths: ["package.json", "manifest.json"],
      //disableAutoLaunch: target === "chrome" ? false : true
    }),
  ],
  build: {
    outDir: customOutputDir ? path.join(customOutputDir, `${target.toLowerCase()}_dist`) : "dist"
  }
});
