/* Modern scroll effects: progress bar, hero drift, smart nav, stagger, parallax, tilt, spotlight, magnetic buttons */
(() => {
    "use strict";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    /* scroll progress bar */
    const bar = document.createElement("div");
    bar.id = "prog"; document.body.appendChild(bar);

    /* stagger groups: children reveal one after another */
    ["#work .proj", ".sk", ".xp", ".rg", ".soc"].forEach(sel => {
        $$(sel).forEach(g => {
            g.classList.add("stg");
            g.classList.remove("rv");
            [...g.children].forEach((c, i) => c.style.setProperty("--si", i));
        });
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .12 });
    $$(".stg").forEach(el => io.observe(el));
    /* GitHub cards are added later, so reveal the grid right away */
    const rg = $("#rg"); if (rg) rg.classList.add("in");

    /* tilt on skill cells and experience cards, spotlight on project rows */
    if (fine && !reduce) {
        $$(".card, .rc").forEach(el => {
            el.classList.add("tilt");
            el.addEventListener("pointermove", e => {
                const r = el.getBoundingClientRect();
                el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 8 + "deg");
                el.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - .5)) * 8 + "deg");
            });
            el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
        });
        /* GitHub cards render async, so use delegation for them */
        document.addEventListener("pointermove", e => {
            const rc = e.target.closest && e.target.closest(".rc");
            if (rc && !rc.classList.contains("tilt")) rc.classList.add("tilt");
        }, { passive: true });
        $$(".pr").forEach(el => el.addEventListener("pointermove", e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mx", e.clientX - r.left + "px");
            el.style.setProperty("--my", e.clientY - r.top + "px");
        }));
        /* magnetic buttons */
        $$(".btn.p, .cta").forEach(b => {
            b.addEventListener("pointermove", e => {
                const r = b.getBoundingClientRect();
                b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
            });
            b.addEventListener("pointerleave", () => { b.style.transform = ""; });
        });
    }

    /* scroll-driven loop (one rAF, transforms only) */
    const hero = $("header.hero .wrap"), ph = $("#ph"), steps = $(".steps"), nav = $("#nav");
    let lastY = scrollY, ticking = false;
    function frame() {
        ticking = false;
        const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
        bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

        if (!reduce) {
            if (hero) {
                const k = clamp(y / (vh * .9), 0, 1);
                hero.style.transform = `translateY(${k * 90}px) scale(${1 - k * .06})`;
                hero.style.opacity = 1 - k * 1.1;
            }
            if (ph) {
                const r = ph.getBoundingClientRect();
                const c = (r.top + r.height / 2 - vh / 2) / vh;
                ph.style.translate = `0 ${clamp(c, -1, 1) * -36}px`;
            }
            if (steps) {
                const r = steps.getBoundingClientRect();
                steps.style.setProperty("--sp", clamp((vh * .7 - r.top) / r.height, 0, 1).toFixed(3));
            }
        }
        /* nav hides on scroll down, returns on scroll up */
        if (nav) nav.classList.toggle("hide", y > lastY && y > 240);
        lastY = y;
    }
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    frame();
})();