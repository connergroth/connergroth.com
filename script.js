// Function to toggle the hamburger menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Page loading animation
window.addEventListener("load", function () {
  // Handle page loader with smoother transition
  const loader = document.querySelector(".loader-wrapper");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";

        // Animate initial elements after loader disappears
        setTimeout(() => {
          document.querySelectorAll(".reveal-element").forEach((el, index) => {
            el.style.setProperty("--reveal-index", index % 5);
            setTimeout(() => {
              el.classList.add("active");
            }, 100);
          });
        }, 300);
      }, 500);
    }, 300); // Small delay for better perceived performance
  }

  // Initialize dark mode from localStorage
  initTheme();

  // Call initial animations
  revealOnScroll();
  highlightNavOnScroll();

  // Initialize project cards
  revealAllElements();

  // Initialize project cards with enhanced handling
  initializeProjectCards();

  // Setup project image animations
  setupProjectImageAnimations();

  // Setup mobile touch events
  setupMobileTouchEvents();
});

// Calculate the correct scroll offset based on navbar height
function getScrollOffset() {
  const navHeight = document.querySelector("nav").offsetHeight;
  return navHeight + 20; // Add some extra padding
}

// Add reveal-on-scroll animation
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal-element");

  reveals.forEach((element, index) => {
    // Set custom reveal index for staggered animations
    element.style.setProperty("--reveal-index", index % 5);

    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add("active");
    }
  });
}

// Unified function to reveal all elements including projects
function revealAllElements() {
  // Make sure projects container is visible and properly styled
  const projectsContainer = document.querySelector(".projects-container");
  if (projectsContainer) {
    projectsContainer.style.display = "grid";
    projectsContainer.style.visibility = "visible";
    projectsContainer.style.opacity = "1";
    projectsContainer.style.width = "100%";

    // Adjust grid template columns based on screen width
    if (window.innerWidth <= 600) {
      projectsContainer.style.gridTemplateColumns = "1fr";
    } else if (window.innerWidth <= 1200) {
      projectsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      projectsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }
  }

  // Initialize project cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    // Remove reveal class and ensure visibility
    card.classList.remove("reveal");
    card.classList.add("active");
    card.style.opacity = "1";
    card.style.transform = "none";
    card.style.visibility = "visible";
    card.style.display = "block";
    card.style.width = "100%";

    // Ensure card content is visible
    const content = card.querySelector(".project-content");
    if (content) {
      content.style.visibility = "visible";
      content.style.width = "100%";
    }

    // Make sure card inner is properly set up for hover
    const cardInner = card.querySelector(".project-card-inner");
    if (cardInner) {
      cardInner.style.visibility = "visible";
      cardInner.style.width = "100%";

      // Remove any click event listeners (we're using hover now)
      // No need to add click event listeners as we're using CSS hover
    }
  });

  // Handle other reveal elements
  const elements = document.querySelectorAll(".reveal-element");
  elements.forEach((element) => {
    element.classList.add("active");
  });
}

// Call revealAllElements immediately after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  revealAllElements();
});

// Also call it after a small delay to ensure everything is loaded
window.addEventListener("load", function () {
  setTimeout(revealAllElements, 500);

  // Also call on resize to adjust grid
  window.addEventListener("resize", function () {
    setTimeout(revealAllElements, 100);
  });
});

// Check for saved theme preference or set based on user preference
function initTheme() {
  const darkModeToggle = document.getElementById("checkbox");
  const darkModeToggleMobile = document.getElementById("checkbox-mobile");

  // Check if user has a preference saved
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) darkModeToggle.checked = true;
    if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
  } else {
    // If no preference, check system preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDarkMode) {
      document.body.classList.add("dark-mode");
      if (darkModeToggle) darkModeToggle.checked = true;
      if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
    }
  }
}

// Dark mode toggle handler
document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("checkbox");
  const darkModeToggleMobile = document.getElementById("checkbox-mobile");

  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        if (darkModeToggleMobile) darkModeToggleMobile.checked = false;
      }
    });
  }

  if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        if (darkModeToggle) darkModeToggle.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        if (darkModeToggle) darkModeToggle.checked = false;
      }
    });
  }

  // Also initialize projects on DOM load
  revealAllElements();
});

// Enhanced smooth scrolling for a better user experience
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        // For the logo, scroll to top with animation
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Highlight active nav item
        document
          .querySelectorAll(".nav-links a, .menu-links a")
          .forEach((a) => {
            a.classList.remove("active");
          });
        this.classList.add("active");

        // Calculate offset with improved positioning
        const offset = getScrollOffset();
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Close hamburger menu if open
        const menu = document.querySelector(".menu-links");
        if (menu && menu.classList.contains("open")) {
          toggleMenu();
        }
      }
    });
  });
});

// Enhanced scroll handling
window.addEventListener("scroll", function () {
  const desktop = document.getElementById("desktop-nav");
  const hamburger = document.getElementById("hamburger-nav");
  const scrollY = window.scrollY;

  // Update scroll progress
  updateScrollProgress();

  // Enhanced navbar transition
  if (scrollY > 50) {
    if (desktop) desktop.classList.add("scrolled");
    if (hamburger) hamburger.classList.add("scrolled");
  } else {
    if (desktop) desktop.classList.remove("scrolled");
    if (hamburger) hamburger.classList.remove("scrolled");
  }

  // Call reveal animation
  revealAllElements();

  // Highlight active nav section
  highlightNavOnScroll();
});

// Improved navigation highlighting
function highlightNavOnScroll() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a, .menu-links a");
  const scrollPosition = window.scrollY;
  const offset = getScrollOffset();

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - offset - 100; // Added extra offset for better UX
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Update scroll progress bar
function updateScrollProgress() {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}

// Add animation to skills sections
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".details-container");

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (elementPosition < screenPosition) {
      element.classList.add("fade-in");
    }
  });
};

// Form validation for contact form with enhanced feedback
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      let valid = true;

      if (!name.value.trim()) {
        markInvalid(name, "Name is required");
        valid = false;
      } else {
        markValid(name);
      }

      if (!email.value.trim()) {
        markInvalid(email, "Email is required");
        valid = false;
      } else if (!isValidEmail(email.value)) {
        markInvalid(email, "Please enter a valid email");
        valid = false;
      } else {
        markValid(email);
      }

      if (!message.value.trim()) {
        markInvalid(message, "Message is required");
        valid = false;
      } else {
        markValid(message);
      }

      if (valid) {
        // Show success message with animation
        const successMessage = document.createElement("div");
        successMessage.className = "success-message reveal-element";
        successMessage.textContent =
          "Message sent successfully! I'll get back to you soon.";
        form.appendChild(successMessage);

        // Trigger animation
        setTimeout(() => {
          successMessage.classList.add("active");
        }, 10);

        // Reset form with animation
        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          input.style.transition = "all 0.3s ease";
          input.style.opacity = "0";
          setTimeout(() => {
            input.value = "";
            input.style.opacity = "1";
          }, 300);
        });

        // Remove success message after 5 seconds with fade out
        setTimeout(() => {
          successMessage.style.opacity = "0";
          setTimeout(() => {
            successMessage.remove();
          }, 500);
        }, 5000);
      }
    });
  }
});

function markInvalid(field, message) {
  field.classList.add("invalid");
  const errorElement = field.nextElementSibling;

  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.textContent = message;
  } else {
    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = message;
    error.style.opacity = "0";
    field.parentNode.insertBefore(error, field.nextSibling);

    // Animate error message appearance
    setTimeout(() => {
      error.style.transition = "opacity 0.3s ease";
      error.style.opacity = "1";
    }, 10);
  }

  // Add shake animation to invalid field
  field.classList.add("shake");
  setTimeout(() => {
    field.classList.remove("shake");
  }, 500);
}

function markValid(field) {
  field.classList.remove("invalid");
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.style.opacity = "0";
    setTimeout(() => {
      errorElement.textContent = "";
    }, 300);
  }
}

function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Create animation for project images on hover
function setupProjectImageAnimations() {
  const projectImages = document.querySelectorAll(".project-img-container");
  projectImages.forEach((container) => {
    const img = container.querySelector(".project-img");
    if (!img) return;

    container.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.1)";
    });

    container.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });
  });
}

// Setup touch events for mobile devices
function setupMobileTouchEvents() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    let touchStartX = 0;
    let touchEndX = 0;
    const cardInner = card.querySelector(".project-card-inner");
    if (!cardInner) return;

    card.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    card.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > 50) {
          const currentTransform = cardInner.style.transform;
          cardInner.style.transform =
            swipeDistance > 0 ? "rotateY(0deg)" : "rotateY(180deg)";
        }
      },
      { passive: true }
    );
  });
}

// Enhanced project card handling for both desktop and mobile
document.addEventListener("DOMContentLoaded", function () {
  initializeProjectCards();

  // Re-initialize on resize to ensure proper layout
  window.addEventListener("resize", function () {
    setTimeout(initializeProjectCards, 100);
  });
});

function initializeProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  if (!projectCards.length) return;

  // Call standardizeHeights once for all cards
  standardizeHeights();

  projectCards.forEach((card) => {
    // Remove existing event listeners by cloning and replacing
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);

    // Check if device supports touch events
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      setupTouchBehavior(newCard);
    } else {
      setupDesktopEnhancements(newCard);
    }

    // Add keyboard accessibility
    newCard.setAttribute("tabindex", "0");
    newCard.setAttribute("role", "button");
    newCard.setAttribute(
      "aria-label",
      `Project: ${
        newCard.querySelector(".project-title")?.textContent || "Project"
      }`
    );

    // Add keyboard support for flipping
    newCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        newCard.classList.toggle("flipped");

        const isFlipped = newCard.classList.contains("flipped");
        const projectTitle =
          newCard.querySelector(".project-title")?.textContent || "Project";

        announceToScreenReader(
          isFlipped
            ? `Showing details for ${projectTitle}`
            : `Showing preview for ${projectTitle}`
        );
      }
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

  // Fix project container layout if it exists
  const projectsContainer = document.querySelector(".projects-container");
  if (projectsContainer) {
    fixProjectContainerLayout(projectsContainer);
  }
}

function fixProjectContainerLayout(container) {
  const updateLayout = () => {
    const width = window.innerWidth;

    if (width > 1200) {
      container.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else if (width > 768) {
      container.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      container.style.gridTemplateColumns = "1fr";
    }
  };

  // Initial update
  updateLayout();

  // Update on resize
  window.addEventListener("resize", updateLayout);
}

function standardizeHeights() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  // Reset heights first
  cards.forEach((card) => {
    // Set fixed height for all cards including featured
    card.style.height = "550px";

    // Reset inner elements
    const inner = card.querySelector(".project-card-inner");
    const front = card.querySelector(".project-card-front");
    const back = card.querySelector(".project-card-back");
    const imgContainer = card.querySelector(".project-img-container");
    const content = card.querySelector(".project-content");
    const techIcons = card.querySelector(".tech-icons-container");
    const meta = card.querySelector(".project-meta");

    if (inner) inner.style.height = "100%";
    if (front) front.style.height = "100%";
    if (back) back.style.height = "100%";
    if (imgContainer) imgContainer.style.height = "220px";
    if (content) content.style.padding = "1.25rem";

    // Don't set fixed height for description anymore
    // Let it adjust naturally based on content

    if (techIcons) techIcons.style.marginTop = "1rem";
    if (meta) meta.style.marginTop = "1rem";
  });

  // Check if we have a featured project and ensure it has the same height
  const featuredProject = document.querySelector(".featured-project");
  if (featuredProject) {
    featuredProject.style.height = "550px";
  }
}

function setupTouchBehavior(card) {
  // For touch devices, add tap to flip functionality
  card.addEventListener("click", function (e) {
    // Don't flip if clicking on a button or link
    if (e.target.closest("button") || e.target.closest("a")) {
      return;
    }

    // Toggle flipped class
    card.classList.toggle("flipped");

    // Announce to screen readers
    const isFlipped = card.classList.contains("flipped");
    const projectTitle =
      card.querySelector(".project-title")?.textContent || "Project";
    announceToScreenReader(
      `${projectTitle} card ${
        isFlipped ? "flipped to show details" : "flipped back to front"
      }`
    );
  });

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

      // Toggle flipped class
      card.classList.toggle("flipped");

      // Announce to screen readers
      const isFlipped = card.classList.contains("flipped");
      const projectTitle =
        card.querySelector(".project-title")?.textContent || "Project";
      announceToScreenReader(
        `${projectTitle} card ${
          isFlipped ? "flipped to show details" : "flipped back to front"
        }`
      );
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

/**
 * Project Card Fix for Mobile Devices and Mac
 */

document.addEventListener("DOMContentLoaded", function() {
  fixProjectCards();
  
  // Re-run on resize to handle orientation changes
  let resizeTimer;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fixProjectCards, 250);
  });
});

function fixProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");
  if (!projectCards.length) return;
  
  // Detect device type
  const isMobile = window.innerWidth <= 768;
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  projectCards.forEach(card => {
    // Reset card to ensure clean state
    resetCardState(card);
    
    // Fix card heights based on device
    setResponsiveCardHeight(card);
    
    // Fix the "click for info" prompt
    fixInfoPrompt(card, isMobile, isMac);
    
    // Setup appropriate flip behavior based on device
    if (isTouchDevice || isMobile) {
      setupTouchFlipBehavior(card);
    } else {
      setupHoverFlipBehavior(card);
    }
    
    // Ensure proper button behavior
    fixButtonBehavior(card);
    
    // Add accessibility
    addAccessibility(card);
  });
}

function resetCardState(card) {
  // Remove any existing event listeners by cloning and replacing
  const newCard = card.cloneNode(true);
  card.parentNode.replaceChild(newCard, card);
  
  // Remove any classes that might interfere
  newCard.classList.remove("flipped");
  
  return newCard;
}

function setResponsiveCardHeight(card) {
  // Set appropriate heights based on screen size
  if (window.innerWidth > 1200) {
    // Desktop
    card.style.height = "550px";
    
    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) imgContainer.style.height = "220px";
    
    const content = card.querySelector(".project-content");
    if (content) content.style.height = "calc(100% - 220px)";
  } 
  else if (window.innerWidth > 768) {
    // Tablet
    card.style.height = "500px";
    
    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) imgContainer.style.height = "200px";
    
    const content = card.querySelector(".project-content");
    if (content) content.style.height = "calc(100% - 200px)";
  } 
  else {
    // Mobile
    card.style.height = "auto";
    card.style.minHeight = "500px";
    
    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) imgContainer.style.height = "180px";
    
    const content = card.querySelector(".project-content");
    if (content) {
      content.style.height = "auto";
      content.style.minHeight = "calc(100% - 180px)";
    }
  }
  
  // Set consistent heights for the card inner, front, and back
  const inner = card.querySelector(".project-card-inner");
  const front = card.querySelector(".project-card-front");
  const back = card.querySelector(".project-card-back");
  
  if (inner) inner.style.height = "100%";
  if (front) front.style.height = "100%";
  if (back) back.style.height = "100%";
}

function fixInfoPrompt(card, isMobile, isMac) {
  // Remove any existing prompts
  const existingPrompts = card.querySelectorAll(".flip-prompt");
  existingPrompts.forEach(prompt => prompt.remove());
  
  // Create new info prompt
  const imgContainer = card.querySelector(".project-img-container");
  if (!imgContainer) return;
  
  // Clear any existing ::after content
  imgContainer.style.position = "relative";
  
  // Add a new prompt element instead of using ::after
  const prompt = document.createElement("div");
  prompt.className = "flip-prompt";
  prompt.textContent = isMobile ? "Tap for details" : "Hover for details";
  
  // Style the prompt
  prompt.style.position = "absolute";
  prompt.style.bottom = "15px";
  prompt.style.left = "50%";
  prompt.style.transform = "translateX(-50%)";
  prompt.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  prompt.style.color = "white";
  prompt.style.padding = "8px 15px";
  prompt.style.borderRadius = "20px";
  prompt.style.fontSize = "0.9rem";
  prompt.style.opacity = "0";
  prompt.style.transition = "opacity 0.3s ease";
  prompt.style.zIndex = "10";
  
  imgContainer.appendChild(prompt);
  
  // Show prompt on hover/touch for front card only
  card.addEventListener("mouseenter", function() {
    if (!card.classList.contains("flipped")) {
      prompt.style.opacity = "1";
    }
  });
  
  card.addEventListener("mouseleave", function() {
    prompt.style.opacity = "0";
  });
  
  // Special fix for Mac to ensure prompt doesn't appear on back of card
  if (isMac) {
    const cardInner = card.querySelector(".project-card-inner");
    if (cardInner) {
      cardInner.addEventListener("transitionstart", function() {
        prompt.style.opacity = "0";
      });
    }
  }
}

function setupTouchFlipBehavior(card) {
  card.addEventListener("click", function(e) {
    // Don't flip if clicking on a button or link
    if (e.target.closest("button") || e.target.closest("a")) {
      return;
    }
    
    // Toggle flipped class
    this.classList.toggle("flipped");
    
    // Hide prompt when flipped
    const prompt = this.querySelector(".flip-prompt");
    if (prompt) {
      prompt.style.opacity = "0";
    }
  });
  
  // Reset the opacity of the prompt when returning to front
  card.addEventListener("transitionend", function(e) {
    if (e.propertyName === "transform" && !this.classList.contains("flipped")) {
      const prompt = this.querySelector(".flip-prompt");
      if (prompt) {
        setTimeout(() => {
          if (!this.classList.contains("flipped")) {
            prompt.style.opacity = "1";
          }
        }, 300);
      }
    }
  });
}

function setupHoverFlipBehavior(card) {
  // For non-touch devices, use CSS hover
  // Add transition end handler to manage prompt
  card.addEventListener("transitionend", function(e) {
    if (e.propertyName === "transform") {
      const prompt = this.querySelector(".flip-prompt");
      if (prompt) {
        if (this.classList.contains("flipped")) {
          prompt.style.opacity = "0";
        } else {
          setTimeout(() => {
            if (!this.classList.contains("flipped") && this.matches(":hover")) {
              prompt.style.opacity = "1";
            }
          }, 100);
        }
      }
    }
  });
  
  // Fix hover state for inner card
  const cardInner = card.querySelector(".project-card-inner");
  if (cardInner) {
    // Use CSS hover state by default
    card.addEventListener("mouseenter", function() {
      cardInner.style.transform = "rotateY(180deg)";
      card.classList.add("flipped");
    });
    
    card.addEventListener("mouseleave", function() {
      cardInner.style.transform = "rotateY(0deg)";
      card.classList.remove("flipped");
    });
  }
}

function fixButtonBehavior(card) {
  // Ensure buttons don't trigger card flip
  const buttons = card.querySelectorAll(".project-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
    });
    
    // Add enhanced hover effect
    btn.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
    });
    
    btn.addEventListener("mouseleave", function() {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  });
  
  // Prevent default action for disabled buttons
  const disabledButtons = card.querySelectorAll(".disabled-btn");
  disabledButtons.forEach(btn => {
    btn.setAttribute("disabled", "true");
    btn.setAttribute("aria-disabled", "true");
    
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function addAccessibility(card) {
  // Make cards keyboard accessible
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  
  const projectTitle = card.querySelector(".project-title")?.textContent || "Project";
  card.setAttribute("aria-label", `Project: ${projectTitle}. Press Enter to view details.`);
  
  // Add keyboard support
  card.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.classList.toggle("flipped");
      
      const cardInner = this.querySelector(".project-card-inner");
      if (cardInner) {
        cardInner.style.transform = this.classList.contains("flipped") ? 
                                    "rotateY(180deg)" : "rotateY(0deg)";
      }
      
      // Announce to assistive technology
      const isFlipped = this.classList.contains("flipped");
      announceToScreenReader(
        `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
      );
    }
  });
}

// Screen reader announcement helper
function announceToScreenReader(message) {
  let announcement = document.getElementById("sr-announcement");
  
  if (!announcement) {
    announcement = document.createElement("div");
    announcement.id = "sr-announcement";
    announcement.setAttribute("aria-live", "polite");
    announcement.className = "sr-only";
    
    // Style to hide visually but keep available to screen readers
    announcement.style.position = "absolute";
    announcement.style.width = "1px";
    announcement.style.height = "1px";
    announcement.style.padding = "0";
    announcement.style.margin = "-1px";
    announcement.style.overflow = "hidden";
    announcement.style.clip = "rect(0, 0, 0, 0)";
    announcement.style.whiteSpace = "nowrap";
    announcement.style.border = "0";
    
    document.body.appendChild(announcement);
  }
  
  // Set the message after a brief delay to ensure it's announced
  setTimeout(() => {
    announcement.textContent = message;
  }, 100);
}

// Run the fix on page load and after a short delay to ensure everything is loaded
window.addEventListener("load", function() {
  fixProjectCards();
  
  // Run again after a short delay for any lazy-loaded content
  setTimeout(fixProjectCards, 500);
});

// Call the fix function when DOM is loaded
document.addEventListener("DOMContentLoaded", fixProjectCards);

// Also call after page load to ensure all elements are properly loaded
window.addEventListener("load", function() {
  setTimeout(fixProjectCards, 500);
});