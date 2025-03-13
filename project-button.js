/**
 * Direct Project Button Fix
 * Simplified approach to fix button redirection
 */

// Run as soon as possible
(function() {
  // Immediately fix buttons when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", directButtonFix);
  } else {
    directButtonFix();
  }
  
  // Also run after window loads for good measure
  window.addEventListener("load", directButtonFix);
  
  // Fix buttons after any card flipping
  document.addEventListener("click", function(e) {
    if (e.target.closest(".project-card")) {
      setTimeout(directButtonFix, 10);
    }
  });
})();

function directButtonFix() {
  console.log("Applying direct button fix");
  
  // Get all project buttons
  document.querySelectorAll(".project-btn").forEach(function(btn) {
    // Check if this button has an onclick attribute
    const onclickAttr = btn.getAttribute("onclick");
    
    if (onclickAttr) {
      // Extract URL
      const urlMatch = onclickAttr.match(/location\.href=[\'\"](.*?)[\'\"]/);
      
      if (urlMatch && urlMatch[1]) {
        const url = urlMatch[1];
        console.log("Found button with URL:", url);
        
        // Replace the button with a clone to remove any existing listeners
        const newBtn = btn.cloneNode(true);
        
        // Remove the onclick attribute
        newBtn.removeAttribute("onclick");
        
        // Inline the URL directly in the new button
        newBtn.dataset.url = url;
        
        // Add a very direct click handler that will definitely run
        newBtn.addEventListener("click", function(e) {
          console.log("Button clicked, navigating to:", this.dataset.url);
          e.stopPropagation();
          e.preventDefault();
          window.location.href = this.dataset.url;
          return false; // Extra measure to prevent default
        }, true); // Use capture phase to ensure this runs first
        
        // Replace the original button
        if (btn.parentNode) {
          btn.parentNode.replaceChild(newBtn, btn);
        }
      }
    }
  });
  
  // Also handle any buttons that might still have onclick attributes
  document.addEventListener("click", function(e) {
    const btn = e.target.closest(".project-btn");
    if (btn) {
      const onclickAttr = btn.getAttribute("onclick");
      if (onclickAttr) {
        const urlMatch = onclickAttr.match(/location\.href=[\'\"](.*?)[\'\"]/);
        if (urlMatch && urlMatch[1]) {
          console.log("Delegated click handler navigating to:", urlMatch[1]);
          e.stopPropagation();
          e.preventDefault();
          window.location.href = urlMatch[1];
          return false;
        }
      } else if (btn.dataset.url) {
        console.log("Using dataset URL to navigate to:", btn.dataset.url);
        e.stopPropagation();
        e.preventDefault();
        window.location.href = btn.dataset.url;
        return false;
      }
    }
  }, true); // Use capture phase to ensure this runs first
}