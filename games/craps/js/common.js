const playingSurfaceEl = document.querySelector('.playing-surface');

playingSurfaceEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

// Adjust body padding-top based on fixed navbar height
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar.fixed-top');
    if (navbar) {
        const setBodyPadding = () => {
            const navbarHeight = navbar.offsetHeight;
            document.body.style.paddingTop = navbarHeight + 'px';
        };
        setBodyPadding(); // Set initially
        window.addEventListener('resize', setBodyPadding); // Adjust on resize
    }
});