/**
 * Project Cards Functionality
 * Handles project card behavior, animations, and interactions
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
    
    // Store button information before modifying cards
    const buttonData = [];
    projectCards.forEach(card => {
      const buttons = card.querySelectorAll(".project-btn");
      const cardData = { 
        cardIndex: Array.from(projectCards).indexOf(card),
        buttons: []
      };
      
      buttons.forEach(btn => {
        // Check for URL in data attribute first
        let url = btn.getAttribute("data-url");
        
        // If not found, check onclick attribute
        if (!url) {
          const onclickAttr = btn.getAttribute("onclick");
          if (onclickAttr) {
            const urlMatch = onclickAttr.match(/location\.href=[\'\"](.+?)[\'\"]/);
            if (urlMatch && urlMatch[1]) {
              url = urlMatch[1];
            }
          }
        }
        
        if (url) {
          cardData.buttons.push({
            buttonIndex: Array.from(buttons).indexOf(btn),
            url: url
          });
        }
      });
      
      buttonData.push(cardData);
    });
      
    projectCards.forEach((card, cardIndex) => {
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
      setupButtons(newCard, buttonData[cardIndex]);
      
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
      cardHeight = "450px";
      imgHeight = "160px";
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
      
      // Update card inner transform
      const cardInner = this.querySelector(".project-card-inner");
      if (cardInner) {
        cardInner.style.transform = this.classList.contains("flipped") ? 
                                   "rotateY(180deg)" : "rotateY(0deg)";
      }
      
      // Announce to screen readers
      const isFlipped = this.classList.contains("flipped");
      const projectTitle = this.querySelector(".project-title")?.textContent || "Project";
      
      // Use our announcement helper
      if (typeof announceToScreenReader === 'function') {
        announceToScreenReader(
          `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
        );
      }
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
    const cardInner = card.querySelector(".project-card-inner");
    if (cardInner) {
      card.addEventListener("mouseenter", function() {
        cardInner.style.transform = "rotateY(180deg)";
        this.classList.add("flipped");
      });
      
      card.addEventListener("mouseleave", function() {
        cardInner.style.transform = "rotateY(0deg)";
        this.classList.remove("flipped");
      });
    }
    
    // Additional desktop enhancement for images
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
  function setupButtons(card, cardData) {
    // Get all buttons on the card
    const buttons = card.querySelectorAll(".project-btn:not(.disabled-btn)");
    
    // First, reapply saved URLs from buttonData if available
    if (cardData && cardData.buttons.length > 0) {
      cardData.buttons.forEach(btnData => {
        if (btnData.buttonIndex < buttons.length) {
          const btn = buttons[btnData.buttonIndex];
          
          // Remove any existing onclick attribute
          btn.removeAttribute("onclick");
          
          // Store URL in data attribute for easier access
          btn.setAttribute("data-url", btnData.url);
          
          // Add proper event listener for redirection
          btn.addEventListener("click", function(e) {
            e.stopPropagation();
            window.location.href = btnData.url;
          });
        }
      });
    }
    
    // General button behavior for all buttons
    buttons.forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent card flip
        
        // If data-url attribute exists, use it
        const url = this.getAttribute("data-url");
        if (url) {
          window.location.href = url;
        }
      });
      
      // Add hover effect
      btn.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-3px)";
        this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
      });
      
      btn.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "";
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
      `Project: ${card.querySelector(".project-title")?.textContent || "Project"}. Press Enter to view details.`
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
        const projectTitle = this.querySelector(".project-title")?.textContent || "Project";
        
        // Use our announcement helper if available
        if (typeof announceToScreenReader === 'function') {
          announceToScreenReader(
            `${projectTitle} card ${isFlipped ? "flipped to show details" : "flipped back to front"}`
          );
        }
      }
    });
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