document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!('IntersectionObserver' in window)) {
        fadeElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.1
        }
    );

    fadeElements.forEach((element) => observer.observe(element));
});
