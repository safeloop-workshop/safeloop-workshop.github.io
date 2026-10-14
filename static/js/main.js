// Mobile menu, active-section highlighting, scroll progress, and scroll reveal.
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".navbar-burger");
  const menu = burger && document.getElementById(burger.dataset.target);
  if (burger && menu) {
    const close = () => {
      burger.classList.remove("is-active");
      menu.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = burger.classList.toggle("is-active");
      menu.classList.toggle("is-active", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  // Highlight the navbar link of the section in view.
  const links = [...document.querySelectorAll(".site-nav a.navbar-item[href^='#']")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
      }),
    { rootMargin: "-40% 0px -55% 0px" },
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // Thin progress bar that fills as the page scrolls.
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? String(window.scrollY / max) : "0");
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  // Fade content up as it enters the viewport; items that enter together are staggered.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll(
    [
      ".section h2.title",
      ".section h3.subtitle",
      ".section .content > p",
      ".ch-head > *",
      ".topic-list li",
      ".news li",
      ".schedule tbody tr",
      ".track",
      ".content table.kv",
      ".content > ul:not(.topic-list):not(.news)",
      ".org",
      ".challenge-links",
      ".ch-stats",
      ".ch-h",
      ".ch-pool",
      ".ch-step",
      ".ch-panel",
      ".ch-rules > div",
      ".ch-awards > div",
      ".ch-timeline li",
      ".paper-track",
    ].join(","),
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      let i = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = `${Math.min(i++, 6) * 60}ms`;
        e.target.classList.add("is-in");
        revealObserver.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -4% 0px" },
  );
  targets.forEach((t) => {
    t.classList.add("reveal");
    revealObserver.observe(t);
  });
});
