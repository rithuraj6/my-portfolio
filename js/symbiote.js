/**
 * Tactical Particle Mesh & Magnetic Dock Physics
 * High-performance, lightweight canvas particle field tuned to the DevOps palette:
 * Base: #0f1f17, Connections: #3e5a3f, Particles: #c7cbb8 & #6b7f67
 */
(() => {
  "use strict";

  const canvas = document.getElementById("antigravity-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let width = 0;
  let height = 0;
  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 28 : 55;
  const CONNECT_DIST = 110;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class TacticalNode {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = -(Math.random() * 0.55 + 0.15);
      this.radius = Math.random() * 1.6 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(199, 203, 184, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new TacticalNode());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw particle interconnect lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const lineAlpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(62, 90, 63, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw individual nodes
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // Magnetic button pull physics
  const magneticBtns = document.querySelectorAll(".magnetic-dock-btn, .btn-tactical-primary");
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
})();

