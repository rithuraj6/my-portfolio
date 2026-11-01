/**
 * Dynamic GitHub Repository Counter & Live Synchronizer
 * Animates numbers, pulls live data from `/api/github-stats/`, and supports
 * client-side instant project search and filtering.
 */
(function () {
  function animateValue(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * (end - start) + start);
      element.textContent = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }

  // Animate initial counters on page
  const statNumbers = document.querySelectorAll('.stat-value[data-count]');
  statNumbers.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    animateValue(el, 0, target, 1600);
  });

  // Client-side search filtering on projects page
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-repo-card');

  if (searchInput && projectCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      projectCards.forEach((card) => {
        const title = card.querySelector('.repo-name')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.repo-desc')?.textContent.toLowerCase() || '';
        const lang = card.querySelector('.repo-lang')?.textContent.toLowerCase() || '';

        if (title.includes(query) || desc.includes(query) || lang.includes(query)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countBadge = document.getElementById('visible-repo-count');
      if (countBadge) {
        countBadge.textContent = `${visibleCount} repositories shown`;
      }
    });
  }

  // Refresh dynamic GitHub count in background
  fetch('/api/github-stats/')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.public_repos !== undefined) {
        const repoCountEls = document.querySelectorAll('.dynamic-github-repo-count');
        repoCountEls.forEach((el) => {
          const current = parseInt(el.textContent, 10) || 0;
          if (current !== data.public_repos) {
            animateValue(el, current, data.public_repos, 1200);
          }
        });
      }
    })
    .catch((err) => {
      console.log('GitHub sync background note:', err.message);
    });
})();
