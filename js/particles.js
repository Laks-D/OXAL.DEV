/**
 * OXAL.DEV — Charcoal Particle Engine
 * Spawns ink-stroke particles on hover over hot zones
 */

const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor(x, y, isRed = false) {
    this.x = x; this.y = y;
    this.life  = 1;
    this.decay = 0.022 + Math.random() * 0.03;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 0.5;
    this.size   = Math.random() * 3 + 0.6;
    this.isLine = Math.random() > 0.5;
    this.angle  = Math.random() * Math.PI;
    this.len    = Math.random() * 14 + 4;
    this.isRed  = isRed;
  }

  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vy += 0.035;
    this.life -= this.decay;
    this.vx   *= 0.97;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life) * 0.5;
    const col = this.isRed ? '#E13010' : '#1A1D1A';
    ctx.strokeStyle = col; ctx.fillStyle = col;

    if (this.isLine) {
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(
        this.x - Math.cos(this.angle) * this.len / 2,
        this.y - Math.sin(this.angle) * this.len / 2
      );
      ctx.lineTo(
        this.x + Math.cos(this.angle) * this.len / 2,
        this.y + Math.sin(this.angle) * this.len / 2
      );
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export function spawnParticle(x, y, isRed = false) {
  particles.push(new Particle(x, y, isRed));
}

export function initParticles() {
  let mouseOnHot = false, lmx = 0, lmy = 0;

  document.addEventListener('mousemove', e => {
    if (mouseOnHot && (Math.abs(e.clientX - lmx) > 2 || Math.abs(e.clientY - lmy) > 2)) {
      const isRed = Math.random() > 0.85;
      for (let i = 0; i < 3; i++) {
        spawnParticle(
          e.clientX + (Math.random() - 0.5) * 18,
          e.clientY + (Math.random() - 0.5) * 18,
          isRed
        );
      }
    }
    lmx = e.clientX; lmy = e.clientY;
  });

  document.querySelectorAll('.process-col, .service-item, .work-card, .cta-btn, .hero__col--center, .fnav-link')
    .forEach(el => {
      el.addEventListener('mouseenter', () => mouseOnHot = true);
      el.addEventListener('mouseleave', () => mouseOnHot = false);
    });

  // Sketch panel particles
  const sketchPanel = document.getElementById('sketchPanel');
  if (sketchPanel) {
    sketchPanel.addEventListener('mousemove', e => {
      if (Math.random() > 0.65) {
        spawnParticle(
          e.clientX + (Math.random() - 0.5) * 40,
          e.clientY + (Math.random() - 0.5) * 20
        );
      }
    });
  }

  // Animation loop
  (function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    if (particles.length > 350) particles.splice(0, 8);
    requestAnimationFrame(animParticles);
  })();
}
