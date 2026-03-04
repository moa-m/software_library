document.addEventListener('DOMContentLoaded', () => {
    // Page Loader
    const loader = document.getElementById('loader');
    if (loader) {
        // Minimum display time for the loader to prevent flashing
        const minDisplayTime = 500;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, remainingTime);
        });
    }

    // Fade In Animation using IntersectionObserver
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Stickers horizontal carousel controls
    const stickersGrid = document.getElementById('stickersGrid');
    const stickersIndicator = document.getElementById('stickersIndicator');
    const prevButton = document.querySelector('.stickers-nav-prev');
    const nextButton = document.querySelector('.stickers-nav-next');

    if (stickersGrid && stickersIndicator && prevButton && nextButton) {
        const originalCards = Array.from(stickersGrid.querySelectorAll('.card'));
        const shuffledCards = [...originalCards];

        // Fisher-Yates shuffle
        for (let i = shuffledCards.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }

        shuffledCards.forEach((card) => {
            stickersGrid.appendChild(card);
        });

        const cards = Array.from(stickersGrid.querySelectorAll('.card'));
        let currentIndex = 0;
        const dots = cards.map((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'stickers-dot';
            if (index === 0) {
                dot.classList.add('is-active');
            }
            stickersIndicator.appendChild(dot);
            return dot;
        });

        const getNearestIndex = () => {
            const maxScrollLeft = stickersGrid.scrollWidth - stickersGrid.clientWidth;
            if (stickersGrid.scrollLeft <= 4) {
                return 0;
            }
            if (stickersGrid.scrollLeft >= maxScrollLeft - 4) {
                return cards.length - 1;
            }

            const left = stickersGrid.scrollLeft;
            let nearest = 0;
            let minDistance = Number.POSITIVE_INFINITY;

            cards.forEach((card, index) => {
                const distance = Math.abs(card.offsetLeft - left);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = index;
                }
            });

            return nearest;
        };

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === currentIndex);
            });
        };

        const goToIndex = (index) => {
            const count = cards.length;
            if (count === 0) {
                return;
            }

            currentIndex = ((index % count) + count) % count;
            stickersGrid.scrollTo({
                left: cards[currentIndex].offsetLeft,
                behavior: 'smooth'
            });
            updateDots();
        };

        const updateButtons = () => {
            prevButton.disabled = false;
            nextButton.disabled = false;
        };

        prevButton.addEventListener('click', () => {
            goToIndex(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            goToIndex(currentIndex + 1);
        });

        let scrollTimer;
        stickersGrid.addEventListener('scroll', () => {
            currentIndex = getNearestIndex();
            updateDots();
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateButtons, 80);
        }, { passive: true });

        window.addEventListener('resize', () => {
            currentIndex = getNearestIndex();
            updateDots();
            updateButtons();
        });

        currentIndex = getNearestIndex();
        updateDots();
        updateButtons();
    }
});
