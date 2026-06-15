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

    const phoneScreen = document.querySelector('.phone-screen');
    const scrollIndicator = document.querySelector('[data-scroll-indicator]');
    const scrollThumb = document.querySelector('[data-scroll-thumb]');

    if (phoneScreen && scrollIndicator && scrollThumb) {
        const syncMockScroll = () => {
            const track = scrollIndicator.querySelector('.scroll-track');

            if (!track) {
                return;
            }

            const maxScroll = phoneScreen.scrollHeight - phoneScreen.clientHeight;
            const maxTravel = track.clientHeight - scrollThumb.offsetHeight;
            const progress = maxScroll > 0 ? phoneScreen.scrollTop / maxScroll : 0;
            const thumbPosition = Math.max(0, maxTravel * progress);

            scrollThumb.style.transform = `translate(-50%, ${thumbPosition}px)`;
        };

        phoneScreen.addEventListener('scroll', syncMockScroll, { passive: true });
        window.addEventListener('resize', syncMockScroll);
        requestAnimationFrame(syncMockScroll);
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
