/* =============================================
   Countdown Timer — targets Aug 31, 2026 (PHT)
   ============================================= */
function initCountdown() {
  const target = new Date('2026-08-31T00:00:00+08:00').getTime();
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    min: document.getElementById('cd-min'),
    sec: document.getElementById('cd-sec'),
  };

  if (!els.days) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const diff = target - Date.now();

    if (diff <= 0) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.min.textContent = '00';
      els.sec.textContent = '00';
      return;
    }

    els.days.textContent = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    els.hours.textContent = pad(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    els.min.textContent = pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    els.sec.textContent = pad(Math.floor((diff % (1000 * 60)) / 1000));
  }

  update();
  setInterval(update, 1000);
}

/* =============================================
   Progress Tracker
   ============================================= */
function initProgress() {
  const start = new Date('2026-06-01T00:00:00+08:00').getTime();
  const end = new Date('2026-08-31T00:00:00+08:00').getTime();
  const dayEl = document.getElementById('progress-day');
  const pctEl = document.getElementById('progress-pct');
  const fillEl = document.getElementById('progress-fill');

  if (!dayEl || !pctEl || !fillEl) return;

  const now = Date.now();
  const elapsed = now - start;
  const total = end - start;
  const progress = Math.max(0, Math.min(1, elapsed / total));

  if (elapsed < 0) {
    dayEl.textContent = 'Starts Jun 1';
    pctEl.textContent = '0%';
  } else if (progress >= 1) {
    dayEl.textContent = 'Complete';
    pctEl.textContent = '100%';
  } else {
    const dayNumber = Math.max(1, Math.ceil(elapsed / (1000 * 60 * 60 * 24)));
    dayEl.textContent = 'Day ' + dayNumber;
    pctEl.textContent = Math.round(progress * 100) + '%';
  }

  requestAnimationFrame(function () {
    fillEl.style.width = (progress * 100) + '%';
  });
}

/* =============================================
   Phase Status — auto-detects active phase
   ============================================= */
function initPhaseStatus() {
  var now = new Date();
  var phases = [
    { id: 1, start: new Date('2026-06-01'), end: new Date('2026-07-01') },
    { id: 2, start: new Date('2026-07-01'), end: new Date('2026-08-01') },
    { id: 3, start: new Date('2026-08-01'), end: new Date('2026-09-01') },
  ];

  phases.forEach(function (phase) {
    var statusEl = document.getElementById('phase-' + phase.id + '-status');
    var cardEl = document.querySelector('[data-phase="' + phase.id + '"]');
    if (!statusEl || !cardEl) return;

    if (now >= phase.end) {
      statusEl.textContent = 'Complete';
      statusEl.classList.add('phase__status--complete');
    } else if (now >= phase.start) {
      statusEl.textContent = 'Active';
      statusEl.classList.add('phase__status--active');
      cardEl.classList.add('is-active');
    } else {
      statusEl.textContent = 'Upcoming';
    }
  });
}

/* =============================================
   Header Scroll Effect
   ============================================= */
function initHeader() {
  var header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =============================================
   Scroll Animations (Intersection Observer)
   ============================================= */
function initScrollAnimations() {
  var elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
}

/* =============================================
   Smooth Scroll for Anchor Links
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      var target = document.querySelector(href);
      if (!target) return;

      var headerHeight = document.getElementById('header')
        ? document.getElementById('header').offsetHeight
        : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

/* =============================================
   Waitlist Form Handler
   ============================================= */
function initWaitlistForm() {
  var form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    var input = form.querySelector('input[type="email"]');
    var originalHTML = btn.innerHTML;

    // TODO: Wire to your backend or service (Formspree, ConvertKit, etc.)
    // Example:
    // fetch('/api/waitlist', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: input.value })
    // });

    btn.innerHTML = "You're in!";
    btn.disabled = true;
    btn.style.opacity = '0.7';
    input.disabled = true;

    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.opacity = '';
      input.disabled = false;
      form.reset();
    }, 3000);
  });
}

/* =============================================
   Initialize
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  initCountdown();
  initProgress();
  initPhaseStatus();
  initHeader();
  initScrollAnimations();
  initSmoothScroll();
  initWaitlistForm();
});
