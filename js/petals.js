/* CSS-driven petals (cheap): count adapts to screen, honours reduced motion */
(() => {
  const box = document.getElementById("petals-container");
  if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const sym = ["🌸", "🌸", "💗", "♡"], r = (a, b) => Math.random() * (b - a) + a;
  const count = innerWidth < 600 ? 14 : 28;
  for (let n = 0; n < count; n++) {
    const p = document.createElement("span");
    p.className = "petal"; p.textContent = sym[Math.floor(r(0, sym.length))];
    p.style.cssText = `left:${r(0, 100)}vw;font-size:${r(12, 26)}px;opacity:${r(.35, .85)};` +
      `animation-duration:${r(8, 15)}s,${r(3, 6)}s;animation-delay:${-r(0, 12)}s,${-r(0, 5)}s`;
    box.appendChild(p);
  }
  document.addEventListener("visibilitychange", () => box.classList.toggle("paused", document.hidden));
})();
