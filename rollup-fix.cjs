// This script patches rollup to avoid the native addon issues
const fs = require("fs");
const path = require("path");

function patchRollup() {
  try {
    const nativePath = path.resolve("node_modules/rollup/dist/native.js");

    if (fs.existsSync(nativePath)) {
      let content = fs.readFileSync(nativePath, "utf8");

      // Check if already patched
      if (content.includes("function originalTryNative")) {
        console.log("Rollup already patched, skipping");
        return;
      }

      // Force use of JS implementation by completely replacing the tryNative function
      // This prevents any attempts to load platform-specific binaries
      content = content.replace(
        /function tryNative\(\) \{[\s\S]*?return.*?\}/,
        "function tryNative() { return null; }"
      );

      fs.writeFileSync(nativePath, content);
      console.log("Successfully patched rollup native.js");
    } else {
      console.log("Rollup native.js not found, skipping patch");
    }

    // Set environment variable
    process.env.ROLLUP_SKIP_NODEJS = "true";
  } catch (error) {
    console.error("Error patching rollup:", error);
    // Don't fail the build if patching fails
    process.exit(0);
  }
}

patchRollup();
