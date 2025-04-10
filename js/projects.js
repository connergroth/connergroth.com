/**
 * Enhanced Project Cards Functionality
 * Handles project card behavior, animations, and interactions
 * with improved mobile and accessibility support
 */

document.addEventListener("DOMContentLoaded", function() {
    // Initialize project cards when page loads
    initializeProjectCards();
    
    // Re-initialize on window resize with debounce
    let resizeTimer;
    window.addEventListener("resize", function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initializeProjectCards, 250);
    });
    
    // Create screen reader announcement element (for accessibility)
    createScreenReaderAnnouncer();
  });
  
  /**
   * Screen reader helper for accessibility
   */
  function createScreenReaderAnnouncer() {
    if (!document.getElementById("sr-announcer")) {
      const announcer = document.createElement("div");
      announcer.id = "sr-announcer";
      announcer.className = "sr-only";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      document.body.appendChild(announcer);
    }
  }
  
  function announceToScreenReader(message) {
    const announcer = document.getElementById("sr-announcer");
    if (announcer) {
      announcer.textContent = message;
    }
  }
  
  /**
   * Initialize all project cards with proper functionality
   */
  function initializeProjectCards() {
    const projectCards = document.querySelectorAll(".project-card");
    if (!projectCards.length) return;
    
    // Detect if device supports touch
    const isTouchDevice = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      navigator.msMaxTouchPoints > 0;
    
    // Process all cards
    projectCards.forEach(card => {
      // Reset any existing classes or styles
      card.classList.remove("initialized");
      
      // Set consistent heights
      setCardHeight(card);
      
      // Setup different behaviors based on device type
      if (isTouchDevice) {
        setupTouchBehavior(card);
      } else {
        setupDesktopBehavior(card);
      }
      
      // Setup buttons
      setupButtons(card);
      
      // Add keyboard accessibility
      addKeyboardAccessibility(card);
      
      // Mark card as initialized
      card.classList.add("initialized");
    });
  }
  
  /**
   * Set appropriate heights for card components
   * Now uses auto height approach for better content fitting
   */
  function setCardHeight(card) {
    // Get dimensions based on screen size
    let imgHeight;
    
    if (window.innerWidth > 992) {
      // Desktop
      imgHeight = "200px";
    } else if (window.innerWidth > 768) {
      // Tablet
      imgHeight = "180px";
    } else if (window.innerWidth > 576) {
      // Mobile
      imgHeight = "180px";
    } else {
      // Small mobile
      imgHeight = "160px";
    }
    
    // Apply auto height with min-height for better content fitting
    card.style.height = "auto";
    
    // Use different min-heights based on screen size
    if (window.innerWidth > 992) {
      card.style.minHeight = "550px";
    } else if (window.innerWidth > 768) {
      card.style.minHeight = "520px";
    } else if (window.innerWidth > 576) {
      card.style.minHeight = "500px";
    } else {
      card.style.minHeight = "450px";
    }
    
    // Set image container height
    const imgContainer = card.querySelector(".project-img-container");
    if (imgContainer) {
      imgContainer.style.height = imgHeight;
    }
    
    // Adjust content area height
    const content = card.querySelector(".project-content");
    if (content && imgContainer) {
      content.style.height = "auto";
    }
    
    // Allow front and back to have flexible height
    const cardFront = card.querySelector(".project-card-front");
    const cardBack = card.querySelector(".project-card-back");
    
    if (cardFront && cardBack) {
      cardFront.style.height = "100%";
      cardBack.style.height = "100%";
    }
    
    // For desktop, we need to ensure the card inner maintains proper dimensions
    const cardInner = card.querySelector(".project-card-inner");
    if (cardInner) {
      cardInner.style.height = "100%";
    }
  }
  
  /**
   * Setup behavior for touch devices (tap to flip)
   */
  function setupTouchBehavior(card) {
    // Remove any existing click handlers
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    card = newCard;
    
    // Add tap to flip functionality
    card.addEventListener("click", function(e) {
      // Don't flip if clicking on a button or link
      if (e.target.closest("button") || e.target.closest("a")) {
        return;
      }
      
      // Toggle flipped class
      this.classList.toggle("flipped");
      
      // Update card inner transform
      const cardInner = this.querySelector(".project-card-inner");
      if (cardInner) {
        cardInner.style.transform = this.classList.contains("flipped") ? 
                                   "rotateY(180deg)" : "rotateY(0deg)";
      }
      
      // After flipping, resize the card height to fit all content if needed
      if (this.classList.contains("flipped")) {
        // Small delay to let the flip animation complete
        setTimeout(() => {
          const cardBack = this.querySelector(".project-card-back");
          if (cardBack) {
            // Get total height of all children in the back
            let totalHeight = 0;
            Array.from(cardBack.children).forEach(child => {
              totalHeight += child.offsetHeight;
            });
            
            // Add padding
            totalHeight += 40; // Account for padding
            
            // Set minimum height to accommodate all content
            const currentMinHeight = parseInt(this.style.minHeight || 0);
            if (totalHeight > currentMinHeight) {
              this.style.minHeight = totalHeight + "px";
            }
          }
        }, 300);
      }
      
      // Announce to screen readers
      const isFlipped = this.classList.contains("flipped");
      const projectTitle = this.querySelector(".project-title")?.textContent || "Project";
      
      announceToScreenReader(
        `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
      );
    });
    
    // Update view button text for touch devices
    const viewButton = card.querySelector(".view-project");
    if (viewButton) {
      viewButton.textContent = "Tap to view details";
    }
    
    // Setup buttons again for the cloned card
    setupButtons(card);
    addKeyboardAccessibility(card);
  }
  
  /**
   * Setup behavior for desktop devices (hover to flip)
   */
  function setupDesktopBehavior(card) {
    // Remove hover class if previously applied
    card.classList.remove("flipped");
    
    // Desktop uses CSS hover by default for the flip effect
    // But we can enhance the image behavior
    const img = card.querySelector(".project-img");
    if (img) {
      card.addEventListener("mouseenter", function() {
        img.style.transform = "scale(1.05)";
      });
      
      card.addEventListener("mouseleave", function() {
        img.style.transform = "scale(1)";
      });
    }
  }
  
  /**
   * Setup button behavior 
   */
  function setupButtons(card) {
    // Get all buttons on the card
    const buttons = card.querySelectorAll(".project-btn:not(.disabled-btn)");
    
    buttons.forEach(btn => {
      // Clean up any existing click listeners
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      btn = newBtn;
      
      // Get the URL from the data attribute or onclick attribute
      let url = btn.getAttribute("data-url");
      if (!url) {
        const onclickAttr = btn.getAttribute("onclick");
        if (onclickAttr) {
          const urlMatch = onclickAttr.match(/location\.href=[\'\"](.+?)[\'\"]/);
          if (urlMatch && urlMatch[1]) {
            url = urlMatch[1];
            // Store for future use
            btn.setAttribute("data-url", url);
          }
        }
      }
      
      // Add click handler that prevents propagation
      btn.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent card flip
        
        if (url) {
          window.open(url, '_blank');
        }
      });
      
      // Add proper aria attributes
      btn.setAttribute("role", "button");
      if (url) {
        btn.setAttribute("aria-label", `${btn.textContent.trim()} - opens in new tab`);
      }
    });
    
    // Disable actions on disabled buttons
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
  
  /**
   * Add keyboard accessibility
   */
  function addKeyboardAccessibility(card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    
    const projectTitle = card.querySelector(".project-title")?.textContent || "Project";
    card.setAttribute("aria-label", 
      `Project: ${projectTitle}. Press Enter to view details.`
    );
    
    card.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.classList.toggle("flipped");
        
        // Update card inner transform
        const cardInner = this.querySelector(".project-card-inner");
        if (cardInner) {
          cardInner.style.transform = this.classList.contains("flipped") ? 
                                     "rotateY(180deg)" : "rotateY(0deg)";
        }
        
        const isFlipped = this.classList.contains("flipped");
        
        announceToScreenReader(
          `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
        );
      }
    });
    
    // Make project buttons keyboard navigable
    const buttons = card.querySelectorAll(".project-btn");
    buttons.forEach(btn => {
      btn.setAttribute("tabindex", "0");
      
      btn.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click();
        }
      });
    });
  }
  
  // Make sure projects load correctly after page is fully loaded
  window.addEventListener("load", function() {
    // Initialize after a short delay to ensure all content is loaded
    setTimeout(initializeProjectCards, 500);
    
    // Also initialize when dark mode changes
    document.addEventListener("themeChanged", function() {
      setTimeout(initializeProjectCards, 300);
    });
  });