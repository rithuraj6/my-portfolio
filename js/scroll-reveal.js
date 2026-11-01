/**
 * Scroll Reveal Animations
 * Smooth scroll-triggered animations using Intersection Observer API.
 * Includes: reveal, stagger, counter, typing, and parallax effects.
 */
(function () {
  "use strict";

  /* -------------------------------------------------- */
  /*  Reduced-motion preference                         */
  /* -------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -------------------------------------------------- */
  /*  References kept for cleanup                       */
  /* -------------------------------------------------- */
  let revealObserver = null;
  let staggerObserver = null;
  let counterObserver = null;
  let typeObserver = null;
  let parallaxElements = [];
  let parallaxRafId = null;

  /* ================================================== */
  /*  1. Basic Reveal Observer                          */
  /* ================================================== */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach(function (el) {
        el.classList.add("revealed");
      });
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    targets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ================================================== */
  /*  2. Stagger Effect for Grid Children               */
  /* ================================================== */
  function initStagger() {
    const containers = document.querySelectorAll(".stagger-children");
    if (!containers.length) return;

    if (prefersReducedMotion) {
      containers.forEach(function (container) {
        Array.from(container.children).forEach(function (child) {
          child.classList.add("revealed");
        });
      });
      return;
    }

    staggerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    containers.forEach(function (container) {
      var children = Array.from(container.children);
      children.forEach(function (child, index) {
        child.style.transitionDelay = index * 80 + "ms";
        staggerObserver.observe(child);
      });
    });
  }

  /* ================================================== */
  /*  3. Counter Animation                              */
  /* ================================================== */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var isFloat = target % 1 !== 0;
    var duration = 1500; // 1.5s
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = easedProgress * target;

      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isFloat ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".count-up[data-target]");
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute("data-target")) || 0;
        el.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
      });
      return;
    }

    counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    counters.forEach(function (el) {
      el.textContent = "0";
      counterObserver.observe(el);
    });
  }

  /* ================================================== */
  /*  4. Text Typing Effect                             */
  /* ================================================== */
  function typeText(el) {
    var fullText = el.getAttribute("data-text") || el.textContent;
    el.setAttribute("data-text", fullText);
    el.textContent = "";
    el.classList.add("typing-active");

    var charIndex = 0;
    var interval = setInterval(function () {
      if (charIndex < fullText.length) {
        el.textContent = fullText.substring(0, charIndex + 1);
        charIndex++;
      } else {
        clearInterval(interval);
        el.classList.remove("typing-active");
        el.classList.add("typing-done");
      }
    }, 40);
  }

  function initTypeText() {
    var elements = document.querySelectorAll(".type-text");
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(function (el) {
        el.classList.add("typing-done");
      });
      return;
    }

    /* Store original text before clearing */
    elements.forEach(function (el) {
      el.setAttribute("data-text", el.textContent);
    });

    typeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            typeText(entry.target);
            typeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach(function (el) {
      typeObserver.observe(el);
    });
  }

  /* ================================================== */
  /*  5. Parallax Subtle Scroll                         */
  /* ================================================== */
  function handleParallax() {
    var scrollY = window.scrollY;
    parallaxElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var elCenter = rect.top + rect.height / 2;
      var viewCenter = window.innerHeight / 2;
      var offset = (elCenter - viewCenter) * 0.1;
      el.style.transform = "translateY(" + offset + "px)";
    });

    parallaxRafId = requestAnimationFrame(handleParallax);
  }

  function initParallax() {
    parallaxElements = Array.from(
      document.querySelectorAll(".parallax-subtle")
    );
    if (!parallaxElements.length || prefersReducedMotion) return;

    parallaxRafId = requestAnimationFrame(handleParallax);
  }

  /* ================================================== */
  /*  Cleanup on page unload                            */
  /* ================================================== */
  function cleanup() {
    if (revealObserver) revealObserver.disconnect();
    if (staggerObserver) staggerObserver.disconnect();
    if (counterObserver) counterObserver.disconnect();
    if (typeObserver) typeObserver.disconnect();
    if (parallaxRafId) cancelAnimationFrame(parallaxRafId);
  }

  window.addEventListener("beforeunload", cleanup);

  /* ================================================== */
  /*  Initialise on DOMContentLoaded                    */
  /* ================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initStagger();
    initCounters();
    initTypeText();
    initParallax();
  });
})();
