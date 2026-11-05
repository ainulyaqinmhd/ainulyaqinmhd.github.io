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
  function readMoreLabel(btn, expanded, count) {
    btn.setAttribute("aria-expanded", expanded);
    btn.innerHTML = expanded
      ? 'Show less <i class="bi bi-chevron-up"></i>'
      : `Read more (${count}) <i class="bi bi-chevron-down"></i>`;
  }

  function revealIn(item, i) {
    item.classList.remove("is-revealed");
    void item.offsetWidth; // restart the fade-in on every expand
    item.style.animationDelay = `${i * 60}ms`;
    item.classList.add("is-revealed");
  }

  /* Category filter plus "Read more": the grid shows the newest items first,
     and the limit applies to whichever category is selected */
  function initPortfolioFilter() {
    const grid = document.querySelector(".portfolio-grid");
    const filterBtns = document.querySelectorAll(".portfolio-filter-btn");
    const items = Array.from(document.querySelectorAll(".portfolio-item[data-category]"));
    if (!grid || !items.length) return;

    // Fewer cards on phones: data-show-mobile applies at 768px and below
    const mobile = window.matchMedia("(max-width: 768px)");
    const desktopLimit = parseInt(grid.dataset.show, 10) || Infinity;
    const mobileLimit = parseInt(grid.dataset.showMobile, 10) || desktopLimit;
    let limit = mobile.matches ? mobileLimit : desktopLimit;
    let filter = "all";
    let expanded = false;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-more-btn is-grid";
    grid.after(btn);

    function render(animate) {
      const matching = items.filter(
        (item) => filter === "all" || item.dataset.category.split(" ").includes(filter)
      );
      items.forEach((item) => {
        const pos = matching.indexOf(item);
        const show = pos > -1 && (expanded || pos < limit);
        item.style.display = show ? "" : "none";
        item.classList.remove("is-revealed");
        if (!show) return;
        item.classList.add("visible");
        if (animate && pos >= limit) revealIn(item, pos - limit);
      });
      const extra = Math.max(0, matching.length - limit);
      btn.hidden = !extra;
      readMoreLabel(btn, expanded, extra);
    }

    mobile.addEventListener("change", () => {
      limit = mobile.matches ? mobileLimit : desktopLimit;
      render(false);
    });

    filterBtns.forEach((b) => {
      b.addEventListener("click", () => {
        filterBtns.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        filter = b.dataset.filter;
        expanded = false;
        render(false);
      });
    });

    btn.addEventListener("click", () => {
      expanded = !expanded;
      render(true);
      if (!expanded && grid.getBoundingClientRect().top < 0) {
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    render(false);
  }

  /* "Read more" for card grids such as the blog */
  function initGridReadMore() {
    document.querySelectorAll(".blog-grid[data-show], .blog-listing-grid[data-show]").forEach((grid) => {
      const limit = parseInt(grid.dataset.show, 10);
      const cards = Array.from(grid.children);
      const extra = cards.slice(limit);
      if (!extra.length) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "read-more-btn is-grid";
      grid.after(btn);

      function render(expanded, animate) {
        extra.forEach((card, i) => {
          card.hidden = !expanded;
          card.classList.remove("is-revealed");
          if (expanded) {
            card.classList.add("visible");
            if (animate) revealIn(card, i);
          }
        });
        readMoreLabel(btn, expanded, extra.length);
      }

      render(false);
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") !== "true";
        render(expanded, true);
        if (!expanded && grid.getBoundingClientRect().top < 0) {
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ─── Toggle Full Portfolio ─── */

  /* ─── Typing Text Effect ─── */
  function initTypingEffect() {
    const target = document.getElementById("typing-text");
    if (!target) return;

    const roles = ["Assistant Professor", "UX Researcher", "Interaction Designer", "AIGC Researcher"];
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

  /* ─── Read More: show the first N items under each h3[data-show] ─── */
  function initReadMore() {
    document.querySelectorAll("h3[data-show]").forEach((heading) => {
      const limit = parseInt(heading.dataset.show, 10);
      const items = [];
      let el = heading.nextElementSibling;
      while (el && el.classList.contains("research-item")) {
        items.push(el);
        el = el.nextElementSibling;
      }
      const extra = items.slice(limit);
      if (!extra.length) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "read-more-btn";
      items[items.length - 1].after(btn);

      function render(expanded, animate) {
        extra.forEach((item, i) => {
          item.hidden = !expanded;
          item.classList.remove("is-revealed");
          if (expanded && animate) {
            void item.offsetWidth; // restart the fade-in on every expand
            item.style.animationDelay = `${i * 60}ms`;
            item.classList.add("is-revealed");
          }
        });
        // The last visible item fades away while the list is collapsed
        items[limit - 1].classList.toggle("is-faded", !expanded);
        btn.setAttribute("aria-expanded", expanded);
        btn.innerHTML = expanded
          ? 'Show less <i class="bi bi-chevron-up"></i>'
          : `Read more (${extra.length}) <i class="bi bi-chevron-down"></i>`;
      }

      render(false);
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") !== "true";
        render(expanded, true);
        if (!expanded && heading.getBoundingClientRect().top < 0) {
          heading.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ─── Project Popup: cards with data-project open details from #project-data ─── */
  function initProjectModal() {
    const modal = document.getElementById("project-modal");
    const dataEl = document.getElementById("project-data");
    if (!modal || !dataEl || !modal.showModal) return;

    const projects = JSON.parse(dataEl.textContent);
    const field = (name) => modal.querySelector(`[data-field="${name}"]`);
    const linkIcons = {
      github: '<i class="bi bi-github"></i>',
      hf: "🤗",
      live: '<i class="bi bi-box-arrow-up-right"></i>',
      code: '<i class="bi bi-code-slash"></i>',
      page: '<i class="bi bi-journal-text"></i>',
      video: '<i class="bi bi-play-circle"></i>',
    };

    function fillList(el, items, tag) {
      el.replaceChildren(
        ...items.map((text) => {
          const node = document.createElement(tag);
          node.textContent = text;
          return node;
        })
      );
    }

    function open(id) {
      const p = projects[id];
      if (!p) return false;

      modal.dataset.cat = p.cat;
      modal.querySelector(".project-modal-media").style.backgroundImage = `url('${p.img}')`;
      field("label").textContent = p.label;
      field("title").textContent = p.title;

      const video = field("video");
      video.replaceChildren();
      video.hidden = !p.video;
      if (p.video) {
        const frame = document.createElement("iframe");
        frame.src = p.video;
        frame.title = p.title;
        frame.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
        frame.allowFullscreen = true;
        video.append(frame);
      }

      // Summary may hold several paragraphs separated by a blank line
      fillList(field("summary"), (p.summary || "").split("\n\n").filter(Boolean), "p");
      fillList(field("highlights"), p.highlights || [], "li");
      fillList(field("tech"), p.tech || [], "span");
      // Hide a section (and its heading) when the project has nothing for it
      ["highlights", "tech"].forEach((name) => {
        const empty = !(p[name] && p[name].length);
        field(name).hidden = empty;
        field(name).previousElementSibling.hidden = empty;
      });
      field("note").textContent = p.note || "";
      field("note").hidden = !p.note;

      field("links").replaceChildren(
        ...p.links.map(([label, url, kind], i) => {
          const a = document.createElement("a");
          a.href = url;
          // Case-study pages on this site open in the same tab
          if (kind !== "page") {
            a.target = "_blank";
            a.rel = "noopener";
          }
          a.className = i === 0 ? "btn-primary" : "btn-outline";
          a.innerHTML = `${linkIcons[kind] || ""} `;
          a.append(label);
          return a;
        })
      );

      modal.showModal();
      modal.scrollTop = 0;
      document.body.style.overflow = "hidden";
      return true;
    }

    document.addEventListener("click", (e) => {
      const card = e.target.closest("a[data-project]");
      // Let ctrl/cmd/shift-click still open the project in a new tab
      if (!card || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      if (open(card.dataset.project)) e.preventDefault();
    });

    modal.querySelector(".project-modal-close").addEventListener("click", () => modal.close());
    // Clicking the dimmed backdrop (outside the panel) closes it
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });
    modal.addEventListener("close", () => {
      document.body.style.overflow = "";
      field("video").replaceChildren(); // stop any playing video
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

      const mailtoLink = `mailto:yaqin@saturn.yzu.edu.tw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;
    });
  }

  /* ─── Back to Top ─── */
  function initBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);

    const toggle = () => btn.classList.toggle("is-visible", window.scrollY > 400);
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ─── Init Everything ─── */
  document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initStickyNav();
    initScrollSpy();
    initMobileMenu();
    initPortfolioFilter();
    initTypingEffect();
    initSmoothScroll();
    initReadMore();
    initGridReadMore();
    initProjectModal();
    initContactForm();
    initBackToTop();
  });
})();