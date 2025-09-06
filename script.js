document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".bottom-nav");
  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

  function handleNavigation(targetId, clickedItem, items) {
    items.forEach((item) => item.classList.remove("active"));
    clickedItem.classList.add("active");

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Desktop nav clicks
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, navItems);
      }
    });
  });

  // Mobile nav clicks
  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, mobileNavItems);

        navItems.forEach((navItem) => {
          navItem.classList.remove("active");
          if (navItem.getAttribute("href") === href) {
            navItem.classList.add("active");
          }
        });
      }
    });
  });
  // Burger menu functionality
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;

  burgerMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileNavMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    body.classList.toggle('mobile-nav-open');
  });

  navOverlay.addEventListener('click', function() {
    burgerMenu.classList.remove('active');
    mobileNavMenu.classList.remove('active');
    this.classList.remove('active');
    body.classList.remove('mobile-nav-open');
  });
  // Get current page file name
  const currentPage = window.location.pathname.split("/").pop();

  // Select all desktop & mobile nav links
  const menuLinks = document.querySelectorAll(".nav-item, .mobile-nav-item");

  menuLinks.forEach(link => {
      // Get file name from link href
      const linkPage = link.getAttribute("href");

      // If current page matches the link, highlight it
      if (linkPage === currentPage) {
          link.classList.add("active");
      } else {
          link.classList.remove("active");
      }
  });

  // Highlight nav item on scroll + move nav
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

    // 👇 Move nav from bottom to top once you scroll past hero
    if (window.scrollY > window.innerHeight * 0.5) {
      nav.classList.add("move-to-top");
    } else {
      nav.classList.remove("move-to-top");
    }
  });
    // --- Background Slideshow for .home_page ---
  const bgImages = [
    "img/psu_bg2.png",
    "img/psu_bg.jpg",
    "img/psu_bg3.jpg"
  ];
  let bgIndex = 0;
  const homePage = document.querySelector(".home_page");
  if (homePage) {
    homePage.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
    homePage.style.backgroundSize = "cover";
    homePage.style.backgroundPosition = "center";
    homePage.style.backgroundRepeat = "no-repeat";
    setInterval(() => {
      bgIndex = (bgIndex + 1) % bgImages.length;
      homePage.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
    }, 4000);
  }
});
