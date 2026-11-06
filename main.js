/* Ferrand Précision – scripts communs (lot 1) */
(() => {
  const d = document;
  d.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lien de page active (body[data-page] ↔ a[data-nav])
  d.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === d.body.dataset.page) a.setAttribute('aria-current', 'page');
  });

  // Menu burger mobile
  const burger = d.querySelector('.burger'), nav = d.getElementById('nav');
  const closeNav = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeNav(); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); burger.focus(); } });

  // Année du footer
  d.querySelectorAll('[data-year]').forEach(n => n.textContent = new Date().getFullYear());

  // Compteurs animés : <strong data-count="42" data-dec="0" data-prefix="" data-suffix=""></strong>
  const fmt = (el, v) => {
    const dec = +el.dataset.dec || 0;
    el.textContent = (el.dataset.prefix || '') + v.toLocaleString('fr-FR', {minimumFractionDigits: dec, maximumFractionDigits: dec}) + (el.dataset.suffix || '');
  };
  const count = el => {
    const end = parseFloat(el.dataset.count);
    if (reduce) return fmt(el, end);
    const t0 = performance.now(), dur = 1400;
    const step = t => { const p = Math.min((t - t0) / dur, 1); fmt(el, end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  // Apparition au scroll + déclenchement des compteurs
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(count);
    io.unobserve(en.target);
  }), {threshold: .15});
  d.querySelectorAll('.reveal').forEach(n => io.observe(n));
})();
