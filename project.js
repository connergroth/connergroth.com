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

  // Detect if device supports touch
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  projectCards.forEach((card) => {
    // Remove any existing listeners by cloning the card
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);

    // Set consistent heights
    setCardHeight(newCard);

    // For touch devices
    if (isTouchDevice) {
      // Add tap to flip
      newCard.addEventListener("click", function (e) {
        // Don't flip if clicking on a button or link
        if (e.target.closest("button") || e.target.closest("a")) {
          return;
        }

        this.classList.toggle("flipped");
      });

      // Add visual indicator for touch devices
      const imgContainer = newCard.querySelector(".project-img-container");
      if (imgContainer && !imgContainer.querySelector(".touch-hint")) {
        const touchHint = document.createElement("div");
        touchHint.className = "touch-hint";
        touchHint.textContent = "Tap to view details";
        imgContainer.appendChild(touchHint);
      }
    } else {
      // For desktop: use CSS hover

      // Also add keyboard accessibility
      newCard.setAttribute("tabindex", "0");
      newCard.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.classList.toggle("flipped");
        }
      });
    }

    // Handle buttons properly on both sides of card
    const buttons = newCard.querySelectorAll(".project-btn:not(.disabled-btn)");
    buttons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent card flip when clicking buttons
      });
    });

    // Handle disabled buttons
    const disabledBtns = newCard.querySelectorAll(".disabled-btn");
    disabledBtns.forEach((btn) => {
      btn.setAttribute("disabled", "true");
      btn.setAttribute("aria-disabled", "true");

      // Prevent click events on disabled buttons
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  });
}

function setCardHeight(card) {
  // Set height based on screen size
  if (window.innerWidth > 768) {
    card.style.height = "700px";

    // Set inner elements height
    const inner = card.querySelector(".project-card-inner");
    const front = card.querySelector(".project-card-front");
    const back = card.querySelector(".project-card-back");

    if (inner) inner.style.height = "100%";
    if (front) front.style.height = "100%";
    if (back) back.style.height = "100%";

    // Fix project image container height
    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) imgContainer.style.height = "240px";

    // Ensure proper spacing for content
    const content = card.querySelector(".project-content");
    if (content) {
      content.style.height = "calc(100% - 240px)";
      content.style.padding = "1.75rem";
    }

    // Fix project description height
    const descriptionElement = card.querySelector(".project-description");
    if (descriptionElement) {
      descriptionElement.style.minHeight = "100px";
    }

    // Fix button spacing
    const btnContainer = card.querySelector(".project-btn-container");
    if (btnContainer) {
      btnContainer.style.marginTop = "1.5rem";
      btnContainer.style.paddingTop = "1.25rem";
    }
  } else if (window.innerWidth <= 768 && window.innerWidth > 576) {
    // Tablet view
    card.style.height = "650px";

    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) imgContainer.style.height = "220px";

    const content = card.querySelector(".project-content");
    if (content) {
      content.style.height = "calc(100% - 220px)";
      content.style.padding = "1.5rem";
    }
  } else {
    // Mobile view
    card.style.height = "auto";
    card.style.minHeight = "600px";

    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) imgContainer.style.height = "200px";

    // For mobile, let content flow naturally
    const content = card.querySelector(".project-content");
    if (content) {
      content.style.height = "auto";
      content.style.padding = "1.25rem";
    }

    // Stack buttons on mobile
    const btnContainer = card.querySelector(".project-btn-container");
    if (btnContainer) {
      btnContainer.style.flexDirection = "column";
      btnContainer.style.gap = "0.5rem";
    }
  }
}

// Call this function after window loads to ensure proper initialization
window.addEventListener("load", initializeProjectCards);

// Also reinitialize on resize to handle orientation changes
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initializeProjectCards, 250);
});

// Ensure cards are properly initialized if projects are shown through tabs or navigation
document.querySelectorAll('a[href="#projects"]').forEach((link) => {
  link.addEventListener("click", function () {
    setTimeout(initializeProjectCards, 300);
  });
});

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