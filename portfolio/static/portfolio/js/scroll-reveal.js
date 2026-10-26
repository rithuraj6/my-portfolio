(() => {
  "use strict";

  const main = document.querySelector("main.page-home");
  if (!main) return;

  const header = document.querySelector(".site-header");
  const sections = Array.from(main.children).filter(
    (element) =>
      element.tagName === "SECTION" &&
      element.id
  );

  if (!sections.length) return;

  // Activate presentation mode only on the homepage.
  document.body.classList.add("home-presentation");

  sections.forEach((section, index) => {
    section.classList.add("presentation-panel");
    section.setAttribute("aria-label", `Section ${index + 1}`);
    section.setAttribute("aria-hidden", "true");
  });

  let activeIndex = 0;
  let isTransitioning = false;
  let transitionTimer = null;
  let wheelAccumulator = 0;
  let wheelResetTimer = null;
  let touchStartY = 0;

  const transitionDuration = 1150;
  const wheelThreshold = 65;

  function updateHeaderHeight() {
    const height = header ? header.offsetHeight : 80;
    document.documentElement.style.setProperty(
      "--presentation-header-height",
      `${height}px`
    );
  }

  function activate(index, options = {}) {
    const { force = false, updateHash = false } = options;

    if (index < 0 || index >= sections.length) return;
    if (index === activeIndex && !force) return;
    if (isTransitioning && !force) return;

    clearTimeout(transitionTimer);
    isTransitioning = true;

    const previous = sections[activeIndex];
    const next = sections[index];

    if (previous) {
      previous.classList.remove("is-active");
      previous.classList.add("is-leaving");
      previous.setAttribute("aria-hidden", "true");
      previous.inert = true;
    }

    activeIndex = index;

    next.scrollTop = 0;
    next.inert = false;
    next.setAttribute("aria-hidden", "false");

    // Force a style calculation so the entrance transition starts reliably.
    void next.offsetWidth;

    next.classList.add("is-active");
    next.classList.remove("is-leaving");

    if (updateHash && next.id) {
      history.replaceState(null, "", `#${next.id}`);
    }

    transitionTimer = setTimeout(() => {
      if (previous) previous.classList.remove("is-leaving");
      isTransitioning = false;
    }, transitionDuration);
  }

  function activeSection() {
    return sections[activeIndex];
  }

  function canScrollInside(section, direction) {
    const hasOverflow =
      section.scrollHeight > section.clientHeight + 2;

    if (!hasOverflow) return false;

    if (direction > 0) {
      return (
        section.scrollTop + section.clientHeight <
        section.scrollHeight - 2
      );
    }

    return section.scrollTop > 2;
  }

  function move(direction) {
    if (isTransitioning) return;

    const section = activeSection();

    // Let long sections scroll internally before switching panels.
    if (canScrollInside(section, direction)) {
      section.scrollBy({
        top: direction * Math.max(120, section.clientHeight * 0.65),
        behavior: "smooth"
      });
      return;
    }

    activate(activeIndex + direction);
  }

  // Scroll wheel: accumulate small trackpad movements into one transition.
  window.addEventListener(
    "wheel",
    (event) => {
      if (!document.body.classList.contains("home-presentation")) return;

      if (
        event.target.closest(
          ".contact-modal, .mobile-menu-btn, input, textarea, select"
        )
      ) {
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      const section = activeSection();

      if (canScrollInside(section, direction)) {
        event.preventDefault();
        section.scrollTop += event.deltaY;
        return;
      }

      event.preventDefault();
      if (isTransitioning) return;

      wheelAccumulator += event.deltaY;
      clearTimeout(wheelResetTimer);

      wheelResetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 180);

      if (Math.abs(wheelAccumulator) >= wheelThreshold) {
        const step = Math.sign(wheelAccumulator);
        wheelAccumulator = 0;
        move(step);
      }
    },
    { passive: false }
  );

  // Keyboard navigation.
  window.addEventListener("keydown", (event) => {
    if (!document.body.classList.contains("home-presentation")) return;

    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.matches("input, textarea, select, [contenteditable='true']")
    ) {
      return;
    }

    if (["ArrowDown", "PageDown"].includes(event.key)) {
      event.preventDefault();
      move(1);
    } else if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      activate(0);
    } else if (event.key === "End") {
      event.preventDefault();
      activate(sections.length - 1);
    }
  });

  // Touch support for phones and tablets.
  window.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length === 1) {
        touchStartY = event.touches[0].clientY;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (!document.body.classList.contains("home-presentation")) return;
      if (event.changedTouches.length !== 1) return;

      const difference =
        touchStartY - event.changedTouches[0].clientY;

      if (Math.abs(difference) < 65 || isTransitioning) return;

      const direction = Math.sign(difference);
      const section = activeSection();

      if (canScrollInside(section, direction)) {
        section.scrollBy({
          top: direction * Math.max(120, section.clientHeight * 0.65),
          behavior: "smooth"
        });
      } else {
        move(direction);
      }
    },
    { passive: true }
  );

  // Make navbar anchor links transition to their corresponding panel.
  document.querySelectorAll('.site-header a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1))
      );

      if (!target || !main.contains(target)) return;

      const panel = target.matches(".presentation-panel")
        ? target
        : target.closest(".presentation-panel");

      if (!panel) return;

      event.preventDefault();
      activate(sections.indexOf(panel), { updateHash: true });

      if (target !== panel) {
        setTimeout(() => {
          const offset =
            target.getBoundingClientRect().top -
            panel.getBoundingClientRect().top;

          panel.scrollTo({
            top: panel.scrollTop + offset - 24,
            behavior: "smooth"
          });
        }, transitionDuration);
      }
    });
  });

  // Initial panel: use a matching section hash when possible.
  updateHeaderHeight();

  const initialHash = decodeURIComponent(
    window.location.hash.slice(1)
  );

  const hashTarget = initialHash
    ? document.getElementById(initialHash)
    : null;

  const initialPanel = hashTarget
    ? hashTarget.matches(".presentation-panel")
      ? hashTarget
      : hashTarget.closest(".presentation-panel")
    : null;

  sections.forEach((section) => {
    section.classList.remove("is-active", "is-leaving");
    section.inert = true;
    section.setAttribute("aria-hidden", "true");
  });

  activeIndex = initialPanel
    ? Math.max(0, sections.indexOf(initialPanel))
    : 0;

  sections[activeIndex].inert = false;
  sections[activeIndex].setAttribute("aria-hidden", "false");
  sections[activeIndex].classList.add("is-active");

  if (hashTarget && initialPanel && hashTarget !== initialPanel) {
    requestAnimationFrame(() => {
      const offset =
        hashTarget.getBoundingClientRect().top -
        initialPanel.getBoundingClientRect().top;

      initialPanel.scrollTop = Math.max(0, offset - 24);
    });
  }

  window.addEventListener("resize", updateHeaderHeight);

  // Respect reduced-motion preferences.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reduce-presentation-motion");
  }
})();
