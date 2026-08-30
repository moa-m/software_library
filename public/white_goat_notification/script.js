const navLinks = [...document.querySelectorAll('.bottom-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries.find((entry) => entry.isIntersecting);
    if (!activeEntry) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.section === activeEntry.target.id));
}, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

sections.forEach((section) => navObserver.observe(section));
