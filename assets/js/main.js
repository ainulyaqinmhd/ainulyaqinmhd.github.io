/**
 * Muhammad A. Yaqin — Personal Portfolio
 * Main JavaScript v2.0
 */
(function () {
  "use strict";

  /* ─── Scroll Animations (IntersectionObserver) ─── */
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".fade-up, .img-reveal, .line-reveal").forEach((el) => {
      observer.observe(el);
    });
  }

  /* ─── Sticky Nav ─── */
  function initStickyNav() {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  /* ─── Active Nav Link (scroll spy) ─── */
  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: "-72px 0px -30% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ─── Mobile Menu ─── */
  function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    mobileMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ─── Portfolio Filter ─── */
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll(".portfolio-filter-btn");
    const items = document.querySelectorAll(".portfolio-item[data-category]");

    if (!filterBtns.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        items.forEach((item) => {
          const cats = item.getAttribute("data-category").split(" ");
          if (filter === "all" || cats.includes(filter)) {
            item.style.display = "";
            // Trigger reflow for animation
            setTimeout(() => item.classList.add("visible"), 10);
          } else {
            item.style.display = "none";
            item.classList.remove("visible");
          }
        });
      });
    });
  }

  /* ─── Toggle Full Portfolio ─── */
  function initPortfolioToggle() {
    const toggleBtn = document.getElementById("toggle-portfolio");
    const fullSection = document.getElementById("portfolio-full");

    if (!toggleBtn || !fullSection) return;

    toggleBtn.addEventListener("click", () => {
      const isHidden = fullSection.style.display === "none" || !fullSection.style.display;
      fullSection.style.display = isHidden ? "block" : "none";
      toggleBtn.textContent = isHidden ? "Show Less ↑" : "View All Work →";
      
      if (isHidden) {
        // Reinit animations for newly visible items
        setTimeout(() => {
          document.querySelectorAll("#portfolio-full .fade-up").forEach((el) => {
            el.classList.add("visible");
          });
        }, 100);
      }
    });
  }

  /* ─── Typing Text Effect ─── */
  function initTypingEffect() {
    const target = document.getElementById("typing-text");
    if (!target) return;

    const roles = ["UX Researcher", "Interaction Designer", "AI-Data Enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 80;
    const pauseBetween = 1500;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        target.textContent = currentRole.substring(0, charIndex--);
      } else {
        target.textContent = currentRole.substring(0, charIndex++);
      }

      if (!isDeleting && charIndex > currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseBetween);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, typingSpeed);
      } else {
        setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
      }
    }

    type();
  }

  /* ─── Smooth Scroll for anchor links ─── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ─── Contact Form (mailto fallback for GitHub Pages) ─── */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      const subject = form.querySelector('[name="subject"]').value;
      const message = form.querySelector('[name="message"]').value;

      const mailtoLink = `mailto:ainulyaqinmhd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;
    });
  }

  /* ─── Init Everything ─── */
  document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initStickyNav();
    initScrollSpy();
    initMobileMenu();
    initPortfolioFilter();
    initPortfolioToggle();
    initTypingEffect();
    initSmoothScroll();
    initContactForm();
  });
})();