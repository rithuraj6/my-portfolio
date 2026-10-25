/**
 * Venom Symbiote & Magnetic Button Physics
 * Features:
 * - Magnetic pull attraction when mouse enters detection radius (130px)
 * - Canvas-rendered organic Venom symbiote tendrils reaching out and latching to the cursor
 * - Viscous fluid recoil and snapping physics
 */
(function () {
  const canvas = document.getElementById('symbiote-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let mouseX = -1000;
  let mouseY = -1000;
  let isMouseActive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
  });

  window.addEventListener('mouseout', () => {
    isMouseActive = false;
    mouseX = -1000;
    mouseY = -1000;
  });

  // Track all magnetic buttons on page
  const magneticItems = [];
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach((btn) => {
    magneticItems.push({
      element: btn,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      radius: 120, // Magnetic & symbiote trigger radius
      isAttached: false,
      tendrilPhase: Math.random() * 10,
    });
  });

  let time = 0;

  function drawTendril(startX, startY, endX, endY, progress, strandIndex, totalStrands) {
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    const segments = 12;
    const spread = (strandIndex - (totalStrands - 1) / 2) * 14;

    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      // Linear interpolation
      let px = startX + dx * t;
      let py = startY + dy * t;

      // Organic wavy vibration (Venom symbiote twitching)
      const wave = Math.sin(time * 8 + t * Math.PI * 3 + strandIndex) * (1 - Math.abs(t - 0.5) * 2) * (dist * 0.12);
      const perpX = -dy / (dist || 1);
      const perpY = dx / (dist || 1);

      px += perpX * (wave + spread * (1 - t));
      py += perpY * (wave + spread * (1 - t));

      ctx.lineTo(px, py);
    }

    // Tendril slime thickness & color
    const baseWidth = Math.max(1.8, 6 * (1 - dist / 140));
    ctx.lineWidth = strandIndex === 1 ? baseWidth * 1.4 : baseWidth * 0.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Dark symbiote core with iridescent violet/cyan sheen
    ctx.strokeStyle = strandIndex % 2 === 0 ? '#0a0914' : '#1a0c2e';
    ctx.shadowColor = '#9d4edd';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Secondary slime node highlight
    if (dist < 90 && strandIndex === 1) {
      const midT = 0.5 + Math.sin(time * 4) * 0.2;
      const bulbX = startX + dx * midT;
      const bulbY = startY + dy * midT;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, Math.max(2, 4 * (1 - dist / 140)), 0, Math.PI * 2);
      ctx.fillStyle = '#7928ca';
      ctx.fill();
    }

    ctx.restore();
  }

  function renderSymbiote() {
    ctx.clearRect(0, 0, width, height);
    time += 0.03;

    magneticItems.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from button center to mouse
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < item.radius && isMouseActive) {
        item.isAttached = true;
        // Magnetic displacement factor
        const pullStrength = 0.38;
        item.targetX = dx * pullStrength;
        item.targetY = dy * pullStrength;

        // Draw multiple living symbiote tendrils
        const strandCount = 3;
        for (let s = 0; s < strandCount; s++) {
          // Compute anchor perimeter point
          const angle = Math.atan2(dy, dx) + (s - 1) * 0.35;
          const anchorX = centerX + Math.cos(angle) * (rect.width / 2 - 2);
          const anchorY = centerY + Math.sin(angle) * (rect.height / 2 - 2);

          drawTendril(anchorX, anchorY, mouseX, mouseY, 1 - dist / item.radius, s, strandCount);
        }

        // Draw droplet latch at mouse cursor tip
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0914';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
      } else {
        item.isAttached = false;
        item.targetX = 0;
        item.targetY = 0;
      }

      // Spring physics interpolation
      item.currentX += (item.targetX - item.currentX) * 0.18;
      item.currentY += (item.targetY - item.currentY) * 0.18;

      // Apply magnetic transform to button
      item.element.style.transform = `translate3d(${item.currentX.toFixed(2)}px, ${item.currentY.toFixed(2)}px, 0)`;
    });

    requestAnimationFrame(renderSymbiote);
  }

  renderSymbiote();
})();
