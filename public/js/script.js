document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    if (loader) {
        const minDisplayTime = 350;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.35s ease';

                setTimeout(() => {
                    loader.style.display = 'none';
                }, 350);
            }, remainingTime);
        });
    }

    const stickerStrip = document.querySelector('.sticker-strip');

    if (stickerStrip) {
        const stickerCards = Array.from(stickerStrip.children);

        for (let index = stickerCards.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [stickerCards[index], stickerCards[randomIndex]] = [
                stickerCards[randomIndex],
                stickerCards[index]
            ];
        }

        stickerCards.forEach((card) => stickerStrip.appendChild(card));
    }

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
