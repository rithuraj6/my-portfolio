/**
 * Main Application Orchestration
 * Sticky navbar, scrollspy, live local clock, mobile navigation, and clipboard tools.
 */
(() => {
  "use strict";

  const nav = document.getElementById("site-nav");
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const links = document.querySelectorAll(".nav-link");
  const localClock = document.getElementById("nav-local-clock");

  // Sticky Navbar
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const isOpen = navLinks.classList.contains("active");
      mobileToggle.innerHTML = isOpen ? `<i class="ri-close-line"></i>` : `<i class="ri-menu-4-line"></i>`;
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        if (mobileToggle) mobileToggle.innerHTML = `<i class="ri-menu-4-line"></i>`;
      });
    });
  }

  // ScrollSpy Active Link Tracking
  const sections = document.querySelectorAll("section[id]");
  function updateScrollSpy() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", updateScrollSpy);
  updateScrollSpy();

  // Live Local Time Clock (IST / Asia/Kolkata)
  function updateNavClock() {
    if (!localClock) return;
    try {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      localClock.innerText = `${formatter.format(new Date())} IST`;
    } catch {
      const now = new Date();
      localClock.innerText = now.toTimeString().substring(0, 8);
    }
  }
  updateNavClock();
  setInterval(updateNavClock, 1000);

  // Copy helper (for email or curl command)
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const text = el.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
        const originalHtml = el.innerHTML;
        el.innerHTML = `<i class="ri-check-line" style="color:var(--glow-emerald)"></i> <span>COPIED!</span>`;
        setTimeout(() => {
          el.innerHTML = originalHtml;
        }, 1800);
      } catch (e) {
        console.error("Clipboard copy failed", e);
      }
    });
  });
})();
