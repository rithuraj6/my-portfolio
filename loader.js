/* Loader: bricks fall -> building -> DevOps/cloud logos -> 100% -> shutter reveal */
(() => {
  "use strict";

  const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/";
  /* key, label, caption, image. Drop your own files in assets/icons/<key>.svg|png and swap the path if you prefer local. */
  const TOOLS = [
    ["git", "Git", "every change versioned", CDN + "git/git-original.svg"],
    ["jenkins", "Jenkins", "built and tested", CDN + "jenkins/jenkins-original.svg"],
    ["docker", "Docker", "packaged into containers", CDN + "docker/docker-original.svg"],
    ["kubernetes", "Kubernetes", "orchestrated at scale", CDN + "kubernetes/kubernetes-original.svg"],
    ["argocd", "Argo CD", "synced from Git", CDN + "argocd/argocd-original.svg"],
    ["terraform", "Terraform", "infrastructure as code", CDN + "terraform/terraform-original.svg"],
    ["aws", "AWS", "running in the cloud", CDN + "amazonwebservices/amazonwebservices-plain-wordmark.svg"],
    ["prometheus", "Prometheus", "watched around the clock", CDN + "prometheus/prometheus-original.svg"]
  ];

  const L = document.getElementById("loader");
  if (!L) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try { seen = sessionStorage.getItem("intro_seen") === "1"; } catch (e) { }
  const K = seen ? 0.6 : 1; /* repeat visits play faster */

  /* building: rows narrow toward a roof, some bricks are lit windows */
  const layout = [7, 6, 7, 6, 7, 6, 4, 2];
  let wall = "";
  layout.forEach((cols, r) => {
    let row = "";
    for (let c = 0; c < cols; c++) {
      const d = Math.round((r * 330 + c * 45 + Math.random() * 60) * K * 0.8);
      const m = Math.round((r * 50 + c * 16) * K);
      const rot = (Math.random() * 24 - 12).toFixed(1);
      const win = r > 0 && r < 6 && c % 2 === 1 && r % 2 === 0 ? " win" : "";
      const roof = r >= 6 ? " roof" : "";
      row += `<i class="br${win}${roof}" style="--d:${d};--m:${m};--r:${rot}deg"></i>`;
    }
    wall += `<div class="brow">${row}</div>`;
  });

  const icons = TOOLS.map(t =>
    `<div class="ic" title="${t[1]}"><img src="${t[3]}" alt="${t[1]} logo" decoding="async"></div>`).join("");

  L.querySelector(".stage").innerHTML = `
    <div class="loader-logo-wrap"><img src="r-logo.svg" alt="" class="loader-logo" onerror="if(this.src.indexOf('assets')===-1){this.src='assets/images/r-logo.svg'}else{this.remove()}"></div>
    <div class="scene"><div class="wall">${wall}</div><div class="pipe" id="pipe">${icons}</div></div>
    <div class="count" id="count">0<small>%</small></div>
    <div class="tag lb" id="tag" aria-live="polite"></div>
    <div class="bname" id="bname" aria-hidden="true"></div>
    <div class="bar"><span id="fill"></span></div>`;

  const count = document.getElementById("count"), fill = document.getElementById("fill"),
    tag = document.getElementById("tag"), pipe = document.getElementById("pipe"),
    els = [...pipe.querySelectorAll(".ic")];

  /* if a logo fails to load, show the first letter instead of a broken image */
  els.forEach((el, i) => {
    const img = el.querySelector("img");
    img.addEventListener("error", () => { el.innerHTML = `<b>${TOOLS[i][1][0]}</b>`; });
  });

  const say = html => { tag.innerHTML = `<span>${html}</span>`; };

  /* timeline (ms) */
  const step = 360 * K;
  const tMorph = 3100 * K, tIcons = 3750 * K;
  const tName = tIcons + TOOLS.length * step + 250 * K;
  const total = tName + 1100 * K;
  let done = false;
  const at = (ms, fn) => setTimeout(() => { if (!done) fn(); }, ms);

  say("Laying the <b>foundation</b>…");
  at(1500 * K, () => say("Raising the <b>walls</b>…"));
  at(tMorph, () => {
    L.classList.add("morph");
    pipe.style.setProperty("--pt", TOOLS.length * step + "ms");
    say("Building stands. Now the <b>cloud</b>…");
  });
  at(tIcons, () => pipe.classList.add("run"));
  TOOLS.forEach((t, i) => at(tIcons + i * step, () => {
    els.forEach(e => e.classList.remove("cur"));
    els[i].classList.add("on", "cur");
    say(`<b>${t[1]}</b> · ${t[2]}`);
  }));
  at(tName, () => {
    els.forEach(e => e.classList.remove("cur"));
    document.getElementById("bname").innerHTML = [..."RITHU RAJ R"].map((c, i) =>
      `<i style="animation-delay:${i * 55}ms">${c === " " ? "&nbsp;" : c}</i>`).join("");
    say("Systems nominal. <b>Welcome.</b>");
  });
  at(total, finish);

  /* progress: smooth eased clock, reaches exactly 100 at tName + a beat */
  const t0 = performance.now(), span = total - 350 * K;
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  (function tick(now) {
    if (done) return;
    const x = Math.min(1, (now - t0) / span);
    const p = ease(x) * 0.35 + x * 0.65; /* blend keeps motion steady, never stalls */
    count.innerHTML = Math.floor(p * 100) + "<small>%</small>";
    fill.style.width = (p * 100).toFixed(2) + "%";
    requestAnimationFrame(tick);
  })(t0);

  function finish() {
    if (done) return;
    done = true;
    count.innerHTML = "100<small>%</small>";
    fill.style.width = "100%";
    try { sessionStorage.setItem("intro_seen", "1"); } catch (e) { }
    /* brief hold on 100%, then the shutter opens and the hero animates in */
    setTimeout(() => {
      L.classList.add("open");
      document.body.classList.remove("lock");
      setTimeout(() => document.body.classList.add("go"), reduce ? 0 : 450);
      setTimeout(() => L.classList.add("gone"), reduce ? 0 : 1300);
    }, reduce ? 0 : 350);
  }

  document.getElementById("skip").addEventListener("click", finish);
  addEventListener("keydown", e => { if (e.key === "Escape") finish(); });
  if (reduce) finish();
})();