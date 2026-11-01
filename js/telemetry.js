/**
 * Telemetry & Orbit Clock
 * Real-time continuous calculations for:
 * - Time on Earth (Days, Hours, Minutes, Seconds since April 28, 2000)
 * - Next Birthday Orbit Countdown
 */
(() => {
  "use strict";

  const BIRTH_DATE = new Date("2000-04-28T07:00:00+05:30");

  const earthDaysEl = document.getElementById("earth-days");
  const earthHoursEl = document.getElementById("earth-hours");
  const earthMinsEl = document.getElementById("earth-mins");
  const earthSecsEl = document.getElementById("earth-secs");

  const bdayDaysEl = document.getElementById("bday-days");
  const bdayAgeEl = document.getElementById("bday-age");

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function updateTelemetry() {
    const now = new Date();

    // 1. Time on Earth
    const diffMs = now - BIRTH_DATE;
    if (diffMs > 0) {
      const totalSecs = Math.floor(diffMs / 1000);
      const totalMins = Math.floor(totalSecs / 60);
      const totalHours = Math.floor(totalMins / 60);
      const days = Math.floor(totalHours / 24);

      const hours = totalHours % 24;
      const mins = totalMins % 60;
      const secs = totalSecs % 60;

      if (earthDaysEl) earthDaysEl.innerText = days.toLocaleString();
      if (earthHoursEl) earthHoursEl.innerText = pad(hours);
      if (earthMinsEl) earthMinsEl.innerText = pad(mins);
      if (earthSecsEl) earthSecsEl.innerText = pad(secs);
    }

    // 2. Next Orbit Celebration
    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate(), 7, 0, 0);

    if (now > nextBday) {
      nextBday = new Date(currentYear + 1, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate(), 7, 0, 0);
    }

    const remainingMs = nextBday - now;
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const turningAge = nextBday.getFullYear() - BIRTH_DATE.getFullYear();

    if (bdayDaysEl) bdayDaysEl.innerText = remainingDays;
    if (bdayAgeEl) bdayAgeEl.innerText = turningAge;
  }

  updateTelemetry();
  setInterval(updateTelemetry, 1000);
})();

