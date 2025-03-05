// Fix for project cards display
document.addEventListener("DOMContentLoaded", function () {
  fixProjectCards();
});

window.addEventListener("load", function () {
  setTimeout(fixProjectCards, 500);
});

window.addEventListener("resize", function () {
  setTimeout(fixProjectCards, 100);
});

function fixProjectCards() {
  // Fix projects container
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

  // Fix project cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.style.opacity = "1";
    card.style.visibility = "visible";
    card.style.display = "block";
    card.style.width = "100%";

    // Fix card inner
    const cardInner = card.querySelector(".project-card-inner");
    if (cardInner) {
      cardInner.style.visibility = "visible";
      cardInner.style.width = "100%";

      // Remove any existing click event listeners
      card.replaceWith(card.cloneNode(true));
    }

    // Fix card content
    const content = card.querySelector(".project-content");
    if (content) {
      content.style.visibility = "visible";
      content.style.width = "100%";
      content.style.justifyContent = "space-between";
    }

    // Fix project title
    const title = card.querySelector(".project-title");
    if (title) {
      title.style.width = "100%";
      title.style.textAlign = "center";
    }

    // Fix project description
    const description = card.querySelector(".project-description");
    if (description) {
      description.style.width = "100%";
      description.style.textAlign = "left";
      description.style.minHeight = "60px";
      description.style.display = "flex";
      description.style.alignItems = "flex-start";
      description.style.marginBottom = "1.5rem";
    }

    // Fix project meta
    const meta = card.querySelector(".project-meta");
    if (meta) {
      meta.style.marginTop = "auto";
      meta.style.width = "100%";
      meta.style.display = "flex";
      meta.style.justifyContent = "space-between";
      meta.style.paddingTop = "1rem";
      meta.style.borderTop = "1px solid var(--card-border)";
    }

    // Fix project tech stack
    const techStack = card.querySelector(".project-tech-stack");
    if (techStack) {
      techStack.style.display = "flex";
      techStack.style.flexWrap = "wrap";
      techStack.style.gap = "0.5rem";
      techStack.style.marginBottom = "1.5rem";
      techStack.style.justifyContent = "center";
    }

    // Fix back card
    const backCard = card.querySelector(".project-card-back");
    if (backCard) {
      backCard.style.padding = "2rem";
      backCard.style.display = "flex";
      backCard.style.flexDirection = "column";
      backCard.style.justifyContent = "space-between";
    }

    // Fix project description full
    const descriptionFull = card.querySelector(".project-description-full");
    if (descriptionFull) {
      descriptionFull.style.marginBottom = "1.5rem";
      descriptionFull.style.textAlign = "left";
      descriptionFull.style.lineHeight = "1.6";
      descriptionFull.style.flexGrow = "1";
      descriptionFull.style.minHeight = "100px";
    }

    // Add hover indicator for mobile
    if (window.innerWidth <= 768) {
      const imgContainer = card.querySelector(".project-img-container");
      if (imgContainer) {
        imgContainer.setAttribute("data-mobile", "true");
      }
    }
  });

  // Add touch support for mobile devices
  if ("ontouchstart" in window) {
    addTouchSupport();
  }
}

// Add touch support for mobile devices
function addTouchSupport() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("touchstart", function () {
      const cardInner = this.querySelector(".project-card-inner");
      if (cardInner) {
        const isFlipped = cardInner.style.transform === "rotateY(180deg)";
        cardInner.style.transform = isFlipped
          ? "rotateY(0deg)"
          : "rotateY(180deg)";
      }
    });
  });
}
