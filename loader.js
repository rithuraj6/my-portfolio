/* Cinematic loader: bricks build up -> turn cyan -> DevOps pipeline -> name -> shutter opens */
(() => {
  "use strict";

  const ICONS = [
    ['git', 'Git', 'every change versioned', '<path d="M24 5l19 19-19 19L5 24z"/><circle cx="20" cy="19" r="3"/><circle cx="20" cy="30" r="3"/><circle cx="30" cy="25" r="3"/><path d="M20 22v5M22.5 20.5l5 3"/>'],
    ['docker', 'Docker', 'packaged into containers', '<path d="M4 26h38c-1 9-9 15-19 15S6 36 4 26z"/><path d="M9 26v-6h6v6M15 26v-6h6v6M21 26v-6h6v6M27 26v-6h6v6M15 20v-6h6v6M21 20v-6h6v6"/>'],
    ['kubernetes', 'Kubernetes', 'orchestrated at scale', '<path d="M24 5l15 7 4 16-10 13H15L5 28l4-16z"/><circle cx="24" cy="24" r="4"/><path d="M24 20V9M27.5 22l10-5M27 27l8 8M21 27l-8 8M20.5 22l-10-5"/>'],
    ['argocd', 'Argo CD', 'synced from Git', '<path d="M40 24a16 16 0 1 1-5.5-12"/><path d="M38 6v9h-9"/><circle cx="24" cy="24" r="4"/>'],
    ['terraform', 'Terraform', 'infrastructure as code', '<path d="M6 9l11 6v13L6 22z"/><path d="M19 15l11 6v13l-11-6z"/><path d="M19 3l11 6v13l-11-6z"/><path d="M32 21l11-6v13l-11 6z"/>'],
    ['aws', 'AWS', 'running in the cloud', '<path d="M13 37a8 8 0 0 1-1-16 11 11 0 0 1 21-3 9.5 9.5 0 0 1 2 19z"/><path d="M18 30c4 3 8 3 12 0"/>'],
    ['prometheus', 'Prometheus', 'watched around the clock', '<circle cx="24" cy="24" r="18"/><path d="M24 11c3 5 8 7 8 14a8 8 0 0 1-16 0c0-3 1-5 3-7 0 3 1 4 2 4 1-3 3-6 3-11z"/>']
  ];

  const L = document.getElementById("loader");
  if (!L) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try { seen = sessionStorage.getItem("intro_seen") === "1"; } catch (e) {}
  const K = seen ? 0.55 : 1; /* repeat visits play faster */

  /* markup */
  const rows = 6;
  let wall = "";
  for (let r = 0; r < rows; r++) {
    const cols = r % 2 ? 6 : 7;
    let row = "";
    for (let c = 0; c < cols; c++) {
      const d = Math.round(((r * 7 + c) * 38 + Math.random() * 40) * K);
      const m = Math.round((r * 45 + c * 18) * K);
      const rot = (Math.random() * 28 - 14).toFixed(1);
      row += `<i class="br" style="--d:${d};--m:${m};--r:${rot}deg"></i>`;
    }
    wall += `<div class="brow">${row}</div>`;
  }
  const icons = ICONS.map(i => `<div class="ic" data-k="${i[0]}" title="${i[1]}"><svg viewBox="0 0 48 48" aria-hidden="true">${i[3]}</svg></div>`).join("");

  L.querySelector(".stage").innerHTML = `
    <div class="loader-logo-wrap"><img src="r-logo.svg" alt="R Logo" class="loader-logo" onerror="if(this.src.indexOf('assets')===-1){this.src='assets/images/r-logo.svg'}else{this.remove()}"></div>
    <div class="scene"><div class="wall">${wall}</div><div class="pipe" id="pipe">${icons}</div></div>
    <div class="count" id="count">0<small>%</small></div>
    <div class="tag lb" id="tag" aria-live="polite"></div>
    <div class="bname" id="bname" aria-hidden="true"></div>
    <div class="bar"><span id="fill"></span></div>`;

  const count = document.getElementById("count"), fill = document.getElementById("fill"),
        tag = document.getElementById("tag"), pipe = document.getElementById("pipe"),
        els = [...pipe.querySelectorAll(".ic")];
  const say = html => { tag.innerHTML = `<span>${html}</span>`; };

  /* timeline */
  const tMorph = 2300 * K, tIcons = 2750 * K, step = 300 * K;
  const tName = tIcons + ICONS.length * step + 150 * K, total = tName + 1000 * K;
  let done = false;
  const at = (ms, fn) => setTimeout(() => { if (!done) fn(); }, ms);

  say("Laying the <b>foundation</b>…");
  at(tMorph, () => { L.classList.add("morph"); say("Foundation set. Now the <b>cloud</b>…"); pipe.style.setProperty("--pt", ICONS.length * step + "ms"); });
  at(tIcons, () => pipe.classList.add("run"));
  ICONS.forEach((ic, i) => at(tIcons + i * step, () => {
    els.forEach(e => e.classList.remove("cur"));
    els[i].classList.add("on", "cur");
    say(`<b>${ic[1]}</b> · ${ic[2]}`);
  }));
  at(tName, () => {
    els.forEach(e => e.classList.remove("cur"));
    document.getElementById("bname").innerHTML = [..."RITHU RAJ R"].map((c, i) => `<i style="animation-delay:${i * 60}ms">${c === " " ? "&nbsp;" : c}</i>`).join("");
    say("Systems nominal. <b>Welcome.</b>");
  });
  at(total, finish);

  /* progress counter */
  const t0 = performance.now();
  (function tick(now) {
    if (done) return;
    const p = Math.min(100, ((now - t0) / (total - 400 * K)) * 100);
    count.innerHTML = Math.floor(p) + "<small>%</small>";
    fill.style.width = p + "%";
    requestAnimationFrame(tick);
  })(t0);

  function finish() {
    if (done) return;
    done = true;
    count.innerHTML = "100<small>%</small>";
    fill.style.width = "100%";
    L.classList.add("open");
    try { sessionStorage.setItem("intro_seen", "1"); } catch (e) {}
    setTimeout(() => {
      L.classList.add("gone");
      document.body.classList.remove("lock");
      document.body.classList.add("go");
    }, reduce ? 0 : 1000);
  }

  document.getElementById("skip").addEventListener("click", finish);
  addEventListener("keydown", e => { if (e.key === "Escape") finish(); });
  if (reduce) finish();
})();
