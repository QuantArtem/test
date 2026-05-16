/* ============================================
   DETAILING STUDIO — MAIN.JS
   ============================================ */

'use strict';

/* ── Custom Cursor ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Lerp ring to cursor
  

  // Expand on hoverable elements
  document.querySelectorAll('a, button, .gallery-item, .ba-handle, .service-card, .adv-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      ring.style.width    = '54px';
      ring.style.height   = '54px';
      ring.style.opacity  = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      ring.style.width    = '36px';
      ring.style.height   = '36px';
      ring.style.opacity  = '0.5';
    });
  });
})();


/* ── Navbar ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Burger / Mobile Menu ── */
(function initBurger() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
})();


/* ── Smooth Scroll for nav links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── Reveal on Scroll ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


/* ── Before / After Slider ── */
(function initBASlider() {
  const container = document.querySelector('.ba-container');
  const afterEl   = document.querySelector('.ba-after');
  const handleEl  = document.querySelector('.ba-handle');
  if (!container || !afterEl || !handleEl) return;

  let dragging = false;
  let pct = 50;

  const setPosition = (x) => {
    const rect = container.getBoundingClientRect();
    let p = ((x - rect.left) / rect.width) * 100;
    p = Math.max(2, Math.min(98, p));
    pct = p;
    afterEl.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    handleEl.style.left = p + '%';
  };

  // Mouse
  handleEl.addEventListener('mousedown', (e) => {
    dragging = true;
    handleEl.classList.add('dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    setPosition(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    handleEl.classList.remove('dragging');
  });

  // Touch
  handleEl.addEventListener('touchstart', (e) => {
    dragging = true;
    handleEl.classList.add('dragging');
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    setPosition(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => {
    dragging = false;
    handleEl.classList.remove('dragging');
  });

  // Click anywhere on container
  container.addEventListener('click', (e) => {
    if (!dragging) setPosition(e.clientX);
  });

  // Keyboard accessibility
  handleEl.setAttribute('tabindex', '0');
  handleEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  setPosition(container.getBoundingClientRect().left + (pct - 5) / 100 * container.offsetWidth);
    if (e.key === 'ArrowRight') setPosition(container.getBoundingClientRect().left + (pct + 5) / 100 * container.offsetWidth);
  });

  // Animate in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateHandle();
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  observer.observe(container);

  function animateHandle() {
    let start = null;
    const duration = 1200;
    const startPct = 90;
    const endPct = 50;

    const tick = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const cur = startPct + (endPct - startPct) * ease;
      afterEl.style.clipPath = `inset(0 ${100 - cur}% 0 0)`;
      handleEl.style.left = cur + '%';
      if (prog < 1) requestAnimationFrame(tick);
      else pct = endPct;
    };
    requestAnimationFrame(tick);
  }
})();


/* ── Gallery / Work Detail ── */
(function initGallery() {
  const mainContent = document.getElementById('main-content');
  const workDetail  = document.getElementById('work-detail');
  if (!mainContent || !workDetail) return;

  const works = [
    {
      id: 'chevrolet camaro',
      title: 'chevrolet camaro',
      category: 'Детейлинг',
      image: 'img/111117.webp',
      tags: ['Детейлинг', 'Детейлинг'],
      desc: 'Информация о проделанной работе',
      steps: ['шаг 1', 'шаг 2', 'шаг 3', 'шаг 4', 'шаг 5'],
      duration: 'срок выполнения работы',
      result: 'Информация о результате проделанной работы',
      additionalImages: [
      'img/111117.webp',
      'img/111117.webp',
      'img/111117.webp',
    ],
    },
    {
      id: 'Geely',
      title: 'Geely',
      category: 'Оклейка',
      image: 'img/111112.webp',
      tags: ['Оклейка', 'Geely'],
      desc: 'Информация о проделанной работе',
      steps: ['шаг 1', 'шаг 2', 'шаг 3', 'шаг 4', 'шаг 5'],
      duration: 'срок выполнения работы',
      result: 'Информация о результате проделанной работы',
      additionalImages: [
      'img/111112.webp',
      'img/111112.webp',
      'img/111112.webp',
    ],
    },
    {
      id: 'BMW',
      title: 'BMW',
      category: 'Комплекс работ',
      image: 'img/111113.webp',
      tags: ['Комплекс работа', 'BMW'],
      desc: 'Информация о проделанной работе',
      steps: ['шаг 1', 'шаг 2', 'шаг 3', 'шаг 4', 'шаг 5'],
      duration: 'срок выполнения работы',
      result: 'Информация о результате проделанной работы',
      additionalImages: [
      'img/111113.webp',
      'img/111113.webp',
      'img/111113.webp',
    ],
    },
    {
      id: 'mitsubishi lancer',
      title: 'Mitsubishi Lancer',
      category: 'Оклейка',
      image: 'img/111114.webp',
      tags: ['mitsubishi', 'lancer'],
      desc:'Информация о проделанной работе',
      steps: ['шаг 1', 'шаг 2', 'шаг 3', 'шаг 4', 'шаг 5'],
      duration: 'срок выполнения работы',
      result:'Информация о результате проделанной работы',
      additionalImages: [
      'img/111114.webp',
      'img/111114.webp',
      'img/111114.webp',
    ],
    },
    {
      id: 'Honda',
      title: 'Honda',
      category: 'Химчистка',
      image: 'img/111115.webp',
      tags: ['Honda', 'Honda', 'Honda'],
      desc: 'Информация о проделанной работе',
      steps: ['шаг 1', 'шаг 2', 'шаг 3', 'шаг 4', 'шаг 5'],
      duration:'срок выполнения работы',
      result: 'Информация о результате проделанной работы',
      additionalImages: [
      'img/111115.webp',
      'img/111115.webp',
      'img/111115.webp',
    ],
    },
    {
      id: 'Volkswagen',
      title: 'Volkswagen',
      category: 'Полировка',
      image: 'img/111116.webp',
      tags: ['Volkswagen', 'Volkswagen'],
      desc: 'Информация о проделанной работе',
      steps:['шаг 1', 'шаг 2', 'шаг 3', 'шаг 4', 'шаг 5'],
      duration: 'срок выполнения работы',
      result:'Информация о результате проделанной работы',
      additionalImages: [
      'img/111116.webp',
      'img/111116.webp',
      'img/111116.webp',
    ],
    },
  ];

  // Populate gallery
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    galleryGrid.innerHTML = works.map(w => `
      <a href="#" class="gallery-item reveal" data-work="${w.id}" aria-label="Открыть работу: ${w.title}">

      <div class="gallery-item-img-container">
        <img src="${w.image}" alt="${w.title}" class="gallery-main-img">
      </div>
        <div class="gallery-overlay">
          <div class="gallery-tag-top">${w.category}</div>
          <div class="gallery-item-title">${w.title}</div>
          <div class="gallery-item-sub">
            Подробнее <span class="arrow">→</span>
          </div>
        </div>
      </a>
    `).join('');

    // Re-init reveal observer for new elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    galleryGrid.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Click handlers
    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.dataset.work;
        const work = works.find(w => w.id === id);
        if (work) openWorkDetail(work);
      });
    });
  }

  function openWorkDetail(work) {
  const detailTitle    = document.getElementById('wd-title');
  const detailCategory = document.getElementById('wd-category');
  const detailDuration = document.getElementById('wd-duration');
  const detailEmoji    = document.getElementById('wd-emoji');
  const detailDesc     = document.getElementById('wd-desc');
  const detailResult   = document.getElementById('wd-result');
  const detailSteps    = document.getElementById('wd-steps');
  const detailTags     = document.getElementById('wd-tags');
  const detailGallery  = document.getElementById('wd-gallery'); // ← новый блок

  if (detailTitle)    detailTitle.textContent    = work.title;
  if (detailCategory) detailCategory.textContent = work.category;
  if (detailDuration) detailDuration.textContent = work.duration;
  if (detailEmoji)    detailEmoji.innerHTML = '';//`<img src="${work.image}" alt="${work.title}" style="width:100%; height:auto; border-radius:12px;">`;
  if (detailDesc)     detailDesc.textContent     = work.desc;
  if (detailResult)   detailResult.textContent   = work.result;

  if (detailSteps) {
    detailSteps.innerHTML = work.steps.map((s, i) => `
      <div class="work-step">
        <div class="work-step-num">0${i + 1}</div>
        <div class="work-step-name">${s}</div>
      </div>
    `).join('');
  }

  if (detailTags) {
    detailTags.innerHTML = work.tags.map(t =>
      `<span class="work-meta-tag">${t}</span>`
    ).join('');
  }

  // ── Мини-галерея ──────────────────────────────────────────
  if (detailGallery) {
    const images = work.additionalImages;

    if (images && images.length > 0) {
      detailGallery.innerHTML = images.map((src, i) => `
        <button class="wd-gallery-item" onclick="openLightbox('${src}', '${work.title}', ${i + 1}, ${images.length})"
          aria-label="Открыть фото ${i + 1} из ${images.length}">
        <img src="${src}" alt="Фото работы «${work.title}» — снимок ${i + 1}"
          loading="lazy" onerror="this.parentElement.style.display='none'" />
        </button>
`).join('');
      detailGallery.style.display = '';   // показываем блок
    } else {
      detailGallery.innerHTML = '';
      detailGallery.style.display = 'none'; // скрываем, если фото нет
    }
  }
  // ──────────────────────────────────────────────────────────

  mainContent.classList.add('hidden');
  workDetail.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({ workId: work.id }, work.title, '#work-' + work.id);
}

  // Back button
  const backBtn = document.getElementById('work-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeWorkDetail();
    });
  }

  function closeWorkDetail() {
    workDetail.style.display = 'none';
    mainContent.classList.remove('hidden');
    history.pushState({}, '', '#gallery');
    setTimeout(() => {
      const gallery = document.getElementById('gallery');
      if (gallery) {
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        window.scrollTo({ top: gallery.offsetTop - navH, behavior: 'smooth' });
      }
    }, 50);
  }

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.workId) {
      const work = works.find(w => w.id === e.state.workId);
      if (work) openWorkDetail(work);
    } else {
      closeWorkDetail();
    }
  });
})();


/* ── Stat counter animation ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1500;
      const step = ts => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


/* ── Active nav link highlight on scroll ── */
(function initActiveNav() {
  const sections = ['hero','services','advantages','gallery','pricing','before-after','contacts'];
  const links = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');

  const onScroll = () => {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const scrollY = window.scrollY + navH + 60;

    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });

    links.forEach(link => {
      const href = link.getAttribute('href').replace('#','');
      link.style.color = href === current ? 'var(--gold)' : '';
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
/* ── Lightbox ── */
function openLightbox(src, title, index, total) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const caption = document.getElementById('lb-caption');

  img.src = src;
  img.alt = title;
  caption.textContent = `${title} — ${index} / ${total}`;
  lb.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('lb-open');
  document.getElementById('lb-img').src = '';
  document.body.style.overflow = '';
}

// Закрытие по Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
