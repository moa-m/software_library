import { useEffect } from 'react';

export const usePageLoader = () => {
  useEffect(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => {
        (loader as HTMLElement).style.opacity = '0';
        (loader as HTMLElement).style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          (loader as HTMLElement).style.display = 'none';
        }, 500);
      }, 500);
    }
  }, []);
};
