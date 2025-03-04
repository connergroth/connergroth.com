// Function to toggle the hamburger menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll event for adding a shadow to the nav when scrolling
window.addEventListener('scroll', function() {
    const desktop = document.getElementById('desktop-nav');
    const hamburger = document.getElementById('hamburger-nav');
    
    if (window.scrollY > 50) {
        desktop.classList.add('scrolled');
        hamburger.classList.add('scrolled');
    } else {
        desktop.classList.remove('scrolled');
        hamburger.classList.remove('scrolled');
    }
});

// Add animation to skills sections
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.details-container');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);