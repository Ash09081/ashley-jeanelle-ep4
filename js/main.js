/* Scene engine + content rendering */
document.addEventListener("DOMContentLoaded", () => {
  const C = window.CONFIG, $ = id => document.getElementById(id);
  const scenes = [...document.querySelectorAll(".scene")];
  let cur = 0, typing = null;

  /* ---------- render content from config ---------- */
  $("dateRange").textContent = C.dateRange;
  $("episodeDate").textContent = C.episodeDate;
  $("nextEp").textContent = C.nextEpisode;
  $("timeline").innerHTML = C.timeline.map(t => `<li class="${t.now ? "now" : ""}">
    <b>${t.when}</b><em>${t.date}</em><h4>${t.title}</h4><p>${t.text}</p></li>`).join("");
  $("flipTotal").textContent = C.reasons.length;
  $("reasons").innerHTML = C.reasons.map((r, n) => `<button class="reason" aria-pressed="false">
    <span class="face front">♡<small>${n + 1}</small></span><span class="face back">${r}</span></button>`).join("");
  Gallery.mount(C.photos, $("gallery"));
  $("videos").innerHTML = C.videos.map(s => `<video controls playsinline preload="metadata"><source src="${s}" type="video/mp4"></video>`).join("");
  $("letterTitle").textContent = C.letterTitle;
  $("dots").innerHTML = scenes.map((_, n) => `<button aria-label="Scene ${n + 1}" data-goto="${n}"></button>`).join("");

  /* ---------- reasons ---------- */
  let flipped = 0;
  $("reasons").addEventListener("click", e => { const b = e.target.closest(".reason");
    if (!b || b.classList.contains("flipped")) return;
    b.classList.add("flipped"); b.setAttribute("aria-pressed", "true");
    $("flipCount").textContent = ++flipped;
    if (flipped === C.reasons.length) { $("reasonsDone").hidden = false; Effects.burst(innerWidth / 2, innerHeight / 2, 40); } });

  /* ---------- letter typewriter ---------- */
  function typeLetter() {
    const body = $("letterBody"), text = C.letter.join("\n\n"); let n = 0;
    clearInterval(typing); body.textContent = ""; $("letterNext").hidden = true; $("skipType").hidden = false;
    const done = () => { clearInterval(typing); body.textContent = text; $("letterNext").hidden = false; $("skipType").hidden = true; };
    $("skipType").onclick = done;
    typing = setInterval(() => { body.textContent = text.slice(0, ++n); body.scrollIntoView({ block: "nearest" }); if (n >= text.length) done(); }, C.typingSpeed);
  }

  /* ---------- navigation ---------- */
  function go(n) {
    n = Math.max(0, Math.min(scenes.length - 1, n));
    scenes[cur].classList.remove("active"); cur = n;
    const s = scenes[cur]; s.classList.add("active"); s.scrollTop = 0;
    document.querySelectorAll("video").forEach(v => v.pause());
    [...$("dots").children].forEach((d, k) => d.classList.toggle("on", k === cur));
    $("dots").classList.toggle("hidden", cur === 0);
    if (s.id === "letterScene") typeLetter(); else clearInterval(typing);
    if (s.id === "finaleScene") setTimeout(() => Effects.burst(), 500);
    if (s.id === "heroScene") setTimeout(() => Effects.burst(innerWidth / 2, innerHeight * .3, 30), 400);
  }
  document.addEventListener("click", e => {
    if (e.target.closest("[data-next]")) go(cur + 1);
    const g = e.target.closest("[data-goto]"); if (g) go(+g.dataset.goto);
  });
  document.addEventListener("keydown", e => {
    if (Gallery.isOpen()) return;
    if (e.key === "ArrowRight") { const b = scenes[cur].querySelector("[data-next]:not([hidden])"); b && go(cur + 1); }
    if (e.key === "ArrowLeft") go(cur - 1);
  });
  let x0 = 0, y0 = 0;
  document.addEventListener("touchstart", e => { x0 = e.changedTouches[0].screenX; y0 = e.changedTouches[0].screenY; }, { passive: true });
  document.addEventListener("touchend", e => {
    if (Gallery.isOpen() || e.target.closest("video")) return;
    const dx = e.changedTouches[0].screenX - x0, dy = e.changedTouches[0].screenY - y0;
    if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) { if (scenes[cur].querySelector("[data-next]:not([hidden])")) go(cur + 1); } else go(cur - 1);
  }, { passive: true });

  go(0); $("dots").classList.add("hidden");
  console.log("❤️ Season 1 Episode 4 ready.");
});
