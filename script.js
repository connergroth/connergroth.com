// Function to toggle the hamburger menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Page loading animation
window.addEventListener("load", function () {
  // Handle page loader
  const loader = document.querySelector(".loader-wrapper");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }

  // Initialize dark mode from localStorage
  initTheme();

  // Call initial animations
  animateOnScroll();
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
});

// Calculate the correct scroll offset based on navbar height
function getScrollOffset() {
  const navHeight = document.querySelector("nav").offsetHeight;
  return navHeight + 20; // Add some extra padding
}

// Enhanced smooth scrolling for a better user experience
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // Ignore empty anchors

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Highlight active nav item
        document.querySelectorAll(".nav-links a").forEach((a) => {
          a.classList.remove("active");
        });
        this.classList.add("active");

        // Calculate offset
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

  // Add active class to nav items based on scroll position
  function highlightNavOnScroll() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a, .menu-links a");
    const scrollPosition = window.scrollY;
    const offset = getScrollOffset();

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
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

  window.addEventListener("scroll", highlightNavOnScroll);

  // Initial highlight on page load
  setTimeout(highlightNavOnScroll, 100);
});

// Add scroll event for adding a shadow to the nav when scrolling
window.addEventListener("scroll", function () {
  const desktop = document.getElementById("desktop-nav");
  const hamburger = document.getElementById("hamburger-nav");

  updateScrollProgress();

  if (window.scrollY > 50) {
    if (desktop) desktop.classList.add("scrolled");
    if (hamburger) hamburger.classList.add("scrolled");
  } else {
    if (desktop) desktop.classList.remove("scrolled");
    if (hamburger) hamburger.classList.remove("scrolled");
  }
});

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

// Call animate on scroll when scrolling
window.addEventListener("scroll", animateOnScroll);

// Form validation for contact form
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
        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.textContent =
          "Message sent successfully! I'll get back to you soon.";
        form.appendChild(successMessage);

        // Reset form
        form.reset();

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    });
  }

  function markInvalid(field, message) {
    field.classList.add("invalid");
    const errorElement = field.nextElementSibling;

    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.textContent = message;
    } else {
      const error = document.createElement("div");
      error.className = "error-message";
      error.textContent = message;
      field.parentNode.insertBefore(error, field.nextSibling);
    }
  }

  function markValid(field) {
    field.classList.remove("invalid");
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.textContent = "";
    }
  }

  function isValidEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});
