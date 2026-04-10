document.addEventListener("DOMContentLoaded", () => {
  const navMenu = document.getElementById("navMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (!navMenu || !mobileMenuBtn) return;

  const closeBtn = navMenu.querySelector(".close");
  const navLinks = navMenu.querySelectorAll("a");
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  const closeMenu = () => {
    navMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.removeProperty("overflow");
  };

  const openMenu = () => {
    navMenu.classList.add("active");
    mobileMenuBtn.classList.add("active");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  mobileMenuBtn.setAttribute("aria-controls", "navMenu");
  mobileMenuBtn.setAttribute("aria-expanded", "false");

  mobileMenuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches) return;
    if (!navMenu.classList.contains("active")) return;

    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedButton = mobileMenuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!mobileQuery.matches) {
      closeMenu();
    }
  });
});
