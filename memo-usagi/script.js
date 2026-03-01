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

    const track = document.getElementById('galleryTrack');
    const dotsContainer = document.getElementById('galleryDots');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');

    if (!track || !dotsContainer) {
        return;
    }

    const slides = Array.from(track.querySelectorAll('.shot'));
    if (slides.length === 0) {
        return;
    }

    let currentIndex = 0;

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${index + 1}枚目へ移動`);
        dot.addEventListener('click', () => {
            scrollToIndex(index);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('button'));

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
        });
    }

    function scrollToIndex(index) {
        const bounded = Math.max(0, Math.min(index, slides.length - 1));
        currentIndex = bounded;
        slides[bounded].scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'nearest'
        });
        updateDots(bounded);
    }

    function detectIndexFromScroll() {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        slides.forEach((slide, index) => {
            const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
            const distance = Math.abs(slideCenter - center);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== currentIndex) {
            currentIndex = closestIndex;
            updateDots(currentIndex);
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex + 1);
        });
    }

    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(detectIndexFromScroll);
    });

    updateDots(0);
});
