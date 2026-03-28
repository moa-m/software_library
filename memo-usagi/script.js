document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        }
    );

    fadeElements.forEach((el) => observer.observe(el));
});
