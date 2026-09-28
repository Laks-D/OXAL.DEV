/**
 * OXAL.DEV — Custom Cursor System
 * Dual cursor: crosshair (difference blend) + "VIEW" work cursor
 */

export function initCursor() {
  const ch       = document.getElementById('crosshair');
  const chRing   = document.getElementById('crosshair-ring');
  const workCursor = document.getElementById('work-cursor');

  let mx = 0, my = 0, rrx = 0, rry = 0;
  let wx = window.innerWidth / 2, wy = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    ch.style.left = mx + 'px';
    ch.style.top  = my + 'px';
  });

  (function animCursor() {
    rrx += (mx - rrx) * 0.08;
    rry += (my - rry) * 0.08;
    chRing.style.left = rrx + 'px';
    chRing.style.top  = rry + 'px';

    wx += (mx - wx) * 0.15;
    wy += (my - wy) * 0.15;
    workCursor.style.left = wx + 'px';
    workCursor.style.top  = wy + 'px';

    requestAnimationFrame(animCursor);
  })();

  // Standard hover targets
  document.querySelectorAll('a, button, .process-col, .service-item, .cta-btn, .fnav-link')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

  // Work section hover → morph to "VIEW" cursor
  document.querySelectorAll('.hover-work').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-work');
      wx = mx; wy = my; // snap instantly
    });
    card.addEventListener('mouseleave', () => document.body.classList.remove('hover-work'));
  });
}
