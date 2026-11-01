/**
 * Cinematic DevOps Kernel Boot & Identity Intro
 * Telemetry sequence: OBSERVE → COMPOSE → SECURE → DEPLOY → MONITOR
 */
(() => {
  "use strict";

  const bootloader = document.getElementById("intro-bootloader");
  if (!bootloader) return;

  const logsContainer = document.getElementById("bootloader-logs");
  const progressFill = document.getElementById("bootloader-progress-fill");
  const progressText = document.getElementById("bootloader-progress-text");
  const skipBtn = document.getElementById("bootloader-skip-btn");

  const bootMessages = [
    { tag: "[OK]", text: "Initializing kernel & hardware probes..." },
    { tag: "[OK]", text: "Mounting immutable cloud architecture..." },
    { tag: "[OK]", text: "Verifying Kubernetes cluster health [12/12 nodes online]" },
    { tag: "[OK]", text: "Running Trivy DevSecOps vulnerability audit [0 vulnerabilities]" },
    { tag: "[OK]", text: "Pulling GitOps manifests via Argo CD..." },
    { tag: "[OK]", text: "Loading telemetry matrices & Prometheus collectors..." },
    { tag: "[OK]", text: "Resolving identity: RITHU RAJ R [Civil Eng → DevOps]" },
    { tag: "[STATUS]", text: "Systems nominal. Welcome to the terminal." }
  ];

  let currentStep = 0;
  let isDismissed = false;

  function dismissBootloader() {
    if (isDismissed) return;
    isDismissed = true;
    bootloader.classList.add("bootloader-hidden");
    sessionStorage.setItem("devops_intro_seen", "true");
    setTimeout(() => {
      bootloader.style.display = "none";
    }, 650);
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", dismissBootloader);
  }

  // Keyboard shortcut: Escape or Space to skip
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.code === "Space") {
      dismissBootloader();
    }
  });

  // If already seen in this session, make it ultra-fast or let it run a snappy micro-boot
  const alreadySeen = sessionStorage.getItem("devops_intro_seen") === "true";
  const stepDelay = alreadySeen ? 120 : 250;

  function stepBoot() {
    if (isDismissed) return;

    if (currentStep < bootMessages.length) {
      const msg = bootMessages[currentStep];
      const entry = document.createElement("div");
      entry.className = "log-entry";
      entry.innerHTML = `<span class="log-tag">${msg.tag}</span><span class="log-text">${msg.text}</span>`;
      if (logsContainer) {
        logsContainer.appendChild(entry);
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }

      currentStep++;
      const percent = Math.round((currentStep / bootMessages.length) * 100);
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (progressText) progressText.innerText = `${percent}%`;

      setTimeout(stepBoot, stepDelay);
    } else {
      setTimeout(dismissBootloader, 400);
    }
  }

  // Start sequence
  setTimeout(stepBoot, 100);
})();

