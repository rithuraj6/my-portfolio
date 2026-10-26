/**
 * Birthday Countdown Ticker + Time on Earth Counter
 * - Countdown: Days, Hours, Minutes, Seconds until next birthday
 * - Time on Earth: Total days and hours lived since birth (born at 7 AM)
 * - Smooth animated transitions on number changes
 */
(function () {
  const tickerContainer = document.getElementById('bday-countdown-ticker');
  if (!tickerContainer) return;

  const targetDateStr = tickerContainer.getAttribute('data-target-date');
  const birthDatetimeStr = tickerContainer.getAttribute('data-birth-datetime');
  if (!targetDateStr) return;

  // Countdown elements
  const daysEl = document.getElementById('bday-days');
  const hoursEl = document.getElementById('bday-hours');
  const minsEl = document.getElementById('bday-mins');
  const secsEl = document.getElementById('bday-secs');

  // Time on Earth elements
  const earthDaysEl = document.getElementById('earth-days');
  const earthHoursEl = document.getElementById('earth-hours');
  const earthMinsEl = document.getElementById('earth-mins');
  const earthSecsEl = document.getElementById('earth-secs');

  // Next celebration timestamp (midnight local time)
  const targetDate = new Date(`${targetDateStr}T00:00:00`).getTime();

  // Birth datetime (7 AM on April 28, 2000)
  const birthDatetime = birthDatetimeStr
    ? new Date(birthDatetimeStr).getTime()
    : new Date('2000-04-28T07:00:00').getTime();

  // Track previous values for animation
  let prevValues = {};

  function animateChange(el, newValue, key) {
    if (!el) return;
    const prev = prevValues[key];
    if (prev !== newValue) {
      el.textContent = newValue;
      el.classList.remove('tick-flip');
      // Force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('tick-flip');
      prevValues[key] = newValue;
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    let difference = targetDate - now;

    // If target has passed this year
    if (difference <= 0) {
      if (Math.abs(difference) < 24 * 60 * 60 * 1000) {
        // Today is celebration day!
        animateChange(daysEl, '🎉', 'cd');
        animateChange(hoursEl, '00', 'ch');
        animateChange(minsEl, '00', 'cm');
        animateChange(secsEl, '00', 'cs');
        const note = document.querySelector('.celebration-target');
        if (note) note.textContent = "🎂 It's celebration day today! Happy Birthday!";
        return;
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((difference % (1000 * 60)) / 1000);

    animateChange(daysEl, String(days).padStart(2, '0'), 'cd');
    animateChange(hoursEl, String(hours).padStart(2, '0'), 'ch');
    animateChange(minsEl, String(mins).padStart(2, '0'), 'cm');
    animateChange(secsEl, String(secs).padStart(2, '0'), 'cs');
  }

  function updateTimeOnEarth() {
    const now = new Date().getTime();
    const elapsed = now - birthDatetime;

    if (elapsed < 0) return;

    const totalDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const remainingAfterDays = elapsed % (1000 * 60 * 60 * 24);
    const totalHours = Math.floor(remainingAfterDays / (1000 * 60 * 60));
    const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);
    const totalMins = Math.floor(remainingAfterHours / (1000 * 60));
    const totalSecs = Math.floor((remainingAfterHours % (1000 * 60)) / 1000);

    // Format days with commas for readability
    const formattedDays = totalDays.toLocaleString('en-US');

    animateChange(earthDaysEl, formattedDays, 'ed');
    animateChange(earthHoursEl, String(totalHours).padStart(2, '0'), 'eh');
    animateChange(earthMinsEl, String(totalMins).padStart(2, '0'), 'em');
    animateChange(earthSecsEl, String(totalSecs).padStart(2, '0'), 'es');
  }

  function tick() {
    updateCountdown();
    updateTimeOnEarth();
  }

  tick();
  setInterval(tick, 1000);
})();
