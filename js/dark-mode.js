/**
 * Dark Mode Toggle Functionality
 * Manages theme switching between light and dark modes
 */

document.addEventListener("DOMContentLoaded", function() {
    // Initialize theme based on saved preference or system preference
    initializeDarkMode();
  });
  
  /**
   * Initialize dark mode based on saved preferences or system defaults
   */
  function initializeDarkMode() {
    const darkModeToggle = document.getElementById("checkbox");
    const darkModeToggleMobile = document.getElementById("checkbox-mobile");
  
    // First check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
  
    if (savedTheme === "dark") {
      // Use dark mode
      document.body.classList.add("dark-mode");
      if (darkModeToggle) darkModeToggle.checked = true;
      if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
    } else if (savedTheme === "light") {
      // Use light mode
      document.body.classList.remove("dark-mode");
    } else {
      // If no saved preference, check system preference
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDarkMode) {
        document.body.classList.add("dark-mode");
        if (darkModeToggle) darkModeToggle.checked = true;
        if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
      }
    }
  
    // Set up event listeners for toggle switches
    setupDarkModeToggleListeners();
  }
  
  /**
   * Setup event listeners for dark mode toggles
   */
  function setupDarkModeToggleListeners() {
    const darkModeToggle = document.getElementById("checkbox");
    const darkModeToggleMobile = document.getElementById("checkbox-mobile");
    
    // Desktop toggle
    if (darkModeToggle) {
      darkModeToggle.addEventListener("change", function() {
        toggleDarkMode(this.checked);
        
        // Keep mobile toggle in sync
        if (darkModeToggleMobile) {
          darkModeToggleMobile.checked = this.checked;
        }
      });
    }
    
    // Mobile toggle
    if (darkModeToggleMobile) {
      darkModeToggleMobile.addEventListener("change", function() {
        toggleDarkMode(this.checked);
        
        // Keep desktop toggle in sync
        if (darkModeToggle) {
          darkModeToggle.checked = this.checked;
        }
      });
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const prefersDarkMode = e.matches;
      
      // Only update if no saved preference exists
      if (!localStorage.getItem("theme")) {
        toggleDarkMode(prefersDarkMode);
        
        // Update toggle switches
        if (darkModeToggle) darkModeToggle.checked = prefersDarkMode;
        if (darkModeToggleMobile) darkModeToggleMobile.checked = prefersDarkMode;
      }
    });
  }
  
  /**
   * Toggle dark mode on or off and save preference
   * @param {boolean} isDark - Whether to enable dark mode
   */
  function toggleDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
    
    // Dispatch a custom event for other components to react to theme change
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { darkMode: isDark }
    }));
  }
  
  /**
   * Helper function to get current theme state
   * @returns {string} - 'dark' or 'light'
   */
  function getCurrentTheme() {
    if (document.body.classList.contains("dark-mode")) {
      return "dark";
    } else {
      return "light";
    }
  }