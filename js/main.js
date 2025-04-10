/**
 * Portfolio Website
 * Main JavaScript functionality
 */

// ====================================================
// INITIALIZATION
// ====================================================

document.addEventListener("DOMContentLoaded", function() {
    // Initialize navigation
    setupSmoothScrolling();
    fixMobileNavigation();
    
    // Set up form validation
    setupFormValidation();
    
    // Setup animations and reveal effects
    revealOnScroll();
    setupScrollEvents();
    
    // Initialize dark/light mode
    initTheme();
  });
  
  // Initialize when window loads
  window.addEventListener("load", function() {
    handlePageLoad();
    
    // Re-run initialization after a short delay to catch any late-loading elements
    setTimeout(function() {
      revealAllElements();
      revealOnScroll();
      setupTimelineAnimations();
    }, 500);
  });
  
  // ====================================================
  // NAVIGATION & UI FUNCTIONALITY
  // ====================================================
  
  // Toggle the hamburger menu
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
  
  // Setup correct navbar display for mobile devices
  function fixMobileNavigation() {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 992 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Force correct display settings
      const desktopNav = document.getElementById("desktop-nav");
      const hamburgerNav = document.getElementById("hamburger-nav");
      
      if (desktopNav) {
        desktopNav.style.display = "none";
        desktopNav.style.visibility = "hidden";
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
  
  // Setup scroll event handling
  function setupScrollEvents() {
    window.addEventListener("scroll", function() {
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
      
      // Update timeline animations
      animateTimelineOnScroll();
    });
  }
  
  // Handle page loading
  function handlePageLoad() {
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
      }, 400);
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
  
  // Setup timeline animation
  function setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Initialize timeline items with active class based on visibility
    timelineItems.forEach((item) => {
      const itemPosition = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (itemPosition < windowHeight - 100) {
        item.classList.add('active');
      }
    });
  }
  
  // Animate timeline items on scroll
  function animateTimelineOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item) => {
      const itemPosition = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (itemPosition < windowHeight - 100) {
        item.classList.add('active');
      }
    });
  }
  
  // Reveal all elements (used when loading page or changing sections)
  function revealAllElements() {
    // Handle reveal elements
    const elements = document.querySelectorAll(".reveal-element");
    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-index", index % 5);
      element.classList.add("active");
    });
    
    // Initialize timeline items
    setupTimelineAnimations();
  }
  
  // ====================================================
  // FORM VALIDATION
  // ====================================================
  
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
          // Show loading state
          const submitBtn = this.querySelector('.submit-btn');
          const originalText = submitBtn.textContent;
          submitBtn.textContent = "Sending...";
          submitBtn.disabled = true;
          
          // Remove any existing success/error messages
          const existingMessages = form.querySelectorAll('.success-message, .error-message');
          existingMessages.forEach(msg => msg.remove());
          
          // Submit to Formspree
          fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              // Success - show message and reset form
              const successMessage = document.createElement("div");
              successMessage.className = "success-message";
              successMessage.textContent = "Message sent successfully! I'll get back to you soon.";
              form.appendChild(successMessage);
              
              // Reset form
              form.reset();
              
              // Set up removal after delay
              setTimeout(() => {
                successMessage.style.transition = "opacity 0.5s ease";
                successMessage.style.opacity = "0";
                
                setTimeout(() => {
                  if (successMessage.parentNode === form) {
                    successMessage.remove();
                  }
                }, 500);
              }, 5000);
            } else {
              // Error response from server
              const errorMessage = document.createElement("div");
              errorMessage.className = "error-message";
              errorMessage.textContent = "There was a problem sending your message. Please try again.";
              form.appendChild(errorMessage);
              
              setTimeout(() => {
                errorMessage.style.transition = "opacity 0.5s ease";
                errorMessage.style.opacity = "0";
                
                setTimeout(() => {
                  if (errorMessage.parentNode === form) {
                    errorMessage.remove();
                  }
                }, 500);
              }, 5000);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            
            // Network or other error
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.textContent = "Connection error. Please check your internet and try again.";
            form.appendChild(errorMessage);
            
            setTimeout(() => {
              errorMessage.style.transition = "opacity 0.5s ease";
              errorMessage.style.opacity = "0";
              
              setTimeout(() => {
                if (errorMessage.parentNode === form) {
                  errorMessage.remove();
                }
              }, 500);
            }, 5000);
          })
          .finally(() => {
            // Re-enable button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          });
        }
      });
    }
  }
  
  // Mark form field as invalid
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
  
  // Mark form field as valid
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
  
  // Validate email format
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // ====================================================
  // WINDOW RESIZE HANDLING
  // ====================================================
  
  // Handle window resizing
  let resizeTimer;
  window.addEventListener("resize", function() {
    // Clear existing timer
    clearTimeout(resizeTimer);
    
    // Debounce resize event
    resizeTimer = setTimeout(function() {
      // Fix mobile/desktop navigation
      fixMobileNavigation();
      
      // Re-initialize reveal elements
      revealOnScroll();
      
      // Update timeline animations
      setupTimelineAnimations();
    }, 250);
  });
  
  // ====================================================
  // DARK MODE FUNCTIONALITY
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
    
    // Set up dark mode toggle listeners
    setupDarkModeToggles();
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