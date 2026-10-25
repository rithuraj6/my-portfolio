/**
 * Real-Time DOB Celebration Countdown Ticker
 * Calculates precise Days, Hours, Minutes, and Seconds remaining
 * until the next birthday celebration.
 */
(function () {
  const tickerContainer = document.getElementById('bday-countdown-ticker');
  if (!tickerContainer) return;

  const targetDateStr = tickerContainer.getAttribute('data-target-date');
  if (!targetDateStr) return;

  const daysEl = document.getElementById('bday-days');
  const hoursEl = document.getElementById('bday-hours');
  const minsEl = document.getElementById('bday-mins');
  const secsEl = document.getElementById('bday-secs');

  // Next celebration timestamp (midnight local time)
  const targetDate = new Date(`${targetDateStr}T00:00:00`).getTime();

  function updateTicker() {
    const now = new Date().getTime();
    let difference = targetDate - now;

    // If target has passed this year, advance to next year
    if (difference <= 0) {
      if (Math.abs(difference) < 24 * 60 * 60 * 1000) {
        // Today is celebration day!
        if (daysEl) daysEl.textContent = '🎉';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        const note = document.querySelector('.celebration-target');
        if (note) note.textContent = "🎂 It's celebration day today! Happy Birthday!";
        return;
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) {
      secsEl.textContent = String(secs).padStart(2, '0');
      secsEl.classList.remove('pulse-tick');
      void secsEl.offsetWidth; // Trigger reflow
      secsEl.classList.add('pulse-tick');
    }
  }

  updateTicker();
  setInterval(updateTicker, 1000);
})();
