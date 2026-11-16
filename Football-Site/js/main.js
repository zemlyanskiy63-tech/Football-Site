(() => {
  const loader = document.querySelector(".page-loader");
  const hideLoader = () => window.setTimeout(() => loader?.classList.add("is-hidden"), 180);
  if (document.readyState === "complete") hideLoader();
  else window.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, 2200);

  const header = document.querySelector(".site-header");
  const scrollTop = document.querySelector(".scroll-top");
  const updateScrollElements = () => {
    const scrollY = window.scrollY;
    header?.classList.toggle("is-sticky", scrollY > 50);
    scrollTop?.classList.toggle("is-visible", scrollY > 450);
  };
  window.addEventListener("scroll", updateScrollElements, { passive: true });
  updateScrollElements();
  scrollTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const setMenuOpen = (open) => {
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const duration = 1400;
    const render = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);
  };
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => { counter.textContent = counter.dataset.count; });
  }

  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  if (testimonials.length) {
    let activeIndex = testimonials.findIndex((item) => item.classList.contains("active"));
    const count = document.querySelector(".slider-count");
    const display = (index) => {
      activeIndex = (index + testimonials.length) % testimonials.length;
      testimonials.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === activeIndex));
      if (count) count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(testimonials.length).padStart(2, "0")}`;
    };
    document.querySelector(".slider-prev")?.addEventListener("click", () => display(activeIndex - 1));
    document.querySelector(".slider-next")?.addEventListener("click", () => display(activeIndex + 1));
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length) {
    const cards = document.querySelectorAll(".news-card[data-category]");
    const emptyState = document.querySelector(".empty-state");
    filterButtons.forEach((button) => button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      let visibleCount = 0;
      cards.forEach((card) => {
        const visible = button.dataset.filter === "all" || card.dataset.category === button.dataset.filter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyState) emptyState.hidden = visibleCount > 0;
    }));
  }

  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.querySelector(".lightbox");
  if (galleryItems.length && lightbox) {
    const image = lightbox.querySelector("figure img");
    const caption = lightbox.querySelector("figcaption");
    let currentIndex = 0;
    const displayImage = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      image.src = item.dataset.full || item.querySelector("img").src;
      image.alt = item.querySelector("img").alt;
      caption.textContent = item.dataset.caption || item.querySelector("span")?.textContent || image.alt;
    };
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    };
    const openLightbox = (index) => {
      displayImage(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      lightbox.querySelector(".lightbox-close").focus();
    };
    galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev")?.addEventListener("click", () => displayImage(currentIndex - 1));
    lightbox.querySelector(".lightbox-next")?.addEventListener("click", () => displayImage(currentIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") displayImage(currentIndex - 1);
      if (event.key === "ArrowRight") displayImage(currentIndex + 1);
    });
  }

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const status = contactForm.querySelector(".form-status");
    const fields = {
      name: contactForm.elements.namedItem("name"),
      phone: contactForm.elements.namedItem("phone"),
      age: contactForm.elements.namedItem("age"),
      consent: contactForm.elements.namedItem("consent")
    };
    const messages = {
      name: "Укажите имя (не менее двух букв).",
      phone: "Введите корректный номер телефона.",
      age: "Выберите возраст игрока.",
      consent: "Необходимо согласие на обработку данных."
    };
    const validate = (name) => {
      const field = fields[name];
      let valid = field.type === "checkbox" ? field.checked : Boolean(field.value.trim());
      if (name === "name") valid = field.value.trim().length >= 2;
      if (name === "phone") valid = field.value.replace(/\D/g, "").length >= 10;
      field.setAttribute("aria-invalid", String(!valid));
      const error = contactForm.querySelector(`[data-error-for="${name}"]`);
      if (error) error.textContent = valid ? "" : messages[name];
      return valid;
    };
    Object.keys(fields).forEach((name) => {
      fields[name].addEventListener("input", () => validate(name));
      fields[name].addEventListener("change", () => validate(name));
    });
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = Object.keys(fields).map(validate).every(Boolean);
      if (!valid) {
        status.textContent = "Проверьте, пожалуйста, отмеченные поля.";
        contactForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      status.textContent = "Проверка пройдена. Форма пока не подключена к отправке: позвоните нам или напишите на hello@alataufc.kz.";
      contactForm.reset();
      Object.values(fields).forEach((field) => field.removeAttribute("aria-invalid"));
      contactForm.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
    });
  }
})();
