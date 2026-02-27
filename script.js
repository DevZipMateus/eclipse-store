/* =============================================
   ECLIPSE ◐ — SCRIPT
   GSAP + ScrollTrigger + Lenis + Custom Cursor
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- FOOTER YEAR ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- GSAP REGISTER ---- */
  gsap.registerPlugin(ScrollTrigger);

  /* ---- LENIS SMOOTH SCROLL ---- */
  const lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Parar smooth scroll no mobile (performance)
  if (window.matchMedia('(max-width: 768px)').matches) {
    lenis.destroy();
  }

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
    });

    // Ring segue com delay suave
    const followRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(followRing);
    };
    followRing();

    // Hover em links / botões
    const hoverEls = document.querySelectorAll('a, button, .product-card, .btn-card, .magnetic');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -60',
    onEnter:      () => header.classList.add('scrolled'),
    onLeaveBack:  () => header.classList.remove('scrolled'),
  });

  /* ---- MOBILE MENU ---- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav  = document.getElementById('mobileNav');

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- HERO ANIMATION ---- */
  // Split text nas linhas do título
  document.querySelectorAll('.title-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = text.split('').map(c =>
      `<span class="char-wrap">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  });

  const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to('.title-line .char-wrap', {
      y: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'expo.out',
    }, '-=0.5')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

  /* ---- SPLIT TEXT (seções) ---- */
  document.querySelectorAll('.split-text').forEach(el => {
    const html = el.innerHTML;
    // Preserva <br> e divide por palavras
    const parts = html.split(/(<br\s*\/?>)/gi);
    el.innerHTML = parts.map(part => {
      if (/^<br/i.test(part)) return part;
      return part.trim().split(' ').map(word =>
        word ? `<span class="word"><span class="word-inner">${word}</span></span>` : ''
      ).join(' ');
    }).join('');

    gsap.to(el.querySelectorAll('.word-inner'), {
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  /* ---- REVEAL ELEMENTS ---- */
  document.querySelectorAll('.reveal-el').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });

  /* ---- REVEAL CARDS (stagger) ---- */
  document.querySelectorAll('.products-grid, .testimonials-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.reveal-card');
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 82%',
      },
    });
  });

  /* ---- COUNTER ANIMATION ---- */
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: target > 1000 ? 2.2 : 1.5,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val).toLocaleString('pt-BR');
          },
        });
      },
    });
  });

  /* ---- PARALLAX HERO ORBs ---- */
  gsap.to('.orb-1', {
    y: -80,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
  gsap.to('.orb-2', {
    y: -50,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  /* ---- MAGNETIC BUTTONS ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.3;
        const dy = (e.clientY - cy) * 0.3;
        gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ---- NEWSLETTER FORM ---- */
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');
  });

  /* ---- MARQUEE pause on hover ---- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

});
