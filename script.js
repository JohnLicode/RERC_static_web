document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

  function handleNavigation(targetId, clickedItem, items) {
    // Remove active class from all items
    items.forEach((item) => item.classList.remove("active"));

    // Add active class to the clicked item
    clickedItem.classList.add("active");

    // Scroll to the target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Desktop navigation click handlers
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Only prevent default for in-page links (#)
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, navItems);
      }
      // If it's "about.html" or another page → allow normal navigation
    });
  });

  // Mobile navigation click handlers
  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, mobileNavItems);

        // Sync desktop nav active state
        navItems.forEach((navItem) => {
          navItem.classList.remove("active");
          if (navItem.getAttribute("href") === href) {
            navItem.classList.add("active");
          }
        });
      }
      // If it's "about.html" → it will load normally
    });
  });

  // Highlight active nav item on scroll
  window.addEventListener("scroll", () => {
    let current = "";

    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 60) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });

    mobileNavItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });
});






