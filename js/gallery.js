/* Single lightbox: arrows, keys, swipe, counter, captions */
window.Gallery = (() => {
  let items = [], i = 0, x0 = 0;
  const v = document.createElement("div");
  v.className = "photo-viewer";
  v.innerHTML = `<button class="vbtn close" aria-label="Close">✕</button>
    <button class="vbtn prev" aria-label="Previous">❮</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="vbtn next" aria-label="Next">❯</button>`;
  document.body.appendChild(v);
  const img = v.querySelector("img"), cap = v.querySelector("figcaption");
  const open = n => { i = (n + items.length) % items.length; img.src = items[i].src;
    cap.textContent = `${items[i].caption || ""}  ·  ${i + 1} / ${items.length}`; v.classList.add("active"); };
  const close = () => v.classList.remove("active");
  v.querySelector(".close").onclick = close;
  v.querySelector(".prev").onclick = () => open(i - 1);
  v.querySelector(".next").onclick = () => open(i + 1);
  v.addEventListener("click", e => { if (e.target === v) close(); });
  v.addEventListener("touchstart", e => x0 = e.changedTouches[0].screenX, { passive: true });
  v.addEventListener("touchend", e => { const d = e.changedTouches[0].screenX - x0;
    if (Math.abs(d) > 60) open(i + (d < 0 ? 1 : -1)); }, { passive: true });
  document.addEventListener("keydown", e => { if (!v.classList.contains("active")) return;
    if (e.key === "Escape") close(); if (e.key === "ArrowRight") open(i + 1); if (e.key === "ArrowLeft") open(i - 1); });

  return { isOpen: () => v.classList.contains("active"),
    mount(list, el) { items = list;
      el.innerHTML = list.map((p, n) => `<button class="g-item" data-i="${n}" aria-label="Open photo ${n + 1}">
        <img src="${p.src}" alt="${p.caption || ""}" loading="lazy" onerror="this.parentNode.classList.add('missing')">
        <span>${p.caption || ""}</span></button>`).join("");
      el.addEventListener("click", e => { const b = e.target.closest(".g-item"); if (b) open(+b.dataset.i); }); } };
})();
