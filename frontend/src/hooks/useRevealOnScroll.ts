import { useEffect } from 'react';

export function useRevealOnScroll(deps: unknown[] = []) {
  useEffect(() => {
    const elementos = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (elementos.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('is-visible');
            observer.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    elementos.forEach((elemento) => {
      elemento.classList.add('reveal-item');
      observer.observe(elemento);
    });

    return () => observer.disconnect();
  }, deps);
}
