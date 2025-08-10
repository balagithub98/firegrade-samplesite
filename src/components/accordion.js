export function initAccordion(){
  document.querySelectorAll('[data-accordion]').forEach((acc) => {
    const headers = acc.querySelectorAll('.accordion__header');
    headers.forEach((h) => {
      h.setAttribute('aria-expanded','false');
      h.addEventListener('click', () => {
        const expanded = h.getAttribute('aria-expanded') === 'true';
        // close all
        headers.forEach(x => x.setAttribute('aria-expanded','false'));
        // toggle current
        h.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    });
  });
}
