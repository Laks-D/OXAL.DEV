/**
 * OXAL.DEV — Animations & Interactions
 * Magnetic buttons, OXAL letter repel, card tilt,
 * text scramble, typewriter, SVG pulse, scroll reveal
 */

// ── MAGNETIC BUTTONS ───────────────────────────────
export function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.32;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.32;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  document.querySelectorAll('.magnetic-link').forEach(link => {
    link.addEventListener('mousemove', e => {
      const r  = link.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.15;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.15;
      link.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    link.addEventListener('mouseleave', () => { link.style.transform = 'translate(0,0)'; });
  });
}

// ── OXAL LETTER REPEL ──────────────────────────────
export function initLetterRepel() {
  document.querySelectorAll('.oxal-letter').forEach(letter => {
    letter.addEventListener('mousemove', e => {
      const r  = letter.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.18;
      letter.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`;
    });
    letter.addEventListener('mouseleave', () => {
      letter.style.transform = 'translate(0,0) rotate(0deg)';
    });
  });
}

// ── 3D CARD TILT ───────────────────────────────────
export function initCardTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });
}

// ── TEXT SCRAMBLE ──────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789—·';

function scramble(el) {
  const original = el.dataset.text;
  let frame = 0, iterations = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (i < iterations) return original[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (frame % 2 === 0) iterations++;
    frame++;
    if (iterations >= original.length) { el.textContent = original; clearInterval(interval); }
  }, 32);
}

export function initScramble() {
  document.querySelectorAll('.scramble').forEach(el => {
    el.addEventListener('mouseenter', () => scramble(el));
  });
}

// ── TYPEWRITER ─────────────────────────────────────
export function initTypewriter() {
  const lines = [
    '"Break it. Refine it. Resolve it."',
    '"Microsolutions → One whole."',
    '"Design & Engineering — unified."',
    '"OXAL.DEV — Precision by nature."',
  ];
  let li = 0, ci = 0, del = false;
  const tagEl = document.getElementById('typeTagline');
  if (!tagEl) return;

  function typeLoop() {
    const cur = lines[li];
    if (!del) {
      ci++; tagEl.textContent = cur.slice(0, ci);
      if (ci === cur.length) { del = true; setTimeout(typeLoop, 2400); return; }
    } else {
      ci--; tagEl.textContent = cur.slice(0, ci);
      if (ci === 0) { del = false; li = (li + 1) % lines.length; }
    }
    setTimeout(typeLoop, del ? 26 : 52);
  }
  setTimeout(typeLoop, 2200);
}

// ── SVG SKETCH PULSE ───────────────────────────────
export function initSketchPulse() {
  const sketchSVG = document.getElementById('sketch-svg');
  if (!sketchSVG) return;
  const pulseSeq = [0, 1.4, -1.4, 0.7, -0.7, 0];
  let pf = 0;
  setInterval(() => {
    pf = (pf + 1) % pulseSeq.length;
    sketchSVG.querySelectorAll('path, line').forEach(p => {
      const base = parseFloat(p.dataset.base || p.getAttribute('stroke-width') || 1);
      if (!p.dataset.base) p.dataset.base = base;
      if (p.getAttribute('stroke')) {
        p.setAttribute('stroke-width', Math.max(0.4, base + pulseSeq[pf] * 0.09));
      }
    });
  }, 83);
}

// ── SCROLL REVEAL ──────────────────────────────────
export function initScrollReveal() {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));
}

// ── VERMILION SWEEP ────────────────────────────────
export function initSweep(spawnParticle) {
  const sweep = document.getElementById('sweep');
  function triggerSweep() {
    sweep.classList.remove('active');
    void sweep.offsetWidth;
    sweep.classList.add('active');
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    for (let i = 0; i < 30; i++) {
      spawnParticle(cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.5) * 200, true);
    }
  }
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', () => triggerSweep());
  });
}

// ── FLOATING NAV SHOW/HIDE ─────────────────────────
export function initNav(lenis) {
  const floatingNav = document.getElementById('floatingNav');
  floatingNav.classList.add('hidden');
  let lastScroll = 0;

  lenis.on('scroll', e => {
    const current = e.scroll;
    if (current > 600) {
      if (current < lastScroll - 5) {
        floatingNav.classList.remove('hidden');
        lastScroll = current;
      } else if (current > lastScroll + 30) {
        floatingNav.classList.add('hidden');
        lastScroll = current;
      }
    } else {
      floatingNav.classList.add('hidden');
      lastScroll = current;
    }
  });
}

// ── CLOCK ─────────────────────────────────────────
export function initClock() {
  function updateTime() {
    const now = new Date();
    const el  = document.getElementById('localTime');
    if (el) {
      el.innerHTML = `<span class="clock-dot">●</span> LOCAL TIME: ${now.toLocaleTimeString('en-US', { hour12: false })}`;
    }
  }
  setInterval(updateTime, 1000);
  updateTime();
}

// ── PAGE LOADER ────────────────────────────────────
export function initLoader() {
  let pct = 0;
  const pctEl = document.getElementById('loadPct');
  const pctInterval = setInterval(() => {
    pct += Math.floor(Math.random() * 5) + 1;
    if (pct >= 100) { pct = 100; clearInterval(pctInterval); }
    if (pctEl) pctEl.textContent = pct;
  }, 30);

  window.addEventListener('load', () => {
    setTimeout(() => {
      const screen = document.getElementById('loadScreen');
      if (screen) screen.classList.add('gone');
    }, 1600);
  });
}

// ── SCROLL PARALLAX ────────────────────────────────
export function initParallax(lenis) {
  const bigNum = document.querySelector('.big-num');
  const scrollDrawPaths = document.querySelectorAll('.scroll-draw');

  lenis.on('scroll', e => {
    if (bigNum) bigNum.style.transform = `translateY(${e.scroll * 0.07}px)`;
    const scrollFrac = Math.min(e.scroll / 500, 1);
    scrollDrawPaths.forEach(p => {
      p.style.strokeDashoffset = 600 - scrollFrac * 600;
    });
  });
}
