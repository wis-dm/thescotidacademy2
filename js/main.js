/* =============================================
   ENEKA ROYAL ACADEMY — MAIN JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ───────────────────────── */
  const navbar = document.getElementById('navbar');

  const updateNav = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── MOBILE MENU ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    mobileClose.addEventListener('click', closeMobile);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
  }

  function closeMobile() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }


  /* ── NEWS BAR ────────────────────────────── */
  const newsBar = document.getElementById('news-bar');
  const newsClose = document.getElementById('news-bar-close');

  if (newsBar) {
    // Show after short delay
    setTimeout(() => newsBar.classList.add('visible'), 800);

    if (newsClose) {
      newsClose.addEventListener('click', () => {
        newsBar.style.opacity = '0';
        newsBar.style.transform = 'translateX(-50%) translateY(-24px)';
        setTimeout(() => newsBar.classList.add('hidden'), 400);
      });
    }
  }


  /* ── SCROLL REVEAL ───────────────────────── */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));


  /* ── COUNTER ANIMATION ───────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const value = target % 1 === 0
        ? Math.floor(eased * target)
        : (eased * target).toFixed(1);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }


  /* ── GALLERY FILTERS ─────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.style.display = '';
          item.style.animation = 'fade-up 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  /* ── LIGHTBOX ────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || '';
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }


  /* ── CONTACT FORM ────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'var(--success)';
        btn.style.color = 'var(--white)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 3500);
      }, 1800);
    });
  }


  /* ── SMOOTH SCROLL CTA ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── NEWS UPLOAD PREVIEW ─────────────────── */
  document.querySelectorAll('.news-upload-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const zone = input.closest('.news-upload-zone');
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:inherit;';
        zone.style.position = 'relative';
        zone.appendChild(img);
        zone.querySelector('.news-upload-content').style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  });


  /* ── ACTIVE NAV LINK ON SCROLL ───────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

});
