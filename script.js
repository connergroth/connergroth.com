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
