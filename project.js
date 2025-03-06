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
      // For desktop: use CSS hover by default (defined in CSS)
      // But also add keyboard accessibility
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

  // Ensure consistent heights for all cards
  standardizeCardHeights();
}

// Standardize card heights for consistent appearance
function standardizeCardHeights() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  // Reset heights first
  cards.forEach((card) => {
    // Set fixed height for all cards including featured
    if (window.innerWidth > 768) {
      card.style.height = "650px";
    } else {
      // On mobile, let cards adjust to content
      card.style.height = "auto";
      card.style.minHeight = window.innerWidth > 480 ? "600px" : "580px";
    }

    // Reset inner elements
    const inner = card.querySelector(".project-card-inner");
    const front = card.querySelector(".project-card-front");
    const back = card.querySelector(".project-card-back");
    const imgContainer = card.querySelector(".project-img-container");
    const btnContainer = card.querySelector(".project-btn-container");

    if (inner) inner.style.height = "100%";
    if (front) front.style.height = "100%";
    if (back) back.style.height = "100%";

    if (imgContainer) {
      if (window.innerWidth > 768) {
        imgContainer.style.height = "220px";
      } else if (window.innerWidth > 480) {
        imgContainer.style.height = "200px";
      } else {
        imgContainer.style.height = "180px";
      }
    }

    // Ensure proper spacing between description and highlights
    const descriptionP = card.querySelector(".project-description-full p");
    const highlights = card.querySelector(".project-highlights");

    if (descriptionP && highlights) {
      descriptionP.style.marginBottom = "1rem";
      highlights.style.marginTop = "1rem";
      highlights.style.marginBottom = "1rem";
    }

    // Optimize list item spacing
    const listItems = card.querySelectorAll(".project-highlights li");
    listItems.forEach((item) => {
      item.style.marginBottom = "0.2rem";
      item.style.lineHeight = "1.3";
    });

    // Ensure button container has proper spacing and all buttons are visible
    if (btnContainer) {
      btnContainer.style.marginTop = "1rem";
      btnContainer.style.marginBottom = "0";
      btnContainer.style.paddingTop = "0.75rem";

      // Make sure all buttons are visible
      const buttons = btnContainer.querySelectorAll(".project-btn");

      // Count the number of buttons
      const buttonCount = buttons.length;

      if (buttonCount > 0) {
        if (window.innerWidth <= 480) {
          // Stack buttons on very small screens
          btnContainer.style.flexDirection = "column";
          btnContainer.style.gap = "0.5rem";
          buttons.forEach((btn) => {
            btn.style.width = "100%";
            btn.style.margin = "0";
          });
        } else if (window.innerWidth <= 768) {
          // Optimize for 3 buttons on small screens
          btnContainer.style.flexDirection = "row";
          btnContainer.style.flexWrap = "wrap";
          btnContainer.style.gap = "0.5rem";
          buttons.forEach((btn) => {
            btn.style.flexBasis = "calc(33.33% - 0.4rem)";
            btn.style.fontSize = "0.7rem";
            btn.style.padding = "0.5rem 0.3rem";
            btn.style.margin = "0";

            // Make icons smaller on small screens
            const icon = btn.querySelector(".btn-icon");
            if (icon) {
              icon.style.width = "14px";
              icon.style.height = "14px";
              icon.style.marginRight = "3px";
            }
          });
        } else {
          // Default layout for larger screens
          btnContainer.style.flexDirection = "row";
          btnContainer.style.flexWrap = "wrap";
          btnContainer.style.gap = "0.5rem";
          buttons.forEach((btn) => {
            btn.style.flexBasis = "0";
            btn.style.flexGrow = "1";
            btn.style.fontSize = "0.8rem";
            btn.style.padding = "0.6rem 0.5rem";
            btn.style.margin = "0";

            // Restore icon size on larger screens
            const icon = btn.querySelector(".btn-icon");
            if (icon) {
              icon.style.width = "16px";
              icon.style.height = "16px";
              icon.style.marginRight = "5px";
            }
          });
        }
      }
    }
  });
}

// Call this function after DOM loads and after window load
document.addEventListener("DOMContentLoaded", initializeProjectCards);
window.addEventListener("load", initializeProjectCards);

// Also reinitialize on resize to handle orientation changes
window.addEventListener("resize", function () {
  setTimeout(initializeProjectCards, 200);
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
