import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

// check if process.env is BUILD ALL
// change build { outdir }, and build each plugin 
// then script to zip all the files

const target = process.env.TARGET || "chrome";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webExtension({
      browser: target,
      manifest: generateManifest,
      watchFilePaths: ["package.json", "manifest.json"],
      disableAutoLaunch: target === "chrome" ? false : true
    }),
  ],
  
});
