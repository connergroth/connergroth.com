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

// Enhanced Projects Section JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeProjectCards();

  // Re-initialize on resize for better responsiveness
  window.addEventListener("resize", function () {
    setTimeout(initializeProjectCards, 100);
  });
});

function initializeProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");
  const projectsContainer = document.querySelector(".projects-container");

  // Fix projects container layout
  if (projectsContainer) {
    // Adjust grid based on screen width
    if (window.innerWidth <= 576) {
      projectsContainer.style.gridTemplateColumns = "1fr";
    } else if (window.innerWidth <= 1200) {
      projectsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      projectsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
  }

  projectCards.forEach((card) => {
    // Add accessibility support
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `${
        card.querySelector(".project-title")?.textContent || "Project"
      } - View project details`
    );

    // Ensure all cards have consistent height
    standardizeProjectCard(card);

    // Add appropriate event handlers
    if ("ontouchstart" in window) {
      // Touch device behavior
      setupTouchBehavior(card);
    } else {
      // Desktop enhancements
      setupDesktopEnhancements(card);
    }
  });
}

function standardizeProjectCard(card) {
  // Ensure consistent styling for project cards
  const imgContainer = card.querySelector(".project-img-container");
  if (imgContainer) {
    imgContainer.style.height = "220px";
  }

  const content = card.querySelector(".project-content");
  if (content) {
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.flexGrow = "1";
  }

  const description = card.querySelector(".project-description");
  if (description) {
    description.style.display = "-webkit-box";
    description.style.webkitLineClamp = "3";
    description.style.webkitBoxOrient = "vertical";
    description.style.overflow = "hidden";
  }

  const btnContainer = card.querySelector(".project-btn-container");
  if (btnContainer) {
    btnContainer.style.marginTop = "auto";
  }

  // Handle disabled buttons
  const disabledBtns = card.querySelectorAll(".disabled-btn");
  disabledBtns.forEach((btn) => {
    btn.setAttribute("disabled", "true");
    btn.setAttribute("aria-disabled", "true");

    // Prevent click events on disabled buttons
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function setupTouchBehavior(card) {
  // For touch devices, add explicit tap indicators
  const overlay = card.querySelector(".project-overlay");
  if (overlay) {
    const viewProject = overlay.querySelector(".view-project");
    if (viewProject) {
      viewProject.textContent = "Tap to view";
    }
  }

  // Make it clear that buttons are interactive
  const buttons = card.querySelectorAll(".project-btn:not(.disabled-btn)");
  buttons.forEach((btn) => {
    btn.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.95)";
    });

    btn.addEventListener("touchend", function () {
      this.style.transform = "scale(1)";
    });
  });
}

function setupDesktopEnhancements(card) {
  // Add hover animations for desktop
  const img = card.querySelector(".project-img");
  if (img) {
    card.addEventListener("mouseenter", function () {
      img.style.transform = "scale(1.05)";
    });

    card.addEventListener("mouseleave", function () {
      img.style.transform = "scale(1)";
    });
  }

  // Add keyboard accessibility
  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      // Find the first non-disabled button and click it
      const firstButton = card.querySelector(".project-btn:not(.disabled-btn)");
      if (firstButton) {
        firstButton.click();
      }
    }
  });
}

// Function to handle screen reader announcements
function announceToScreenReader(message) {
  const announcement = document.getElementById("sr-announcement");

  if (!announcement) {
    const newAnnouncement = document.createElement("div");
    newAnnouncement.id = "sr-announcement";
    newAnnouncement.setAttribute("aria-live", "polite");
    newAnnouncement.style.position = "absolute";
    newAnnouncement.style.width = "1px";
    newAnnouncement.style.height = "1px";
    newAnnouncement.style.padding = "0";
    newAnnouncement.style.margin = "-1px";
    newAnnouncement.style.overflow = "hidden";
    newAnnouncement.style.clip = "rect(0, 0, 0, 0)";
    newAnnouncement.style.border = "0";
    document.body.appendChild(newAnnouncement);

    setTimeout(() => {
      newAnnouncement.textContent = message;
    }, 100);
  } else {
    announcement.textContent = message;
  }
}
