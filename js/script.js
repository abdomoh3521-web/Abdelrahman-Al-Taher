// Coderahman portfolio interactions
(() => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector("i");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
  } catch (_) {}
  const applyTheme = (theme) => {
    body?.setAttribute("data-theme", theme);
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
    themeToggle?.setAttribute("aria-label", theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن");
    themeToggle?.setAttribute("title", theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن");
  };
  applyTheme(savedTheme);
  themeToggle?.addEventListener("click", () => {
    const nextTheme = body?.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("theme", nextTheme); } catch (_) {}
  });

  // Smooth in-page navigation with a fallback for browsers without smooth scrolling.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  });

  const heroText = document.querySelector(".hero-text");
  const animatedSections = document.querySelectorAll(".fade-in");
  const showVisibleSections = () => {
    animatedSections.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
        element.classList.add("visible");
      }
    });
    if (heroText) heroText.classList.toggle("hidden", window.scrollY > 160);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    animatedSections.forEach((section) => observer.observe(section));
  } else {
    animatedSections.forEach((section) => section.classList.add("visible"));
  }
  window.addEventListener("scroll", showVisibleSections, { passive: true });
  window.addEventListener("load", showVisibleSections);
  showVisibleSections();

  // A subtle typing effect that respects reduced-motion settings.
  const heroTitle = document.querySelector(".hero-text h2");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroTitle && !reducedMotion) {
    const title = heroTitle.textContent.trim();
    heroTitle.textContent = "";
    let index = 0;
    const typeNext = () => {
      if (!heroTitle || index >= title.length) return;
      heroTitle.textContent += title.charAt(index++);
      window.setTimeout(typeNext, 85);
    };
    window.addEventListener("load", () => window.setTimeout(typeNext, 350), { once: true });
  }

  // Keyboard users can see which cards are interactive; no forced inline transforms.
  document.querySelectorAll(".skill-item, .project-item").forEach((card) => {
    card.addEventListener("focusin", () => card.classList.add("is-focused"));
    card.addEventListener("focusout", () => card.classList.remove("is-focused"));
  });
})();
