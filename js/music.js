/* One music controller: fade in/out, autoplay unlock, auto-pause for video & hidden tab */
window.Music = (() => {
  const audio = document.getElementById("bgMusic"), btn = document.getElementById("musicToggle");
  const MAX = 0.45; let fade, wanted = true, resume = false;
  if (!audio) return {};
  audio.volume = 0;

  const paint = () => { const on = !audio.paused;
    btn.textContent = on ? "🎵" : "🔇"; btn.classList.toggle("playing", on);
    btn.setAttribute("aria-label", on ? "Pause music" : "Play music"); };
  function ramp(to, done) { clearInterval(fade);
    fade = setInterval(() => { const d = to - audio.volume;
      if (Math.abs(d) < 0.03) { audio.volume = to; clearInterval(fade); done && done(); }
      else audio.volume = Math.min(1, Math.max(0, audio.volume + Math.sign(d) * 0.03)); }, 60); }
  function play() { return audio.play().then(() => { ramp(MAX); paint(); }).catch(() => {}); }
  function pause() { ramp(0, () => { audio.pause(); paint(); }); }

  btn.addEventListener("click", e => { e.stopPropagation(); wanted = audio.paused; audio.paused ? play() : pause(); });
  document.addEventListener("click", () => { if (wanted && audio.paused) play(); }, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { resume = !audio.paused; audio.pause(); }
    else if (resume && wanted) play(); paint(); });
  document.addEventListener("play", e => { if (e.target.tagName === "VIDEO" && !audio.paused) pause(); }, true);
  document.addEventListener("pause", e => { if (e.target.tagName === "VIDEO" && wanted &&
    ![...document.querySelectorAll("video")].some(v => !v.paused)) play(); }, true);
  paint();
  return { play, pause };
})();
