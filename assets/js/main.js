(() => {
  /* Mobile menu */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !e.target.closest('.nav')) setMenu(false);
  });

  /* Copy student code */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const status = btn.nextElementSibling;
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); status.textContent = 'Zkopírováno'; }
      catch { status.textContent = 'Kód: ' + btn.dataset.copy; }
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });

  /* Legal pages: build the table of contents from section headings */
  const toc = document.querySelector('[data-toc]');
  if (toc) {
    const sections = [...document.querySelectorAll('.doc__body section')];
    sections.forEach((sec, i) => {
      if (!sec.id) sec.id = `s${i + 1}`;
      const h = sec.querySelector('h2');
      if (!h) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${sec.id}">${h.textContent}</a>`;
      toc.appendChild(li);
    });
    if ('IntersectionObserver' in window) {
      const links = [...toc.querySelectorAll('a')];
      const tio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      sections.forEach((s) => tio.observe(s));
    }
  }

  /* Stagger index for grouped reveals */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });

  /* Reveal on scroll */
  const items = document.querySelectorAll('.reveal, .reveal-img');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
})();
