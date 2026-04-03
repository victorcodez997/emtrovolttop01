document.addEventListener("DOMContentLoaded", function () {
  // ── Hero Carousel ──
  const slides = document.querySelectorAll(".hero-slide");
  const DURATION = 5000; // ms each slide stays visible
  const SPEED = 900; // ms slide transition — matches CSS

  if (slides.length > 1) {
    let current = 0;
    let busy = false;

    const advance = () => {
      if (busy) return;
      busy = true;

      const outgoing = slides[current];
      const nextIndex = (current + 1) % slides.length;
      const incoming = slides[nextIndex];

      // snap incoming to off-screen-right with no transition
      incoming.style.transition = "none";
      incoming.classList.remove("active", "leaving");
      void incoming.offsetWidth; // flush paint

      // re-enable transition and fire both movements together
      incoming.style.transition = "";
      outgoing.classList.add("leaving");
      outgoing.classList.remove("active");
      incoming.classList.add("active");

      current = nextIndex;

      setTimeout(() => {
        outgoing.classList.remove("leaving");
        busy = false;
      }, SPEED);
    };

    setInterval(advance, DURATION);
  }

  // ── Mobile Menu Toggle ──
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    const toggleMenu = (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("open", isOpen);
      mobileMenuBtn.setAttribute("aria-expanded", isOpen);
    };

    mobileMenuBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !mobileMenuBtn.contains(e.target) &&
        !navLinks.contains(e.target)
      ) {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.focus();
      }
    });
  }

  // ── Service Category → Specific Service ──
  const serviceOptions = {
    "Renewable Energy": [
      "Solar PV Installation",
      "Solar Panel Maintenance",
      "Energy Audits",
      "Battery Storage Systems",
    ],
    "Inverter Sales & Service": [
      "Inverter Installation",
      "Inverter Repair",
      "Battery Replacement",
      "UPS Systems",
    ],
    "Fire & Gas Systems": [
      "Fire Alarm Installation",
      "Gas Detection Systems",
      "Fire Extinguisher Service",
      "System Testing",
    ],
    "Oil & Gas Equipment Rental": [
      "Power Generators",
      "Industrial Tools",
      "Compressors",
      "Safety Equipment",
    ],
    "Electrical & Instrumentation": [
      "Panel Design",
      "Wiring Installation",
      "Calibration Services",
      "Maintenance",
    ],
    "Control Systems & Automation": [
      "PLC Programming",
      "SCADA Systems",
      "HMI Design",
      "Process Automation",
    ],
  };

  const serviceCategorySelect = document.getElementById("serviceCategory");
  const specificServiceSelect = document.getElementById("specificService");

  if (serviceCategorySelect && specificServiceSelect) {
    serviceCategorySelect.addEventListener("change", function () {
      const options = serviceOptions[this.value] || [];
      specificServiceSelect.innerHTML =
        '<option value="">Select a specific service (optional)</option>';
      options.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        specificServiceSelect.appendChild(opt);
      });
      specificServiceSelect.disabled = !options.length;
    });
  }

  // ── Quote Form ──
  const quoteForm = document.getElementById("detailedQuoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const fullName = document.getElementById("fullName")?.value.trim();
      const email = document.getElementById("emailAddr")?.value.trim();
      const phone = document.getElementById("phoneNum")?.value.trim();
      const category = document.getElementById("serviceCategory")?.value;

      if (!fullName || !email || !phone || !category) {
        alert("Please fill in all required fields (marked with *)");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address");
        return;
      }
      if (!/^[\d\s+\-()]{10,}$/.test(phone)) {
        alert("Please enter a valid phone number");
        return;
      }
      alert(
        `Thank you, ${fullName}.\n\nYour quote request has been received. Our engineering team will review your requirements and respond within 24 hours.`,
      );
      quoteForm.reset();
      if (specificServiceSelect) {
        specificServiceSelect.innerHTML =
          '<option value="">Please select a category first</option>';
        specificServiceSelect.disabled = true;
      }
    });
  }

  // ── Contact Form ──
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contactName")?.value.trim();
      const email = document.getElementById("contactEmail")?.value.trim();
      const subject = document.getElementById("contactSubject")?.value.trim();
      const message = document.getElementById("contactMessage")?.value.trim();

      if (!name || !email || !subject || !message) {
        alert("Please fill in all required fields.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address");
        return;
      }
      alert(
        `Thank you, ${name}. Your message has been received.\n\nWe will respond to "${subject}" within 24 hours.`,
      );
      contactForm.reset();
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (navLinks?.classList.contains("active")) {
          navLinks.classList.remove("active");
          mobileMenuBtn?.classList.remove("open");
          mobileMenuBtn?.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // ── Scroll-in animations ──
  const animEls = document.querySelectorAll(
    ".service-card, .project-card, .why-card, .detail-item, .stat-box",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  animEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

  // ── Header shadow on scroll ──
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.style.borderBottomColor =
          window.scrollY > 60 ? "rgba(0,0,0,0.1)" : "var(--border)";
      },
      { passive: true },
    );
  }
});

// ── Scroll to Top ──
const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
  window.addEventListener(
    "scroll",
    () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true },
  );

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
