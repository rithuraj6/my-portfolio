(() => {
  "use strict";

  const canvas = document.getElementById("antigravity-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const config = {
    count: 125,
    speed: 1.15,
    neighborRadius: 85,
    separationRadius: 22,
    alignment: 0.035,
    cohesion: 0.012,
    separation: 0.065,
    cursorRadius: 155,
    cursorForce: 0.95,
    maxSpeed: 1.55,
    minSpeed: 0.45
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let fish = [];
  let frame = null;
  let lastTime = 0;
  let isDark = root.dataset.theme === "dark";

  const pointer = {
    x: -1000,
    y: -1000,
    active: false
  };

  const random = (min, max) => Math.random() * (max - min) + min;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
      config.count,
      Math.max(45, Math.floor((width * height) / 9500))
    );

    fish = Array.from({ length: count }, (_, i) => {
      const angle = random(0, Math.PI * 2);
      const speed = random(config.minSpeed, config.maxSpeed);

      return {
        x: random(0, width),
        y: random(0, height),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        phase: random(0, Math.PI * 2),
        size: random(1.1, 2.1),
        group: Math.floor(i / 10)
      };
    });
  }

  function movePointer(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }

  function leavePointer() {
    pointer.active = false;
    pointer.x = -1000;
    pointer.y = -1000;
  }

  function wrap(f) {
    const margin = 12;

    if (f.x < -margin) f.x = width + margin;
    if (f.x > width + margin) f.x = -margin;
    if (f.y < -margin) f.y = height + margin;
    if (f.y > height + margin) f.y = -margin;
  }

  function update(time, delta) {
    const step = Math.min(delta / 16.67, 1.8);

    // Slow, shared currents make the school flow like a living wave.
    const currentX = Math.sin(time * 0.00022) * 0.12;
    const currentY = Math.cos(time * 0.00018) * 0.10;

    // Calculate flocking forces from the same frame snapshot.
    const next = fish.map((f) => {
      let centerX = 0;
      let centerY = 0;
      let velocityX = 0;
      let velocityY = 0;
      let separateX = 0;
      let separateY = 0;
      let neighbors = 0;

      for (const other of fish) {
        if (other === f) continue;

        const dx = other.x - f.x;
        const dy = other.y - f.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < config.neighborRadius ** 2) {
          centerX += other.x;
          centerY += other.y;
          velocityX += other.vx;
          velocityY += other.vy;
          neighbors++;

          if (
            distanceSquared > 0 &&
            distanceSquared < config.separationRadius ** 2
          ) {
            separateX -= dx / distanceSquared;
            separateY -= dy / distanceSquared;
          }
        }
      }

      let ax = currentX + Math.sin(time * 0.00035 + f.phase) * 0.035;
      let ay = currentY + Math.cos(time * 0.00029 + f.phase) * 0.035;

      if (neighbors > 0) {
        // Cohesion: gently gather into a school.
        ax += ((centerX / neighbors - f.x) * config.cohesion);
        ay += ((centerY / neighbors - f.y) * config.cohesion);

        // Alignment: follow the direction of nearby fish.
        ax += ((velocityX / neighbors - f.vx) * config.alignment);
        ay += ((velocityY / neighbors - f.vy) * config.alignment);
      }

      // Separation: leave room between neighbors.
      ax += separateX * config.separation;
      ay += separateY * config.separation;

      // Cursor disturbance: fish bend around the moving pointer.
      const px = f.x - pointer.x;
      const py = f.y - pointer.y;
      const distance = Math.sqrt(px * px + py * py);

      if (pointer.active && distance > 0 && distance < config.cursorRadius) {
        const influence = 1 - distance / config.cursorRadius;
        const force = influence * config.cursorForce;

        ax += (px / distance) * force;
        ay += (py / distance) * force;

        // A sideways current creates a wave instead of a simple push.
        ax += (-py / distance) * force * 0.42;
        ay += (px / distance) * force * 0.42;
      }

      let vx = f.vx + ax * step;
      let vy = f.vy + ay * step;

      // Limit speed so the movement stays fluid.
      const speed = Math.hypot(vx, vy) || 1;
      const limitedSpeed = Math.max(
        config.minSpeed,
        Math.min(config.maxSpeed, speed)
      );

      vx = (vx / speed) * limitedSpeed;
      vy = (vy / speed) * limitedSpeed;

      return {
        ...f,
        x: f.x + vx * step * config.speed,
        y: f.y + vy * step * config.speed,
        vx,
        vy
      };
    });

    fish = next;
    fish.forEach(wrap);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Keep particles monochrome and automatically contrast with the theme.
    const color = isDark ? "255,255,255" : "20,20,20";

    // Subtle links give the school a connected, flowing structure.
    ctx.lineWidth = 0.7;

    for (let i = 0; i < fish.length; i++) {
      const a = fish[i];

      for (let j = i + 1; j < fish.length; j++) {
        const b = fish[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 48) {
          const alpha = (1 - distance / 48) * 0.13;
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw each particle as a tiny directional fish-like dash.
    for (const f of fish) {
      const angle = Math.atan2(f.vy, f.vx);
      const length = f.size * 2.8;

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(angle);

      ctx.strokeStyle = `rgba(${color},0.78)`;
      ctx.lineWidth = f.size;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(-length, 0);
      ctx.lineTo(length, 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  function animate(time) {
    if (document.hidden) {
      frame = null;
      return;
    }

    const delta = lastTime ? Math.min(time - lastTime, 32) : 16.67;
    lastTime = time;

    update(time, delta);
    draw();

    if (!reducedMotion.matches) {
      frame = requestAnimationFrame(animate);
    } else {
      frame = null;
    }
  }

  function start() {
    if (frame !== null) cancelAnimationFrame(frame);

    lastTime = 0;

    if (reducedMotion.matches) {
      draw();
      return;
    }

    frame = requestAnimationFrame(animate);
  }

  // Respond immediately when the existing theme manager changes the theme.
  new MutationObserver(() => {
    isDark = root.dataset.theme === "dark";
    draw();
  }).observe(root, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });

  window.addEventListener("resize", () => {
    resize();
    start();
  }, { passive: true });

  window.addEventListener("pointermove", movePointer, { passive: true });
  window.addEventListener("pointerleave", leavePointer, { passive: true });
  window.addEventListener("blur", leavePointer);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    } else {
      start();
    }
  });

  reducedMotion.addEventListener?.("change", start);

  resize();
  start();
})();
