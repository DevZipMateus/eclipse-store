/* =============================================
   ECLIPSE ◐ — SCRIPT
   GSAP + ScrollTrigger + Lenis
   Preloader · Scramble · Horizontal Scroll
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

  if (window.matchMedia('(max-width: 768px)').matches) {
    lenis.destroy();
  }

  /* ---- SPLIT TEXT (seções — executa antes do preloader) ---- */
  document.querySelectorAll('.title-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = text.split('').map(c =>
      `<span class="char-wrap">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  });

  document.querySelectorAll('.split-text').forEach(el => {
    const html = el.innerHTML;
    const parts = html.split(/(<br\s*\/?>)/gi);
    el.innerHTML = parts.map(part => {
      if (/^<br/i.test(part)) return part;
      return part.trim().split(' ').map(word =>
        word ? `<span class="word"><span class="word-inner">${word}</span></span>` : ''
      ).join(' ');
    }).join('');
  });

  /* ---- HERO ANIMATION (paused — dispara após preloader) ---- */
  const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });

  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8 })
    .to('.title-line .char-wrap', { y: 0, duration: 1, stagger: 0.025 }, '-=0.5')
    .to('.hero-sub',  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.hero-cta',  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

  /* ---- PRELOADER ---- */
  const preloader = document.getElementById('preloader');
  const preFill   = document.getElementById('preFill');
  const preCount  = document.getElementById('preCount');
  const preLogo   = document.querySelector('.pre-logo');

  // Oculta o site durante o preloader
  gsap.set(['#header', '#hero, .marquee-wrap'], { autoAlpha: 0 });

  const preloaderTl = gsap.timeline({
    onComplete: () => {
      // Slide para cima — revela o site
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.85,
        ease: 'expo.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          gsap.to(['#header', '#hero', '.marquee-wrap'], {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          });
          heroTl.play();
          ScrollTrigger.refresh();
        },
      });
    },
  });

  preloaderTl
    // Logo sobe para dentro
    .to(preLogo, { y: 0, duration: 0.7, ease: 'expo.out' }, 0)
    // Barra preenche + contador
    .to(preFill, {
      width: '100%',
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: function () {
        preCount.textContent = Math.round(this.progress() * 100);
      },
    }, 0.2)
    // Breve pausa antes de sair
    .to({}, { duration: 0.2 });

  /* ---- TEXT SCRAMBLE ---- */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ◐✦0123456789';

  const scramble = (el) => {
    const original = el.dataset.orig || el.textContent.trim();
    el.dataset.orig = original;
    let frame = 0;
    const total = original.length * 3;

    const tick = () => {
      el.textContent = original.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < frame / 3) return original[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frame++;
      if (frame <= total) requestAnimationFrame(tick);
      else el.textContent = original;
    };
    tick();
  };

  // Scramble nos links de navegação ao hover
  document.querySelectorAll('.nav-links a, .footer-nav a').forEach(link => {
    link.addEventListener('mouseenter', () => scramble(link));
  });

  // Scramble nas labels de seção ao entrar na viewport
  document.querySelectorAll('.section-label').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        setTimeout(() => scramble(el), 200);
      },
    });
  });

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -60',
    onEnter:     () => header.classList.add('scrolled'),
    onLeaveBack: () => header.classList.remove('scrolled'),
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

  /* ---- SCROLL REVEALS ---- */
  document.querySelectorAll('.split-text').forEach(el => {
    gsap.to(el.querySelectorAll('.word-inner'), {
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  document.querySelectorAll('.reveal-el').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  document.querySelectorAll('.products-grid, .testimonials-grid').forEach(grid => {
    gsap.to(grid.querySelectorAll('.reveal-card'), {
      opacity: 1, y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: grid, start: 'top 82%' },
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
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
  });
  gsap.to('.orb-2', {
    y: -50,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });

  /* ---- PARALLAX NAS IMAGENS DOS PRODUTOS ---- */
  document.querySelectorAll('.product-img').forEach(img => {
    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.product-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });

  /* ---- MAGNETIC BUTTONS ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
        gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ---- LOOKBOOK HOVER REVEAL ---- */
  const lbItems  = document.querySelectorAll('.lb-item');
  const lbPanels = document.querySelectorAll('.lb-panel');
  let lbCurrent  = 0;
  let lbBusy     = false;

  gsap.set(lbPanels[0], {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    zIndex: 2,
  });

  lbItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const next = parseInt(item.dataset.index);
      if (next === lbCurrent || lbBusy) return;
      lbBusy = true;

      lbItems[lbCurrent].classList.remove('active');
      item.classList.add('active');

      const prevPanel = lbPanels[lbCurrent];
      const nextPanel = lbPanels[next];

      gsap.set(nextPanel, {
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        zIndex: 3,
      });

      // Wipe revela a nova foto
      gsap.to(nextPanel, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.7,
        ease: 'expo.inOut',
        onComplete: () => {
          gsap.set(prevPanel, { zIndex: 1 });
          gsap.set(nextPanel, { zIndex: 2 });
          lbCurrent = next;
          lbBusy = false;
        },
      });

      // Foto nova entra com leve zoom-out
      gsap.fromTo(
        nextPanel.querySelector('.lb-panel-img'),
        { scale: 1.08 },
        { scale: 1, duration: 0.9, ease: 'expo.out' }
      );
    });
  });

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
