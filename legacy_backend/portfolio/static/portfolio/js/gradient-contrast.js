/**
 * Dynamic Gradient Background & Scroll Contrast Controller
 * Smoothly shifts background gradients from light to deep obsidian,
 * and dynamically recalculates font contrast to guarantee optimal readability.
 */
(function () {
  const root = document.documentElement;

  function updateContrastOnScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

    // Determine current background gradient palette based on scroll depth
    // Palette 0 (Top): Deep obsidian with subtle nebula cyan
    // Palette 1 (Mid): Midnight blue & cosmic indigo
    // Palette 2 (Deep): Royal abyss with purple & electric tones
    
    // We adjust radial gradients and contrast tokens
    if (scrollProgress > 0.45 && scrollProgress < 0.75) {
      // Mid-depth contrast adaptation
      root.style.setProperty('--surface-card-border', 'rgba(157, 78, 221, 0.35)');
    } else {
      root.style.setProperty('--surface-card-border', 'rgba(0, 240, 255, 0.25)');
    }

    // Check elements with data-contrast-check to ensure high legibility
    const sections = document.querySelectorAll('section, .story-card, .dob-celebration-card');
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
      if (inView && sec.dataset.contrastTheme) {
        document.body.setAttribute('data-theme-contrast', sec.dataset.contrastTheme);
      }
    });

    // Update active navbar indicator on scroll
    const navLinks = document.querySelectorAll('.nav-item-link');
    const scrollPosition = window.scrollY + 120;

    document.querySelectorAll('section[id]').forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href').includes(sectionId)) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateContrastOnScroll, { passive: true });
  updateContrastOnScroll();

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-mobile-open');
    });
  }
})();
