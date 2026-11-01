
/**
 * Cinematic Liquid Identity Intro
 * R → റ → ர் → र → RITHU RAJ R
 * DevOps sequence: OBSERVE → BUILD → AUTOMATE → DEPLOY → MONITOR → EVOLVE
 */
(() => {
  "use strict";

  const loader = document.getElementById("antigravity-loader");
  const canvas = document.getElementById("antigravity-canvas");

  if (!loader || !canvas || loader.dataset.initialized === "true") return;
  loader.dataset.initialized = "true";

  const ctx = canvas.getContext("2d");
  const letters = Array.from(loader.querySelectorAll(".liquid-letter"));
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!ctx || letters.length < 5) {
    console.error("Loader requires a canvas and five .liquid-letter elements.");
    loader.classList.add("loader-hidden");
    window.setTimeout(() => {
      loader.style.display = "none";
    }, 600);
    return;
  }

  let width = 0;
  let height = 0;
  let particles = [];
  let frameId = null;
  let dismissed = false;
  const timers = [];

  function later(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 12;
      this.radius = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.7 + 0.2);
      this.alpha = Math.random() * 0.35 + 0.1;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.025;

      if (this.y < -10) this.reset();
    }

    draw() {
      const alpha =
        this.alpha * (0.75 + 0.25 * Math.sin(this.phase));

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from(
      { length: reducedMotion ? 12 : 48 },
      () => new Particle()
    );
  }

  function render() {
    if (dismissed) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      a.update();

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < 105) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle =
            `rgba(255,255,255,${(1 - distance / 105) * 0.09})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      a.draw();
    }

    frameId = requestAnimationFrame(render);
  }

  function createSparkles() {
    const stage = loader.querySelector(".liquid-letter-stage");
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = reducedMotion ? 6 : 20;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 18 + Math.random() * 48;
      const sparkle = document.createElement("span");

      sparkle.className = "identity-sparkle";
      sparkle.style.left = `${cx}px`;
      sparkle.style.top = `${cy}px`;
      sparkle.style.setProperty(
        "--sx",
        `${Math.cos(angle) * distance}px`
      );
      sparkle.style.setProperty(
        "--sy",
        `${Math.sin(angle) * distance}px`
      );
      sparkle.style.setProperty(
        "--spark-size",
        `${2 + Math.random() * 3}px`
      );

      loader.appendChild(sparkle);

      sparkle.addEventListener("animationend", () => sparkle.remove(), {
        once: true
      });

      // Fallback cleanup in case animationend doesn't fire.
      later(() => sparkle.remove(), 1000);
    }
  }

  function showLetter(index) {
    if (dismissed || !letters[index]) return;

    letters.forEach((letter, i) => {
      letter.classList.remove("is-current", "is-morphing");

      if (i === index) {
        letter.style.display = "block";
        void letter.offsetWidth;
        letter.classList.add("is-current");
      } else {
        letter.classList.add("is-morphing");
      }
    });

    createSparkles();
  }

  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    timers.forEach(window.clearTimeout);
    loader.classList.add("loader-hidden");

    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }

    window.setTimeout(() => {
      loader.style.display = "none";
    }, 600);
  }

  function startSequence() {
    const statusLabel = loader.querySelector(".loader-status-label");
    const statusDetail = loader.querySelector(".loader-status-detail");
    const progressBar = loader.querySelector(".identity-loader-line");
    const progressFill = progressBar?.querySelector("span");

    const stages = [
      { time: 0, label: "OBSERVE", detail: "Reading the environment..." },
      { time: 400, label: "BUILD", detail: "Assembling the foundations..." },
      { time: 800, label: "AUTOMATE", detail: "Connecting the workflows..." },
      { time: 1200, label: "DEPLOY", detail: "Preparing the experience..." },
      { time: 1600, label: "MONITOR", detail: "Checking system readiness..." },
      { time: 2000, label: "EVOLVE", detail: "Almost ready..." }
    ];

    const letterSequence = [
      { time: 350, index: 1 },  // റ
      { time: 700, index: 2 },  // ர்
      { time: 1050, index: 3 }, // र
      { time: 1400, index: 4 }  // RITHU RAJ R
    ];

    showLetter(0);

    stages.forEach((stage, i) => {
      later(() => {
        if (dismissed) return;

        if (statusLabel) statusLabel.textContent = stage.label;
        if (statusDetail) statusDetail.textContent = stage.detail;

        const progress = Math.round(((i + 1) / stages.length) * 100);

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressBar) {
          progressBar.setAttribute("aria-valuenow", String(progress));
        }
      }, reducedMotion ? 0 : stage.time);
    });

    letterSequence.forEach(({ time, index }) => {
      later(() => showLetter(index), reducedMotion ? 0 : time);
    });

    later(() => {
      if (!dismissed) loader.classList.add("name-revealed");
    }, reducedMotion ? 0 : 1450);

    // One controlled dismissal; no duplicate sequence timers.
    later(dismiss, reducedMotion ? 900 : 2700);
  }

  resize();
  initParticles();
  render();
  window.addEventListener("resize", resize);

  startSequence();

  // Safety fallback if a script or animation fails.
  later(dismiss, 5000);
})();
