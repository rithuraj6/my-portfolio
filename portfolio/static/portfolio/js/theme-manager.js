(() => {
  "use strict";

  const KEY = "rithu-theme-preference";
  const button = () => document.getElementById("theme-toggle");

  function preference() {
    try {
      const saved = localStorage.getItem(KEY);
      return ["auto", "light", "dark"].includes(saved) ? saved : "auto";
    } catch {
      return "auto";
    }
  }

  function applyTheme(mode) {
    const hour = new Date().getHours();
    const theme = mode === "auto"
      ? (hour >= 7 && hour < 19 ? "light" : "dark")
      : mode;

    document.documentElement.dataset.theme = theme;

    const btn = button();
    if (btn) {
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = theme === "dark" ? "ri-moon-line" : "ri-sun-line";
      }
      btn.title = `Theme: ${mode}. Click to cycle Auto → Light → Dark.`;
      btn.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  function init() {
    let mode = preference();
    applyTheme(mode);

    const btn = button();
    if (btn && !btn.dataset.themeBound) {
      btn.dataset.themeBound = "true";

      btn.addEventListener("click", () => {
        mode = ({ auto: "light", light: "dark", dark: "auto" })[mode];

        try {
          localStorage.setItem(KEY, mode);
        } catch {
          // Theme still works for the current page.
        }

        applyTheme(mode);
      });
    }

    window.setInterval(() => {
      if (mode === "auto") applyTheme("auto");
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
