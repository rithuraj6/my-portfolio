/* ============================================================
   fx.js — Matrix rain background + cursor spotlight + scroll FX
   ============================================================ */
(() => {
  "use strict";

  /* ── 1. MATRIX RAIN ─────────────────────────────────────── */
  const canvas = document.getElementById("matrix-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // DevOps-flavoured glyphs: katakana + ASCII tech symbols
  const CHARS =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "01{}[]<>/|\\:;=+-*&%$#@!?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const FONT_SIZE = 15;          // px per cell
  const SPEED_MIN = 0.3;        // cells per frame (slow drip)
  const SPEED_MAX = 1.4;
  const TRAIL   = 24;           // length of bright trail
  const BASE_ALPHA = 0.13;      // canvas fade per frame → controls persistence
  const SPOTLIGHT_R = 180;      // px radius of cursor highlight
  const SPOTLIGHT_BRIGHT = 2.6; // multiplier for chars near cursor

  let cols, drops, speeds, trails;
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols   = Math.ceil(canvas.width / FONT_SIZE);
    drops  = new Float32Array(cols).fill(0);
    speeds = new Float32Array(cols).map(() => SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN));
    trails = Array.from({length: cols}, () =>
      Array.from({length: TRAIL}, () => ({
        char: randomChar(),
        alpha: 0,
        y: 0,
      }))
    );
    // scatter initial drop positions so the screen fills gradually
    for (let c = 0; c < cols; c++) drops[c] = -Math.random() * (canvas.height / FONT_SIZE);
  }

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function draw() {
    // Dim the whole canvas — lower alpha → longer trails
    ctx.fillStyle = `rgba(8,12,24,${BASE_ALPHA})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px "Space Grotesk", monospace`;
    ctx.textAlign = "center";

    for (let c = 0; c < cols; c++) {
      const x = c * FONT_SIZE + FONT_SIZE / 2;
      const headRow = Math.floor(drops[c]);

      // Distance from cursor for spotlight effect
      const headY   = headRow * FONT_SIZE;
      const dx = x - mouseX;
      const dy = headY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spotFactor = dist < SPOTLIGHT_R
        ? SPOTLIGHT_BRIGHT * (1 - dist / SPOTLIGHT_R)
        : 0;

      // Draw the trail (older cells fade out)
      for (let t = 0; t < TRAIL; t++) {
        const row = headRow - t;
        if (row < 0) continue;
        const fy = row * FONT_SIZE;
        const frac = 1 - t / TRAIL;          // 1=head, 0=tail

        // Check spotlight for each trail cell
        const tdx = x - mouseX;
        const tdy = fy - mouseY;
        const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
        const tf = tdist < SPOTLIGHT_R ? SPOTLIGHT_BRIGHT * (1 - tdist / SPOTLIGHT_R) : 0;

        if (t === 0) {
          // Bright head — white or cyan depending on spotlight
          if (tf > 0.6) {
            ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.9 + tf * 0.1)})`;
          } else {
            ctx.fillStyle = `rgba(23,224,255,0.95)`;
          }
        } else {
          // Trail body — cyan → blue gradient with spotlight boost
          const baseG = Math.round(140 + 115 * frac);           // 140–255 green channel
          const alpha = frac * (0.55 + tf * 0.35);
          if (tf > 0.5) {
            // Near cursor: shift toward electric cyan/white
            const r = Math.round(23 + 232 * tf * frac);
            const g = Math.round(baseG + (255 - baseG) * tf * 0.7);
            const b = Math.round(255);
            ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, alpha)})`;
          } else {
            ctx.fillStyle = `rgba(23,${baseG},255,${Math.min(0.85, alpha)})`;
          }
        }

        // Randomly mutate chars for the living rain effect
        const charToShow = Math.random() < 0.04 ? randomChar() : CHARS[((c * TRAIL + t) * 7 + headRow) % CHARS.length];
        ctx.fillText(charToShow, x, fy);
      }

      // Advance drop
      drops[c] += speeds[c];
      if (drops[c] * FONT_SIZE > canvas.height + TRAIL * FONT_SIZE) {
        drops[c] = -Math.floor(Math.random() * 20);
        speeds[c] = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      }
    }

    requestAnimationFrame(draw);
  }

  // Track cursor globally (works across all scroll positions)
  window.addEventListener("pointermove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  window.addEventListener("resize", resize);
  resize();

  // Don't start animation while loader is visible
  const loaderEl = document.getElementById("loader");
  if (loaderEl) {
    const mo = new MutationObserver(() => {
      if (loaderEl.classList.contains("gone")) {
        mo.disconnect();
        requestAnimationFrame(draw);
      }
    });
    mo.observe(loaderEl, { attributes: true, attributeFilter: ["class"] });
  } else {
    requestAnimationFrame(draw);
  }

  /* ── 2. SCROLL FX (progress bar, hero drift, smart nav, stagger, parallax, tilt, spotlight, magnetic) ── */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine   = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const $      = s => document.querySelector(s);
  const $$     = s => [...document.querySelectorAll(s)];
  const clamp  = (v, a, b) => Math.min(b, Math.max(a, v));

  // Scroll progress bar
  const bar = document.createElement("div");
  bar.id = "prog";
  document.body.appendChild(bar);

  // Stagger groups
  ["#work .proj", ".sk", ".xp", ".rg", ".soc"].forEach(sel => {
    $$(sel).forEach(g => {
      g.classList.add("stg");
      g.classList.remove("rv");
      [...g.children].forEach((c, i) => c.style.setProperty("--si", i));
    });
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$(".stg").forEach(el => io.observe(el));
  const rg = $("#rg"); if (rg) rg.classList.add("in");

  // Tilt + spotlight
  if (fine && !reduce) {
    $$(".card, .rc").forEach(el => {
      el.classList.add("tilt");
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 8 + "deg");
        el.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - .5)) * 8 + "deg");
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
    document.addEventListener("pointermove", e => {
      const rc = e.target.closest && e.target.closest(".rc");
      if (rc && !rc.classList.contains("tilt")) rc.classList.add("tilt");
    }, { passive: true });
    $$(".pr").forEach(el => el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }));
    // Magnetic buttons
    $$(".btn.p, .cta").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  // Scroll-driven rAF loop
  const hero  = $("header.hero .wrap");
  const ph    = $("#ph");
  const steps = $(".steps");
  const nav   = $("#nav");
  let lastY = scrollY, ticking = false;

  function frame() {
    ticking = false;
    const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (!reduce) {
      if (hero) {
        const k = clamp(y / (vh * .9), 0, 1);
        hero.style.transform = `translateY(${k * 90}px) scale(${1 - k * .06})`;
        hero.style.opacity = 1 - k * 1.1;
      }
      if (ph) {
        const r = ph.getBoundingClientRect();
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        ph.style.translate = `0 ${clamp(c, -1, 1) * -36}px`;
      }
      if (steps) {
        const r = steps.getBoundingClientRect();
        steps.style.setProperty("--sp", clamp((vh * .7 - r.top) / r.height, 0, 1).toFixed(3));
      }
    }
    if (nav) nav.classList.toggle("hide", y > lastY && y > 240);
    lastY = y;
  }

  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);
  frame();
})();
