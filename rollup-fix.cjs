// This script patches rollup to avoid the native addon issues
const fs = require("fs");
const path = require("path");

try {
  const nativePath = path.resolve("node_modules/rollup/dist/native.js");

  if (fs.existsSync(nativePath)) {
    let content = fs.readFileSync(nativePath, "utf8");

    // Force use of JS implementation by always returning null for native addon
    content = content.replace(
      "function tryNative",
      "function tryNative() { return null; }\n\nfunction originalTryNative"
    );

    fs.writeFileSync(nativePath, content);
    console.log("Successfully patched rollup native.js");
  } else {
    console.log("Rollup native.js not found, skipping patch");
  }
} catch (error) {
  console.error("Error patching rollup:", error);
}
