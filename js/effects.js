/* Heart-burst confetti on canvas */
window.Effects = (() => {
  const c = document.getElementById("confetti"), g = c.getContext("2d");
  let parts = [], raf;
  const fit = () => { c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; };
  fit(); addEventListener("resize", fit);
  const hearts = ["❤️", "💗", "💖", "🌸", "✨"];

  function loop() {
    g.clearRect(0, 0, c.width, c.height);
    parts = parts.filter(p => p.life > 0);
    parts.forEach(p => { p.vy += 0.12; p.x += p.vx; p.y += p.vy; p.life--;
      g.globalAlpha = Math.min(1, p.life / 40); g.font = `${p.s * devicePixelRatio}px serif`;
      g.fillText(p.e, p.x * devicePixelRatio, p.y * devicePixelRatio); });
    parts.length ? raf = requestAnimationFrame(loop) : g.clearRect(0, 0, c.width, c.height);
  }
  function burst(x = innerWidth / 2, y = innerHeight / 2, n = 60) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, s = Math.random() * 7 + 2;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, s: Math.random() * 16 + 14,
        life: 90 + Math.random() * 60, e: hearts[Math.floor(Math.random() * hearts.length)] }); }
    cancelAnimationFrame(raf); loop();
  }
  document.getElementById("burstBtn").addEventListener("click", e => burst(e.clientX, e.clientY, 80));
  return { burst };
})();
