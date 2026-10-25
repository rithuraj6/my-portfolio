/**
 * Antigravity Page Loader
 * Simulates an inverted gravity field with floating celestial nodes,
 * connecting gravitational filaments, and smooth dissipation into the page.
 */
(function () {
  const loader = document.getElementById('antigravity-loader');
  const canvas = document.getElementById('antigravity-canvas');
  if (!loader || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 55;
  let animationFrameId;
  let isDissipating = false;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class AntigravityNode {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.radius = Math.random() * 2.8 + 1.2;
      // Inverted gravity: particles float upwards
      this.vy = -(Math.random() * 1.5 + 0.6);
      this.vx = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(157, 78, 221,';
      this.alpha = Math.random() * 0.7 + 0.3;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.04;
      this.currentAlpha = this.alpha * (0.8 + 0.2 * Math.sin(this.pulse));

      // Wrap or reset at top
      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.currentAlpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color.includes('240') ? '#00f0ff' : '#9d4edd';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Populate particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new AntigravityNode());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw gravitational filaments between near particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const filamentAlpha = (1 - dist / 110) * 0.25;
          ctx.strokeStyle = `rgba(0, 240, 255, ${filamentAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (!isDissipating) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  render();

  // Dismiss loader on window load with slight delay for visual impact
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      setTimeout(() => {
        isDissipating = true;
        cancelAnimationFrame(animationFrameId);
        loader.style.display = 'none';
      }, 950);
    }, 900);
  });
})();
