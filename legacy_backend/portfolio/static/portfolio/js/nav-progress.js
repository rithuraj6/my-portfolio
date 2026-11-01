(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const main = document.querySelector("main.page-home");

  if (!header || !main) return;

  // Create the progress track automatically.
  let track = header.querySelector(".nav-progress-track");

  if (!track) {
    track = document.createElement("div");
    track.className = "nav-progress-track";
    track.setAttribute("aria-hidden", "true");

    const bar = document.createElement("div");
    bar.className = "nav-progress-bar";

    const glow = document.createElement("div");
    glow.className = "nav-progress-glow";

    bar.appendChild(glow);
    track.appendChild(bar);
    header.appendChild(track);
  }

  const bar = track.querySelector(".nav-progress-bar");
  const navLinks = Array.from(
    header.querySelectorAll(".nav-links a, .nav-container a")
  );

  function getPanels() {
    return Array.from(
      main.querySelectorAll(":scope > .presentation-panel")
    );
  }

  function getActivePanel() {
    return getPanels().find(panel =>
      panel.classList.contains("is-active")
    );
  }

  function getTargetPanel(link, panels) {
    try {
      const url = new URL(link.href, window.location.href);

      if (url.pathname !== window.location.pathname || !url.hash) {
        return null;
      }

      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1))
      );

      if (!target || !main.contains(target)) return null;

      return target.matches(".presentation-panel")
        ? target
        : target.closest(".presentation-panel");
    } catch {
      return null;
    }
  }

  function updateProgress() {
    const panels = getPanels();
    const active = getActivePanel();

    if (!panels.length || !active) return;

    const index = panels.indexOf(active);
    if (index < 0) return;

    const progress = panels.length > 1
      ? (index / (panels.length - 1)) * 100
      : 100;

    bar.style.width = `${progress}%`;
    track.setAttribute(
      "aria-label",
      `Portfolio progress: section ${index + 1} of ${panels.length}`
    );

    navLinks.forEach(link => {
      const targetPanel = getTargetPanel(link, panels);
      const isActive = targetPanel === active;

      link.classList.toggle("nav-section-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // The presentation controller changes is-active on every transition.
  const observer = new MutationObserver(updateProgress);

  observer.observe(main, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"]
  });

  // Keep the current section highlighted after direct navbar navigation.
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      window.setTimeout(updateProgress, 100);
      window.setTimeout(updateProgress, 1200);
    });
  });

  window.addEventListener("resize", updateProgress);

  updateProgress();
})();
