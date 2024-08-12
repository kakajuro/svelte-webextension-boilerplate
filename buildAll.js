import fs from "fs";
import util from "util";
import { rimrafSync } from "rimraf"
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = util.promisify(execSync);

let platforms = ["chrome", "firefox", "edge"];
let outputDir = path.join(__dirname, "builds");

// Create builds folder or empty the existing builds
if (fs.existsSync(outputDir)) {
  try {
    rimrafSync(outputDir);
    console.log("Removed existing output directory sucessfully");
  } catch (error) {
    console.error("Error removing existing output directory: ${error}")
  }
}

fs.mkdirSync(outputDir);
console.log("Created output dir");

// Build all platforms
for (let platform of platforms) {

  console.log(`Building for ${platform.toUpperCase()}...`);

  execPromise(`cross-env TARGET=${platform} OUTPUT=${outputDir} vite build`)
  .then(() => console.log(`Built for ${platform.toUpperCase()} sucessfully!`))
  .catch(error => console.error(`Error building for ${platform.toUpperCase()}: ${error}`))

  console.log(`Built for ${platform.toUpperCase()} sucessfully!`);

}

console.log("Building complete");
