/* =========================================================
   BLACKPINK SPA BALI — script.js
   Premium Interactive Experience
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Progress Bar ────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      progressBar.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /* ── Custom Cursor ──────────────────────────────── */
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorDot  = document.querySelector('.cursor-dot');
  if (cursorRing && cursorDot) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left  = mx + 'px';
      cursorDot.style.top   = my + 'px';
    });
    const animateCursor = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverables = 'a, button, .btn, .filter-tab, .dur-btn, .slider-arrow, .slider-dot, .faq-q, .whatsapp, .area-tag';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
    document.addEventListener('mousedown', () => {
      cursorRing.classList.add('clicking');
      cursorDot.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      cursorRing.classList.remove('clicking');
      cursorDot.classList.remove('clicking');
    });
    document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
  }

  /* ── Navbar Scroll Shrink ───────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu ────────────────────────────────── */
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.textContent = '☰';
      });
    });
  }

  /* ── Hero Parallax ──────────────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.7);
      }
    }, { passive: true });
  }

  /* ── Particle Generator ─────────────────────────── */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left   = Math.random() * 100 + '%';
      p.style.setProperty('--dur',   (6 + Math.random() * 8) + 's');
      p.style.setProperty('--delay', (Math.random() * -12) + 's');
      p.style.width  = (Math.random() * 3 + 1) + 'px';
      p.style.height = p.style.width;
      p.style.opacity = Math.random() * 0.5 + 0.2;
      particleContainer.appendChild(p);
    }
  }

  /* ── Reveal / IntersectionObserver ─────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => revealObserver.observe(el));

  /* ── Counter Animation ──────────────────────────── */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const counters = statsSection.querySelectorAll('[data-count]');
    const animate = (el) => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const dec      = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
      const duration = 1800;
      const start    = performance.now();
      const run = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = target * ease;
        el.textContent = prefix + (dec ? value.toFixed(dec) : Math.floor(value).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    };
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          counters.forEach(animate);
          counterObs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe(statsSection);
  }

  /* ── Testimonials Slider ────────────────────────── */
  const track  = document.querySelector('.testimonials-track');
  const dots   = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  if (track && dots.length) {
    let current = 0;
    const cards  = track.querySelectorAll('.testimonial');
    const total  = Math.max(1, cards.length - (window.innerWidth > 900 ? 2 : window.innerWidth > 620 ? 1 : 0));

    const goTo = (index) => {
      current = ((index % total) + total) % total;
      const cardW = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-slide
    let auto = setInterval(() => goTo(current + 1), 5000);
    track.addEventListener('mouseenter', () => clearInterval(auto));
    track.addEventListener('mouseleave', () => { auto = setInterval(() => goTo(current + 1), 5000); });

    // Touch swipe
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    goTo(0);
  }

  /* ── Service Filter Tabs ────────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  if (filterTabs.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.filter;
        document.querySelectorAll('.card[data-cat]').forEach((card, i) => {
          const matches = cat === 'all' || card.dataset.cat === cat;
          if (matches) {
            card.style.display = '';
            setTimeout(() => card.classList.add('card-visible'), i * 60);
          } else {
            card.classList.remove('card-visible');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Duration Toggle (Pricelist) ────────────────── */
  const durBtns = document.querySelectorAll('.dur-btn');
  if (durBtns.length) {
    durBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        durBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const dur = btn.dataset.dur;
        document.querySelectorAll('[data-price]').forEach(priceEl => {
          const prices = JSON.parse(priceEl.dataset.price);
          const newPrice = prices[dur];
          if (newPrice !== undefined) {
            priceEl.style.transform = 'scale(0.85)';
            priceEl.style.opacity   = '0';
            setTimeout(() => {
              priceEl.textContent = newPrice;
              priceEl.style.transform = '';
              priceEl.style.opacity   = '';
              priceEl.style.transition = 'transform .3s var(--ease-bounce), opacity .3s';
            }, 180);
          }
        });
      });
    });
  }

  /* ── FAQ Accordion ──────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── WhatsApp Button ────────────────────────────── */
  document.querySelectorAll('[data-wa]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.wa || 'Halo Blackpink Spa Bali, saya ingin booking spa/massage panggilan.';
      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
    });
  });

  /* ── Contact Form ───────────────────────────────── */
  const form = document.querySelector('#contactForm');
  if (form) {
    // Floating label: mark filled
    form.querySelectorAll('input, textarea').forEach(el => {
      el.setAttribute('placeholder', ' ');
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name      = form.querySelector('[name=name]').value.trim();
      const treatment = form.querySelector('[name=treatment]').value;
      const msg       = form.querySelector('[name=message]').value.trim();
      const text      = `Halo Blackpink Spa Bali, saya ${name}. Saya ingin booking ${treatment}. ${msg}`;
      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(text), '_blank');
    });

    // Step indicator
    const steps  = form.querySelectorAll('.bstep');
    const fields  = form.querySelectorAll('input, select, textarea');
    if (steps.length && fields.length) {
      fields.forEach((field, i) => {
        field.addEventListener('input', () => {
          if (i < steps.length && field.value.trim()) {
            steps[i].classList.add('done');
          }
        });
      });
    }
  }

  /* ── Magnetic Button Effect ─────────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

});
