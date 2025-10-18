/* Portfolio v2 — script.js
   features:
   - progress bar
   - header shrink
   - IntersectionObserver reveal
   - typing dynamic phrases
   - particles canvas background with gentle parallax on mouse move
   - interactive tilt on project cards
   - form fake submit
*/

(() => {
  // helper
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // progress bar
  const progress = $('#progress');
  const updateProgress = () => {
    const scrolled = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;
    const pct = (scrolled / Math.max(1, height)) * 100;
    progress.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // header shrink
  const header = $('#site-header');
  const onScrollHeader = () => header.classList.toggle('shrink', window.scrollY > 50);
  window.addEventListener('scroll', onScrollHeader);

  // reveal on scroll
  const revealEls = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.classList.remove('reveal');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.14});
  revealEls.forEach(el => io.observe(el));

  // typing dynamic phrases (rotating)
  const phraseEls = $$('.phrase');
  let phraseIndex = 0;
  const rotatePhrases = () => {
    phraseEls.forEach((el, i) => {
      el.style.opacity = i === phraseIndex ? '1' : '0.12';
      el.style.transform = i === phraseIndex ? 'translateY(0)' : 'translateY(6px)';
    });
    phraseIndex = (phraseIndex + 1) % phraseEls.length;
  };
  setInterval(rotatePhrases, 2000);
  rotatePhrases();

  // typing name in hero (type once)
  const heroName = $('.name-large');
  if (heroName) {
    const full = heroName.textContent;
    heroName.textContent = '';
    let idx = 0;
    const typing = () => {
      if (idx <= full.length) {
        heroName.textContent = full.slice(0, idx);
        idx++;
        setTimeout(typing, 45);
      }
    };
    typing();
  }

  // canvas particles + gentle parallax
  const canvas = $('#bg-canvas');
  const cw = () => (canvas.width = innerWidth);
  const ch = () => (canvas.height = innerHeight);
  const ctx = canvas.getContext && canvas.getContext('2d');
  let particles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;

  if (ctx) {
    const initParticles = (n = 25) => {
      particles = [];
      for (let i = 0; i < n; i++) {
        particles.push({
          x: rand(0, canvas.width),
          y: rand(0, canvas.height),
          r: rand(30, 120),
          vx: rand(-0.15, 0.15),
          vy: rand(-0.05, 0.05),
          hue: Math.random() > 0.5 ? 'rgba(251,133,0,0.12)' : 'rgba(255,183,3,0.12)'
        });
      }
    };
    const resizeCanvas = () => {
      cw(); ch();
      initParticles(Math.round((canvas.width * canvas.height) / 120000));
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // mouse parallax
    let mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => {
      mx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      my = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx + mx * 0.6;
        p.y += p.vy + my * 0.3;
        // wrap
        if (p.x > canvas.width + p.r) p.x = -p.r;
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.y > canvas.height + p.r) p.y = -p.r;
        if (p.y < -p.r) p.y = canvas.height + p.r;

        ctx.beginPath();
        ctx.fillStyle = p.hue;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(render);
    };
    render();
  }

  // interactive tilt for project cards
  const interactiveCards = $$('.project.interactive');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const ry = (x - 0.5) * 12;
      const rx = (0.5 - y) * 8;
      card.style.transform = `perspective(900px) rotateY(${ry}deg) rotateX(${rx}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.2,.9,.2,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  // mobile nav toggle
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  menuToggle && menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  // close mobile nav when clicking a link
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  // contact form fake submit
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const notice = $('#formNotice');
      notice.style.display = 'block';
      setTimeout(() => notice.style.display = 'none', 3500);
      form.reset();
    });
  }

  window.openMail = () => {
    location.href = 'mailto:rendi@rendi.com';
  };

  // set footer year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;

})();
