import { useEffect } from 'react';

export const useFadeInSelector = (selector: string) => {
  useEffect(() => {
    const fadeInElements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.add('pop-element');
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeInElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [selector]);
};
