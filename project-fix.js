/**
 * Project Cards Enhancement Script
 * This script handles proper initialization and behavior of project cards.
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
  });
  
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
      
    projectCards.forEach(card => {
      // Clone card to remove existing event listeners
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      // Set consistent heights
      setCardHeight(newCard);
      
      // Setup different behaviors based on device type
      if (isTouchDevice) {
        setupTouchBehavior(newCard);
      } else {
        setupDesktopBehavior(newCard);
      }
      
      // Ensure buttons work properly
      setupButtons(newCard);
      
      // Add keyboard accessibility
      addKeyboardAccessibility(newCard);
    });
  }
  
  /**
   * Set appropriate heights for card components
   */
  function setCardHeight(card) {
    // Adjust heights based on screen size
    let cardHeight, imgHeight;
    
    if (window.innerWidth > 768) {
      cardHeight = "550px";
      imgHeight = "200px";
    } else if (window.innerWidth > 480) {
      cardHeight = "500px";
      imgHeight = "180px";
    } else {
      cardHeight = "480px";
      imgHeight = "180px";
    }
    
    // Apply heights
    card.style.height = cardHeight;
    
    const cardInner = card.querySelector(".project-card-inner");
    const cardFront = card.querySelector(".project-card-front");
    const cardBack = card.querySelector(".project-card-back");
    const imgContainer = card.querySelector(".project-img-container");
    const content = card.querySelector(".project-content");
    
    // Set heights for all components
    if (cardInner) cardInner.style.height = "100%";
    if (cardFront) cardFront.style.height = "100%";
    if (cardBack) cardBack.style.height = "100%";
    if (imgContainer) imgContainer.style.height = imgHeight;
    
    // Set content height based on image height
    if (content && imgContainer) {
      const actualImgHeight = imgContainer.offsetHeight || parseInt(imgHeight);
      content.style.height = `calc(100% - ${actualImgHeight}px)`;
    }
  }
  
  /**
   * Setup behavior for touch devices (tap to flip)
   */
  function setupTouchBehavior(card) {
    card.addEventListener("click", function(e) {
      // Don't flip if clicking on a button or link
      if (e.target.closest("button") || e.target.closest("a")) {
        return;
      }
      
      // Toggle flipped class
      this.classList.toggle("flipped");
      
      // Announce to screen readers
      const isFlipped = this.classList.contains("flipped");
      const projectTitle = this.querySelector(".project-title")?.textContent || "Project";
      
      announceToScreenReader(
        `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
      );
    });
    
    // Add visual indicator for touch devices
    const overlay = card.querySelector(".project-overlay");
    if (overlay) {
      const viewButton = overlay.querySelector(".view-project");
      if (viewButton) {
        viewButton.textContent = "Tap to view details";
      }
    }
  }
  
  /**
   * Setup behavior for desktop devices (hover to flip)
   */
  function setupDesktopBehavior(card) {
    // Desktop uses CSS hover by default
    // Add any additional desktop-specific enhancements here
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
    // Make sure buttons don't trigger card flip
    const buttons = card.querySelectorAll(".project-btn:not(.disabled-btn)");
    buttons.forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
      });
      
      // Add hover effect
      btn.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-3px)";
      });
      
      btn.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
      });
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
    card.setAttribute("aria-label", 
      `Project: ${card.querySelector(".project-title")?.textContent || "Project"}`
    );
    
    card.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.classList.toggle("flipped");
        
        const isFlipped = this.classList.contains("flipped");
        const projectTitle = this.querySelector(".project-title")?.textContent || "Project";
        
        announceToScreenReader(
          `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
        );
      }
    });
  }
  
  /**
   * Announce messages to screen readers
   */
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
  
  // Make sure projects load correctly after page is fully loaded
  window.addEventListener("load", function() {
    setTimeout(initializeProjectCards, 500);
    
    // Also initialize after scrolling to projects section
    document.querySelectorAll('a[href="#projects"]').forEach(link => {
      link.addEventListener("click", function() {
        setTimeout(initializeProjectCards, 300);
      });
    });
  });