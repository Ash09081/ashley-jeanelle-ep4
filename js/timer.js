/* Calendar-accurate timers (local time, monthsary = the 7th) */
(() => {
  const C = window.CONFIG, S = C.start;
  const pad = n => String(n).padStart(2, "0");
  const anchor = n => new Date(S.year, S.month - 1 + n, S.day, 0, 0, 0);

  function since(now) {
    let m = (now.getFullYear() - S.year) * 12 + (now.getMonth() - (S.month - 1));
    while (m > 0 && anchor(m) > now) m--;
    const rem = Math.max(0, now - anchor(Math.max(m, 0)));
    return { months: Math.max(m, 0), days: Math.floor(rem / 864e5),
      hours: Math.floor(rem / 36e5) % 24, minutes: Math.floor(rem / 6e4) % 60,
      seconds: Math.floor(rem / 1e3) % 60 };
  }
  const unit = (v, l) => `<div class="unit"><span>${v}</span><small>${l}</small></div>`;
  const row = (...u) => `<div class="timer-row">${u.join("")}</div>`;

  function tick() {
    const now = new Date(), t = since(now);
    const rel = document.getElementById("relationshipTimer");
    if (rel) rel.innerHTML = row(unit(t.months, "MONTHS"), unit(t.days, "DAYS"),
      unit(pad(t.hours), "HRS"), unit(pad(t.minutes), "MIN"), unit(pad(t.seconds), "SEC"));

    const banner = document.getElementById("monthsaryBanner");
    if (banner) { const today = now.getDate() === S.day && t.months > 0;
      banner.hidden = !today; if (today) banner.textContent = `Happy ${t.months}-month monthsary! ❤️`; }

    const next = anchor(t.months + 1), d = next - now;
    const cd = document.getElementById("monthsaryCountdown");
    if (cd) cd.innerHTML = row(unit(Math.floor(d / 864e5), "DAYS"), unit(pad(Math.floor(d / 36e5) % 24), "HRS"),
      unit(pad(Math.floor(d / 6e4) % 60), "MIN"), unit(pad(Math.floor(d / 1e3) % 60), "SEC"));
  }
  document.addEventListener("DOMContentLoaded", () => { tick(); setInterval(tick, 1000); });
})();
