document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".bottom-nav");
  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  // ✅ Get the back to top button
  const backToTopButton = document.getElementById('backToTop');

  // ✅ ADD THIS: Debug check - make sure button exists
  if (backToTopButton) {
    console.log("Back to top button found!");
  } else {
    console.log("Back to top button NOT found - check HTML!");
  }

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

  // Highlight nav item on scroll + move nav + back to top button
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

    // Move nav from bottom to top once you scroll past hero
    if (window.scrollY > window.innerHeight * 0.5) {
      nav.classList.add("move-to-top");
    } else {
      nav.classList.remove("move-to-top");
    }

    // ✅ FIXED: Back to top button with lower threshold and safety check
    if (backToTopButton) {
      // Changed from 300px to 100px for easier testing
      if (window.scrollY > 100) {
        backToTopButton.classList.add('show');
        console.log("Showing button at scroll:", window.scrollY); // Debug
      } else {
        backToTopButton.classList.remove('show');
        console.log("Hiding button at scroll:", window.scrollY); // Debug
      }
    }
  });

  // ✅ FIXED: Back to top button click with safety check
  if (backToTopButton) {
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent any default behavior
      console.log("Back to top clicked!"); // Debug
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Background Slideshow for .home_page
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