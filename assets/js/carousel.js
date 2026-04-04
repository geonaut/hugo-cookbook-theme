document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn--prev');
    const nextBtn = document.querySelector('.carousel-btn--next');

    if (!track || !prevBtn || !nextBtn) return;

    function updateButtons() {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;

        prevBtn.disabled = scrollLeft <= 5; 
        nextBtn.disabled = scrollLeft >= maxScroll - 5;
    }

    nextBtn.addEventListener('click', () => {
        const scrollAmount = track.clientWidth * 0.75; // Scroll 75% for context
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        const scrollAmount = track.clientWidth * 0.75;
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Listen for scroll events to update button states
    track.addEventListener('scroll', updateButtons, { passive: true });
    
    // Initial check and on resize
    updateButtons();
    window.addEventListener('resize', updateButtons);
});
