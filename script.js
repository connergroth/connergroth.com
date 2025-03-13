/**
 * Conner Groth Portfolio Website
 * Main JavaScript file
 */

// ====================================================
// NAVIGATION & UI FUNCTIONALITY
// ====================================================

// Toggle the hamburger menu with improved mobile handling
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
  
  // Toggle body scrolling when menu is open
  if (menu.classList.contains("open")) {
    document.body.classList.add("menu-open");
    // Add specific iOS fix for scrolling
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
  } else {
    document.body.classList.remove("menu-open");
    // Remove iOS specific fix
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }
}

// Ensure correct navbar display for mobile devices
function fixMobileNavigation() {
  // Check if we're on a mobile device
  const isMobile = window.innerWidth <= 1200 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Force correct display settings
    const desktopNav = document.getElementById("desktop-nav");
    const hamburgerNav = document.getElementById("hamburger-nav");
    
    if (desktopNav) {
      desktopNav.style.display = "none";
      desktopNav.style.visibility = "hidden";
      desktopNav.style.height = "0";
      desktopNav.style.overflow = "hidden";
    }
    
    if (hamburgerNav) {
      hamburgerNav.style.display = "flex";
      hamburgerNav.style.visibility = "visible";
    }
  }
}

// Calculate the correct scroll offset based on navbar height
function getScrollOffset() {
  const navHeight = document.querySelector("nav").offsetHeight;
  return navHeight + 20; // Add some extra padding
}

// Update scroll progress bar
function updateScrollProgress() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}

// Highlight active navigation section based on scroll position
function highlightNavOnScroll() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a, .menu-links a");
  const scrollPosition = window.scrollY;
  const offset = getScrollOffset();

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - offset - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Set up smooth scrolling for anchor links
function setupSmoothScrolling() {
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
        document.querySelectorAll(".nav-links a, .menu-links a").forEach((a) => {
          a.classList.remove("active");
        });
        this.classList.add("active");

        // Calculate offset with improved positioning
        const offset = getScrollOffset();
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
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
}

// ====================================================
// DARK MODE & THEME FUNCTIONALITY
// ====================================================

// Initialize theme based on saved preference or system preference
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
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDarkMode) {
      document.body.classList.add("dark-mode");
      if (darkModeToggle) darkModeToggle.checked = true;
      if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
    }
  }
}

// Setup dark mode toggle handlers
function setupDarkModeToggles() {
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
}

// ====================================================
// ANIMATION & REVEAL EFFECTS
// ====================================================

// Animate elements on scroll with custom reveal effect
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

// Reveal all elements (used when loading page or changing sections)
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

    // Make sure card inner is properly set up for hover/touch
    const cardInner = card.querySelector(".project-card-inner");
    if (cardInner) {
      cardInner.style.visibility = "visible";
      cardInner.style.width = "100%";
    }
  });

  // Handle other reveal elements
  const elements = document.querySelectorAll(".reveal-element");
  elements.forEach((element) => {
    element.classList.add("active");
  });
}

// ====================================================
// PROJECT CARDS FUNCTIONALITY
// ====================================================

// Setup image animations for project cards
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

// Fix project cards for all devices
function fixProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");
  if (!projectCards.length) return;
  
  // Detect device type
  const isMobile = window.innerWidth <= 768;
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Store button information before modifying cards
  const buttonData = [];
  projectCards.forEach(card => {
    const buttons = card.querySelectorAll(".project-btn");
    const cardData = { 
      cardIndex: Array.from(projectCards).indexOf(card),
      buttons: []
    };
    
    buttons.forEach(btn => {
      const onclickAttr = btn.getAttribute("onclick");
      if (onclickAttr) {
        const urlMatch = onclickAttr.match(/location\.href=[\'\"](.+?)[\'\"]/);
        if (urlMatch && urlMatch[1]) {
          cardData.buttons.push({
            buttonIndex: Array.from(buttons).indexOf(btn),
            url: urlMatch[1]
          });
        }
      }
    });
    
    buttonData.push(cardData);
  });
  
  projectCards.forEach((card, cardIndex) => {
    // Reset card to ensure clean state
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    
    // Remove any classes that might interfere
    newCard.classList.remove("flipped");
    
    // Set appropriate heights based on screen size
    if (window.innerWidth > 1200) {
      // Desktop
      newCard.style.height = "550px";
      
      const imgContainer = newCard.querySelector(".project-img-container");
      if (imgContainer) imgContainer.style.height = "220px";
      
      const content = newCard.querySelector(".project-content");
      if (content) content.style.height = "calc(100% - 220px)";
    } 
    else if (window.innerWidth > 768) {
      // Tablet
      newCard.style.height = "500px";
      
      const imgContainer = newCard.querySelector(".project-img-container");
      if (imgContainer) imgContainer.style.height = "200px";
      
      const content = newCard.querySelector(".project-content");
      if (content) content.style.height = "calc(100% - 200px)";
    } 
    else {
      // Mobile
      newCard.style.height = "auto";
      newCard.style.minHeight = "500px";
      
      const imgContainer = newCard.querySelector(".project-img-container");
      if (imgContainer) imgContainer.style.height = "180px";
      
      const content = newCard.querySelector(".project-content");
      if (content) {
        content.style.height = "auto";
        content.style.minHeight = "calc(100% - 180px)";
      }
    }
    
    // Set consistent heights for the card inner, front, and back
    const inner = newCard.querySelector(".project-card-inner");
    const front = newCard.querySelector(".project-card-front");
    const back = newCard.querySelector(".project-card-back");
    
    if (inner) inner.style.height = "100%";
    if (front) front.style.height = "100%";
    if (back) back.style.height = "100%";
    
    // Create flip prompt for user guidance
    const imgContainer = newCard.querySelector(".project-img-container");
    if (imgContainer) {
      // Clear any existing prompts
      const existingPrompts = imgContainer.querySelectorAll(".flip-prompt");
      existingPrompts.forEach(prompt => prompt.remove());
      
      imgContainer.style.position = "relative";
      
      // Add a new prompt element
      const prompt = document.createElement("div");
      prompt.className = "flip-prompt";
      prompt.textContent = isTouchDevice || isMobile ? "Tap for details" : "Hover for details";
      
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
      
      // Show prompt on hover/touch
      newCard.addEventListener("mouseenter", function() {
        if (!this.classList.contains("flipped")) {
          prompt.style.opacity = "1";
        }
      });
      
      newCard.addEventListener("mouseleave", function() {
        prompt.style.opacity = "0";
      });
    }
    
    // Setup proper flip behavior based on device
    if (isTouchDevice || isMobile) {
      // For touch devices
      newCard.addEventListener("click", function(e) {
        // Don't flip if clicking on a button or link
        if (e.target.closest("button") || e.target.closest("a")) {
          return;
        }
        
        // Toggle flipped class
        this.classList.toggle("flipped");
        
        // Manage the inner transform
        const cardInner = this.querySelector(".project-card-inner");
        if (cardInner) {
          cardInner.style.transform = this.classList.contains("flipped") ? 
                                     "rotateY(180deg)" : "rotateY(0deg)";
        }
        
        // Hide prompt when flipped
        const prompt = this.querySelector(".flip-prompt");
        if (prompt) {
          prompt.style.opacity = "0";
        }
        
        // Announce to screen readers
        const isFlipped = this.classList.contains("flipped");
        const projectTitle = this.querySelector(".project-title")?.textContent || "Project";
        announceToScreenReader(
          `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
        );
      });
    } else {
      // For desktop: use hover
      const cardInner = newCard.querySelector(".project-card-inner");
      if (cardInner) {
        newCard.addEventListener("mouseenter", function() {
          cardInner.style.transform = "rotateY(180deg)";
          this.classList.add("flipped");
        });
        
        newCard.addEventListener("mouseleave", function() {
          cardInner.style.transform = "rotateY(0deg)";
          this.classList.remove("flipped");
        });
      }
    }
    
    // Ensure buttons don't trigger card flip and restore URLs
    const buttons = newCard.querySelectorAll(".project-btn");
    
    // First, reapply saved URLs from buttonData
    const cardData = buttonData[cardIndex];
    if (cardData && cardData.buttons.length > 0) {
      cardData.buttons.forEach(btnData => {
        if (btnData.buttonIndex < buttons.length) {
          const btn = buttons[btnData.buttonIndex];
          
          // Remove any existing onclick attribute
          btn.removeAttribute("onclick");
          
          // Add proper event listener for redirection
          btn.addEventListener("click", function(e) {
            e.stopPropagation();
            window.location.href = btnData.url;
          });
        }
      });
    }
    
    // Add common button behaviors
    buttons.forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
      });
      
      // Add hover effect
      btn.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-3px)";
        this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
      });
      
      btn.addEventListener("mouseleave", function() {
        this.style.transform = "";
        this.style.boxShadow = "";
      });
    });
    
    // Handle disabled buttons
    const disabledButtons = newCard.querySelectorAll(".disabled-btn");
    disabledButtons.forEach(btn => {
      btn.setAttribute("disabled", "true");
      btn.setAttribute("aria-disabled", "true");
      
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    // Add keyboard accessibility
    newCard.setAttribute("tabindex", "0");
    newCard.setAttribute("role", "button");
    
    const projectTitle = newCard.querySelector(".project-title")?.textContent || "Project";
    newCard.setAttribute("aria-label", `Project: ${projectTitle}. Press Enter to view details.`);
    
    newCard.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.classList.toggle("flipped");
        
        const cardInner = this.querySelector(".project-card-inner");
        if (cardInner) {
          cardInner.style.transform = this.classList.contains("flipped") ? 
                                     "rotateY(180deg)" : "rotateY(0deg)";
        }
        
        // Announce to screen readers
        const isFlipped = this.classList.contains("flipped");
        announceToScreenReader(
          `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
        );
      }
    });
  });

  // Fix project container layout
  const projectsContainer = document.querySelector(".projects-container");
  if (projectsContainer) {
    const width = window.innerWidth;
    if (width > 1200) {
      projectsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else if (width > 768) {
      projectsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      projectsContainer.style.gridTemplateColumns = "1fr";
    }
  }
}

// ====================================================
// FORM VALIDATION
// ====================================================

// Validate form fields
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
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Set up form validation
function setupFormValidation() {
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
        successMessage.textContent = "Message sent successfully! I'll get back to you soon.";
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
}

// ====================================================
// EVENT LISTENERS & INITIALIZATION
// ====================================================

// Handle page loading
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
    }, 300);
  }

  // Initialize theme
  initTheme();

  // Call initial animations
  revealOnScroll();
  highlightNavOnScroll();
  revealAllElements();

  // Initialize project cards
  fixProjectCards();

  // Setup project image animations
  setupProjectImageAnimations();
  
  // Fix mobile navigation
  fixMobileNavigation();
});

// Handle DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize navigation
  setupSmoothScrolling();
  fixMobileNavigation();
  
  // Set up dark mode toggles
  setupDarkModeToggles();
  
  // Initialize form validation
  setupFormValidation();
  
  // Reveal elements
  revealAllElements();
  
  // Fix project cards
  fixProjectCards();
  
  // Make sure menu closes when a link is clicked
  const menuLinks = document.querySelectorAll(".menu-links a");
  menuLinks.forEach(link => {
    link.addEventListener("click", function() {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        icon.classList.remove("open");
        document.body.classList.remove("menu-open");
        
        // Remove iOS specific fix
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          document.body.style.position = "";
          document.body.style.width = "";
        }
      }
    });
  });
});

// Handle scrolling
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
  revealOnScroll();

  // Highlight active nav section
  highlightNavOnScroll();
});

// Handle window resizing
window.addEventListener("resize", function() {
  // Re-initialize on resize for better responsiveness
  fixMobileNavigation();
  
  // Debounce resize events
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(function() {
    fixProjectCards();
    revealAllElements();
  }, 250);
});