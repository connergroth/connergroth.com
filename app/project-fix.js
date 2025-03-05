// This file is kept for backward compatibility
// The main functionality has been moved to script.js

document.addEventListener("DOMContentLoaded", function () {
  // This will be handled by the new code in script.js
  // Just in case this file is loaded first, we'll call the new function
  if (typeof initializeProjectCards === "function") {
    initializeProjectCards();
  }
});

window.addEventListener("load", function () {
  setTimeout(function () {
    if (typeof initializeProjectCards === "function") {
      initializeProjectCards();
    }
  }, 500);
});

window.addEventListener("resize", function () {
  setTimeout(function () {
    if (typeof initializeProjectCards === "function") {
      initializeProjectCards();
    }
  }, 100);
});

// Redirect any calls to the old function to the new one
function fixProjectCards() {
  if (typeof initializeProjectCards === "function") {
    initializeProjectCards();
  }
}

// Redirect any calls to the old function to the new one
function addTouchSupport() {
  // This functionality is now handled in script.js
}
