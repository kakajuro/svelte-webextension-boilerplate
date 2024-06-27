import fs from "fs";
import fsPromises from "fs/promises"
import util from "util";
import { rimraf, rimrafSync } from "rimraf"
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { zip } from "zip-a-folder";

// FIX NOT ZIPPING

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = util.promisify(execSync);

// Check whether to zip builds and output the result + whether to keep unzipped builds
let zipped = false;
let keep_unzipped = false;
let platforms = ["chrome", "firefox", "edge"];
let outputDir = path.join(__dirname, "builds");

for (let arg of process.argv) {
  
  if (arg === "--zip") {
    zipped = true;
  }

  if (arg === "--keepunzipped") {
    keep_unzipped = true;
  }
}

(keep_unzipped && !zipped) ? keep_unzipped = false : ""

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

  // Zip if required
  if (zipped) {
    console.log(`Attempting to zip: ${platform.toUpperCase()}...`);

    let inPath = path.join(__dirname, `/builds/${platform}_dist`);
    let outPath = path.join(__dirname, `/builds/${platform}_dist.zip`);

    zip(inPath, outPath)
    .then(() => console.log(`Sucessfully zipped ${platform.toUpperCase()}`))
    .then(() => {

      // Remove unzipped dist if specificed by script args
      if (!keep_unzipped) {
        try {
          rimrafSync(inPath);
          console.log("Removed unzipped file sucessfully");
        } catch (error) {
          console.error(`Error removing non-zipped ${build.toUpperCase()}`);
        }
        
      }

    })
    .catch(error => console.error(`An error occurred attempting to zip ${platform.toUpperCase()}: ${error}`))

  }

}

console.log("Building complete");
