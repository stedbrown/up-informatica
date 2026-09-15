document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
const form = document.querySelector('#contact-form');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled || !form.reportValidity()) return;
  const status = document.querySelector('#form-messages');
  const body = new FormData(form);
  if (body.get('_gotcha')) return;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.dataset.state = 'pending';
  status.textContent = 'Invio della richiesta…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(form.action, {
      method: 'POST', body, headers: { Accept: 'application/json' }, signal: controller.signal
    });
    if (!response.ok) throw new Error('Submission failed');
    status.dataset.state = 'success';
    status.textContent = 'Richiesta inviata. Grazie! Ti risponderò all’indirizzo email indicato.';
    form.reset();
  } catch {
    status.dataset.state = 'error';
    status.textContent = 'Non riesco a confermare l’invio. I tuoi dati sono ancora nel modulo: riprova oppure contattami al 076 805 73 76.';
  } finally {
    clearTimeout(timeout);
    button.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero h1, .detail-hero h1', { y: 30, duration: .9, ease: 'power3.out', clearProps: 'transform' });
  gsap.from('.hero-bottom', { y: 20, duration: .9, delay: .12, ease: 'power3.out', clearProps: 'transform' });
  gsap.utils.toArray('.section-heading, .service-row, .approach-grid, .territory, .about-grid, .detail-items article').forEach(element => {
    gsap.from(element, { y: 25, duration: .7, ease: 'power2.out', clearProps: 'transform', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
  });
}
