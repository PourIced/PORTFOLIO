document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Helpers
  ========================= */
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  /* =========================
     Menu Toggle
  ========================= */
  const menuIcon = $("#menu-icon");
  const navbar = $(".navbar");

  if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("bx-x");
      navbar.classList.toggle("show");
    });
  }

  /* =========================
     Scroll Spy (nav highlight)
  ========================= */
  const sections = $$("section");
  const navLinks = $$("header nav a");

  const onScroll = () => {
    const top = window.scrollY;

    sections.forEach((sec) => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (!id) return;

      if (top >= offset && top < offset + height) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`header nav a[href*="${id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });

    // Auto-close mobile menu on scroll
    if (menuIcon && navbar) {
      menuIcon.classList.remove("bx-x");
      navbar.classList.remove("show");
    }
  };

  window.addEventListener("scroll", onScroll);

  /* =========================
     Optional Social Icon JS
     (only used if you have elements with these IDs)
  ========================= */
  const facebookIcon = $("#facebook-icon");
  const githubIcon = $("#github-icon");
  const instagramIcon = $("#instagram-icon");
  const linkedinIcon = $("#linkedin-icon");

  if (facebookIcon) {
    facebookIcon.addEventListener("click", () =>
      window.open("https://www.facebook.com/3nriqu3.13th/", "_blank")
    );
  }
  if (githubIcon) {
    githubIcon.addEventListener("click", () =>
      window.open("https://github.com/PourIced", "_blank")
    );
  }
  if (instagramIcon) {
    instagramIcon.addEventListener("click", () =>
      window.open("https://www.instagram.com/_inriki_/", "_blank")
    );
  }
  if (linkedinIcon) {
    linkedinIcon.addEventListener("click", () =>
      window.open(
        "https://www.linkedin.com/in/enrique-kin-iway-865083322/",
        "_blank"
      )
    );
  }

  /* =========================
     Image Modal + Slideshow
  ========================= */
  // Your modal should have: <div id="imageModal" class="image-modal"> ... </div>
  const modal = $("#imageModal");
  const modalImg = $("#modalImage");
  const closeBtn = $(".image-modal .close");
  const prevBtn = $(".image-modal .prev");
  const nextBtn = $(".image-modal .next");

  let currentImages = [];
  let currentIndex = 0;

  const isModalReady = () => modal && modalImg;

  const openModal = (imagesArray, startIndex = 0) => {
    if (!isModalReady() || !imagesArray || !imagesArray.length) return;
    currentImages = imagesArray;
    currentIndex = startIndex;
    modal.style.display = "flex";
    modalImg.src = currentImages[currentIndex].src;
  };

  const closeModal = () => {
    if (!isModalReady()) return;
    modal.style.display = "none";
    modalImg.src = "";
    currentImages = [];
    currentIndex = 0;
  };

  const showNext = () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    modalImg.src = currentImages[currentIndex].src;
  };

  const showPrev = () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex].src;
  };

  // Click handlers for modal controls (guard if buttons missing)
  if (nextBtn) nextBtn.addEventListener("click", showNext);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Close when clicking outside the image
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Open modal when clicking any image inside a .slider
  $$(".slider").forEach((slider) => {
    const imgs = $$("img", slider);
    imgs.forEach((img, idx) => {
      img.addEventListener("click", () => openModal(imgs, idx));
    });
  });

  // “Click to see more” buttons (if present)
  $$(".experience-text .view-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slider = btn.closest(".experience-item")?.querySelector(".slider");
      if (!slider) return;
      const imgs = $$("img", slider);
      openModal(imgs, 0);
    });
  });

  // Keyboard navigation when modal is open
  document.addEventListener("keydown", (e) => {
    if (!isModalReady() || modal.style.display !== "flex") return;
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "Escape") closeModal();
  });

  // Touch swipe on the image (mobile)
  if (modalImg) {
    let startX = 0;
    modalImg.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
    });
    modalImg.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].screenX;
      const delta = endX - startX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) showNext(); // swipe left → next
        else showPrev(); // swipe right → prev
      }
    });
  }

/* =========================
   Contact Form (Formspree)
   - success/error messages inline
   - loading state
========================= */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form && status) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const action = "https://formspree.io/f/xjkonarv"; // your Formspree endpoint
    const submitBtn = form.querySelector(".btn-submit");

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }
    status.textContent = "";
    status.style.color = "";

    try {
      const response = await fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "✅ Thank you! Your message has been sent.";
        status.style.color = "lightgreen";
        form.reset();
      } else {
        status.textContent =
          "❌ Oops! There was a problem sending your message.";
        status.style.color = "red";
      }
    } catch (err) {
      status.textContent = "❌ Network error. Please try again later.";
      status.style.color = "red";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
}


const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");

if (emailInput && emailError) {
  emailInput.addEventListener("input", function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailPattern.test(emailInput.value)) {
      emailError.style.display = "block";
    } else {
      emailError.style.display = "none";
    }
  });
 }
});
