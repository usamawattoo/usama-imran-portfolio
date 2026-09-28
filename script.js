/* =========================================================
   USAMA IMRAN — Portfolio
   script.js
   ========================================================= */
(function () {
  "use strict";

  const WHATSAPP_NUMBER = "923096234228";
  const OWNER_NAME = "Usama Imran";

  /* Master service + price list — used to populate the order form
     and to auto-fill price when a specific "Order Now" button is used. */
  const SERVICES = [
    { group: "Graphic Design", name: "Logo Design", price: "Rs. 799" },
    { group: "Graphic Design", name: "Poster Design", price: "Rs. 299" },
    { group: "Graphic Design", name: "Flyer Design", price: "Rs. 249" },
    { group: "Graphic Design", name: "Business Card", price: "Rs. 349" },
    { group: "Graphic Design", name: "Menu Design", price: "Rs. 599" },
    { group: "Graphic Design", name: "Social Media Post", price: "Rs. 399" },
    { group: "Graphic Design", name: "YouTube Thumbnail", price: "Rs. 299" },
    { group: "Graphic Design", name: "Banner / Flex Design", price: "Rs. 349" },
    { group: "Video Editing", name: "Basic Video Editing", price: "Rs. 999" },
    { group: "Video Editing", name: "Professional Video Editing", price: "Rs. 1,999" },
    { group: "Video Editing", name: "Reels / Shorts", price: "Rs. 499" },
    { group: "Video Editing", name: "YouTube Video", price: "Rs. 199/min" },
    { group: "Web Development", name: "Landing Page", price: "Rs. 7,999" },
    { group: "Web Development", name: "Business Website", price: "Rs. 8,999" },
    { group: "Web Development", name: "E-commerce Website", price: "Rs. 9,999" },
    { group: "Photo Editing", name: "Background Removal", price: "Rs. 249" },
    { group: "Photo Editing", name: "Photo Editing", price: "Rs. 299" },
    { group: "Photo Editing", name: "Product Photo Editing", price: "Rs. 299" }
  ];

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    setActiveNav();
    initReveal();
    initBackTop();
    initOrderModal();
    initContactForm();
    initYear();
  });

  /* ---------------- Theme (Dark / Light) ---------------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = safeGet("ui-theme");
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
    } else {
      root.setAttribute("data-theme", "dark");
    }
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", current);
        safeSet("ui-theme", current);
      });
    });
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* ignore */ }
  }

  /* ---------------- Mobile hamburger menu ---------------- */
  function initMobileMenu() {
    const burger = document.querySelector("[data-hamburger]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!burger || !menu) return;
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      menu.classList.toggle("open");
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("open");
        menu.classList.remove("open");
      });
    });
  }

  /* ---------------- Active navigation highlight ---------------- */
  function setActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  }

  /* ---------------- Scroll reveal animations ---------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------------- Back to top button ---------------- */
  function initBackTop() {
    const btn = document.querySelector("[data-back-top]");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 480);
    });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------- Order Modal + WhatsApp ordering ---------------- */
  function initOrderModal() {
    const overlay = document.querySelector("[data-order-modal]");
    if (!overlay) return;

    const select = overlay.querySelector("[data-order-service]");
    const priceField = overlay.querySelector("[data-order-price]");
    const form = overlay.querySelector("[data-order-form]");
    const closeEls = overlay.querySelectorAll("[data-order-close]");

    // Populate service select once
    if (select && !select.dataset.filled) {
      let currentGroup = "";
      SERVICES.forEach((svc) => {
        if (svc.group !== currentGroup) {
          currentGroup = svc.group;
          const optGroup = document.createElement("optgroup");
          optGroup.label = currentGroup;
          optGroup.dataset.group = currentGroup;
          select.appendChild(optGroup);
        }
        const opt = document.createElement("option");
        opt.value = svc.name;
        opt.textContent = svc.name + " — " + svc.price;
        opt.dataset.price = svc.price;
        select.lastElementChild.appendChild(opt);
      });
      select.dataset.filled = "true";
    }

    if (select && priceField) {
      select.addEventListener("change", () => {
        const opt = select.options[select.selectedIndex];
        priceField.value = opt && opt.dataset.price ? opt.dataset.price : "";
      });
    }

    // Any button on the page can open the modal with a specific service
    document.querySelectorAll("[data-order-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const service = btn.getAttribute("data-service") || "";
        const price = btn.getAttribute("data-price") || "";
        openOrderModal(service, price);
      });
    });

    function openOrderModal(service, price) {
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      if (service && select) {
        select.value = service;
        if (select.value !== service) {
          // fallback if exact match not found
          const match = SERVICES.find((s) => s.name === service);
          if (match) {
            select.value = match.name;
          }
        }
      }
      if (priceField) {
        if (price) {
          priceField.value = price;
        } else if (select && select.value) {
          const opt = select.options[select.selectedIndex];
          priceField.value = opt && opt.dataset.price ? opt.dataset.price : "";
        }
      }
    }

    function closeOrderModal() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    closeEls.forEach((el) => el.addEventListener("click", closeOrderModal));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOrderModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOrderModal();
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateForm(form)) return;

        const data = getFormData(form);
        const message = buildOrderMessage(data);
        sendToWhatsApp(message);

        const success = overlay.querySelector("[data-form-success]");
        if (success) {
          success.classList.add("show");
          setTimeout(() => success.classList.remove("show"), 6000);
        }
        form.reset();
        if (priceField) priceField.value = "";
      });
    }
  }

  function buildOrderMessage(data) {
    const lines = [
      "Hello " + OWNER_NAME + ",",
      "",
      "I would like to place an order.",
      "",
      "Name: " + (data.name || "-"),
      "Service: " + (data.service || "-"),
      "Price: " + (data.price || "-"),
      "WhatsApp Number: " + (data.whatsapp || "-"),
      "Budget: " + (data.budget || "-"),
      "Deadline: " + (data.deadline || "-"),
      "",
      "Project Details:",
      data.details || "-",
      "",
      "Additional Message:",
      data.message || "-",
      "",
      "Please provide me with the next steps."
    ];
    return lines.join("\n");
  }

  function sendToWhatsApp(message) {
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  function getFormData(form) {
    const data = {};
    Array.from(form.elements).forEach((el) => {
      if (!el.name) return;
      data[el.name] = (el.value || "").trim();
    });
    return data;
  }

  /* ---------------- Generic form validation ---------------- */
  function validateForm(form) {
    let valid = true;
    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      const wrapper = field.closest(".field");
      let ok = field.value.trim().length > 0;

      if (field.type === "tel" && ok) {
        ok = field.value.replace(/[^0-9]/g, "").length >= 10;
      }
      if (field.type === "email" && ok) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }

      if (wrapper) wrapper.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  /* ---------------- Standalone Contact Page form ---------------- */
  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const select = form.querySelector("[data-contact-service]");
    const priceField = form.querySelector("[data-contact-price]");

    if (select && !select.dataset.filled) {
      let currentGroup = "";
      SERVICES.forEach((svc) => {
        if (svc.group !== currentGroup) {
          currentGroup = svc.group;
          const optGroup = document.createElement("optgroup");
          optGroup.label = currentGroup;
          select.appendChild(optGroup);
        }
        const opt = document.createElement("option");
        opt.value = svc.name;
        opt.textContent = svc.name + " — " + svc.price;
        opt.dataset.price = svc.price;
        select.lastElementChild.appendChild(opt);
      });
      const generalOpt = document.createElement("option");
      generalOpt.value = "General Inquiry";
      generalOpt.textContent = "General Inquiry / Not sure yet";
      select.appendChild(generalOpt);
      select.dataset.filled = "true";
    }

    if (select && priceField) {
      select.addEventListener("change", () => {
        const opt = select.options[select.selectedIndex];
        priceField.value = (opt && opt.dataset.price) ? opt.dataset.price : "To be discussed";
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const data = getFormData(form);
      const lines = [
        "Hello " + OWNER_NAME + ",",
        "",
        "I would like to get in touch regarding a project.",
        "",
        "Name: " + (data.name || "-"),
        "Email: " + (data.email || "-"),
        "WhatsApp Number: " + (data.whatsapp || "-"),
        "Service: " + (data.service || "-"),
        "Price: " + (data.price || "-"),
        "Budget: " + (data.budget || "-"),
        "Deadline: " + (data.deadline || "-"),
        "",
        "Project Details:",
        data.details || "-",
        "",
        "Message:",
        data.message || "-",
        "",
        "Please provide me with the next steps."
      ];
      sendToWhatsApp(lines.join("\n"));

      const success = form.querySelector("[data-form-success]");
      if (success) {
        success.classList.add("show");
        setTimeout(() => success.classList.remove("show"), 6000);
      }
      form.reset();
      if (priceField) priceField.value = "";
    });
  }
})();
