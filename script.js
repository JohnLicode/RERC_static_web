document.addEventListener("DOMContentLoaded", function () {
  // Navigation
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

  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, mobileNavItems);
        navItems.forEach(navItem => {
          navItem.classList.remove("active");
          if (navItem.getAttribute("href") === href) navItem.classList.add("active");
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
  const isIndexPage = currentPage === '' || currentPage === 'index.html';
  const candidateMainIds = ['about','resources','contacts','updates'];
  const pageMainSectionId = candidateMainIds.find(id => document.getElementById(id)) || 'home';

  // Helper to set active state across both menus
  function setActiveForHref(href) {
    navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === href));
    mobileNavItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === href));
  }

  // Initial activation: prefer URL hash; else page main section
  (function initialNavActivation() {
    const hash = window.location.hash;
    const hashId = hash ? hash.substring(1) : '';
    let initialId = '';

    if (hashId && document.getElementById(hashId)) {
      initialId = hashId;
    } else if (isIndexPage) {
      initialId = 'home';
    } else {
      initialId = pageMainSectionId;
    }
    setActiveForHref(`#${initialId}`);
  })();

  // FIXED: Highlight nav item on scroll + move nav + back to top button
  window.addEventListener("scroll", () => {
    let current = "";
    // Ignore #home on non-index pages so main section is highlighted first
    const sections = Array.from(document.querySelectorAll("section[id]"))
      .filter(sec => {
        if (isIndexPage) return sec.id !== 'updates'; // keep Home highlighted on index
        return sec.id !== 'home'; // ignore Home on other pages
      });
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 60) current = section.getAttribute("id");
    });
    // Ensure something is highlighted at the very top
    if (!current) current = isIndexPage ? 'home' : pageMainSectionId;
    setActiveForHref(`#${current}`);
    
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

  // Progress Bar
  const progressBar = document.getElementById("progress-bar");
  window.addEventListener("scroll", () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (window.scrollY / scrollTotal) * 100;
    progressBar.style.width = `${scrollProgress}%`;
  });

  // Background Slideshow
  const bgImages = ["img/psu_bg2.png", "img/psu_bg.jpg", "img/psu_bg3.jpg"];
  let bgIndex = 0;
  const homePage = document.querySelector(".home_page");
  if (homePage) {
    homePage.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
    setInterval(() => {
      bgIndex = (bgIndex + 1) % bgImages.length;
      homePage.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
    }, 4000);
  }

  // Scroll reveal (exclude hero `.home_page`)
  (function setupScrollReveal() {
    const candidates = Array.from(document.querySelectorAll(
      "section:not(.home_page) h1, section:not(.home_page) h2, section:not(.home_page) h3, section:not(.home_page) h4, section:not(.home_page) p, section:not(.home_page) .review_card, section:not(.home_page) .carousel, section:not(.home_page) .process-flow-container, section:not(.home_page) .about-container, section:not(.home_page) .mvv-block, section:not(.home_page) .v-block, section:not(.home_page) .contacts-container, section:not(.home_page) .additional-info, section:not(.home_page) .resources-container .forms-section, section:not(.home_page) .resource-card"
    ));
    if (candidates.length === 0) return;

    candidates.forEach(el => el.classList.add("reveal"));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    candidates.forEach(el => observer.observe(el));

    // Persist revealed state after first animation ends
    document.addEventListener('transitionend', function onEnd(e) {
      const el = e.target;
      if (el.classList && el.classList.contains('reveal-visible')) {
        el.classList.add('reveal-done');
        el.classList.remove('reveal');
        el.classList.remove('reveal-visible');
      }
    }, true);
  })();

  // Carousel
  const carouselContainer = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  let index = 0;
  let dots = [];

  if (carouselContainer && slides.length > 0 && indicatorsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => showSlide(i));
      indicatorsContainer.appendChild(dot);
      dots.push(dot);
    });

    function showSlide(n) {
      if (n < 0) index = 0;
      else if (n >= slides.length) index = slides.length - 1;
      else index = n;
      carouselContainer.style.transform = `translateX(${-index * 100}%)`;
      updateDots();
      updateButtons();
    }

    function updateDots() { dots.forEach((dot, i) => dot.classList.toggle('active', i === index)); }
    function updateButtons() { 
      if (prevBtn) prevBtn.disabled = index === 0; 
      if (nextBtn) nextBtn.disabled = index === slides.length - 1; 
    }

    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(index + 1));

    // Swipe support
    let startX = 0, isSwipe = false;
    carouselContainer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isSwipe = false; });
    carouselContainer.addEventListener('touchmove', e => { if (Math.abs(e.touches[0].clientX - startX) > 10) isSwipe = true; });
    carouselContainer.addEventListener('touchend', e => {
      if (isSwipe) {
        if (startX - e.changedTouches[0].clientX > 50) showSlide(index + 1);
        else if (e.changedTouches[0].clientX - startX > 50) showSlide(index - 1);
      }
    });

    showSlide(0);
  }

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-image");
  const closeBtn = document.querySelector(".lightbox .close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let lightboxIndex = 0;

  // Open lightbox on image click
  if (slides && slides.length > 0) {
    slides.forEach((slide, i) => {
      const img = slide.querySelector("img");
      if (img && lightbox && lightboxImg) {
        img.addEventListener("click", (e) => {
          e.preventDefault();
          lightbox.style.display = "flex";
          document.body.style.overflow = "hidden";
          document.body.classList.add("lightbox-open");
          lightboxIndex = i;
          showLightboxSlide(lightboxIndex);
          if (progressBar) progressBar.classList.add("hidden-during-lightbox");
        });
      }
    });
  }

  function showLightboxSlide(n) {
    if (n < 0) lightboxIndex = 0;
    else if (n >= slides.length) lightboxIndex = slides.length - 1;
    else lightboxIndex = n;

    const imgSrc = slides[lightboxIndex].querySelector("img").src;
    if (lightboxImg) lightboxImg.src = imgSrc;
    
    // Reset zoom and pan when changing slides
    resetImageTransform();
  }

  // Close lightbox
  if (closeBtn && lightbox) {
    closeBtn.addEventListener("click", () => {
      lightbox.style.display = "none";
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
      if (progressBar) progressBar.classList.remove("hidden-during-lightbox");
      resetImageTransform();
    });
  }

  // Navigation inside lightbox
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => showLightboxSlide(lightboxIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => showLightboxSlide(lightboxIndex + 1));

  // Close lightbox with escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.style.display === "flex") {
      lightbox.style.display = "none";
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
      if (progressBar) progressBar.classList.remove("hidden-during-lightbox");
      resetImageTransform();
    }
  });

  // Close lightbox when clicking outside the image
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
        document.body.classList.remove("lightbox-open");
        if (progressBar) progressBar.classList.remove("hidden-during-lightbox");
        resetImageTransform();
      }
    });
  }

  // Lightbox touch swipe for navigation
  let touchStartX = 0, touchEndX = 0;
  let touchStartY = 0, touchEndY = 0;
  
  if (lightboxImg) {
    lightboxImg.addEventListener("touchstart", e => {
      // Only handle single touch for navigation swipe
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });
    
    lightboxImg.addEventListener("touchend", e => {
      if (e.changedTouches.length === 1 && !isDragging) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const swipeDistanceX = touchStartX - touchEndX;
        const swipeDistanceY = Math.abs(touchStartY - touchEndY);
        
        // Only trigger navigation if horizontal swipe is dominant and significant
        if (Math.abs(swipeDistanceX) > 50 && swipeDistanceY < 100) {
          if (swipeDistanceX > 0) showLightboxSlide(lightboxIndex + 1);
          else showLightboxSlide(lightboxIndex - 1);
        }
      }
      touchStartX = 0; 
      touchEndX = 0;
      touchStartY = 0;
      touchEndY = 0;
    });
  }

  // FIXED ZOOM AND PAN FUNCTIONALITY
  let scale = 1;
  let originX = 0;
  let originY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;

  function updateTransform() {
    if (lightboxImg) {
      lightboxImg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    }
  }

  function limitPan() {
    if (scale <= 1) {
      originX = 0;
      originY = 0;
      return;
    }
    
    if (!lightbox || !lightboxImg) return;
    
    const lbRect = lightbox.getBoundingClientRect();
    const imgRect = lightboxImg.getBoundingClientRect();
    
    // Calculate the scaled dimensions
    const scaledWidth = lightboxImg.naturalWidth * scale;
    const scaledHeight = lightboxImg.naturalHeight * scale;
    
    // Calculate max pan distances
    const maxPanX = Math.max((scaledWidth - lbRect.width) / 2, 0);
    const maxPanY = Math.max((scaledHeight - lbRect.height) / 2, 0);
    
    originX = Math.min(Math.max(originX, -maxPanX), maxPanX);
    originY = Math.min(Math.max(originY, -maxPanY), maxPanY);
  }

  function resetImageTransform() {
    scale = 1;
    originX = 0;
    originY = 0;
    isDragging = false;
    updateTransform();
    if (lightboxImg) lightboxImg.style.cursor = scale > 1 ? "grab" : "default";
  }

  // Zoom function
  function zoom(delta, centerX, centerY) {
    if (!lightboxImg) return;
    
    const prevScale = scale;
    scale += delta;
    scale = Math.min(Math.max(scale, 1), 4); // Allow up to 4x zoom

    if (scale > 1) {
      // Adjust origin to zoom toward the cursor/center point
      const rect = lightboxImg.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;
      const imgCenterY = rect.top + rect.height / 2;
      
      originX = (originX - (centerX - imgCenterX)) * (scale / prevScale) + (centerX - imgCenterX);
      originY = (originY - (centerY - imgCenterY)) * (scale / prevScale) + (centerY - imgCenterY);
    } else {
      originX = 0;
      originY = 0;
    }

    limitPan();
    updateTransform();
    lightboxImg.style.cursor = scale > 1 ? "grab" : "default";
  }

  // Mouse wheel zoom
  if (lightbox) {
    lightbox.addEventListener("wheel", e => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        zoom(delta, e.clientX, e.clientY);
      }
    }, { passive: false });
  }

  // Keyboard zoom
  document.addEventListener("keydown", e => {
    if (!lightbox || lightbox.style.display !== "flex") return;
    if (!e.ctrlKey) return;
    
    e.preventDefault();
    const rect = lightboxImg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    if (e.key === "=" || e.key === "+") zoom(0.2, centerX, centerY);
    else if (e.key === "-") zoom(-0.2, centerX, centerY);
  });

  // FIXED MOUSE DRAG FUNCTIONALITY
  if (lightboxImg) {
    lightboxImg.addEventListener("mousedown", e => {
      if (e.button !== 0 || scale <= 1) return; // Only left click and when zoomed
      
      e.preventDefault();
      isDragging = true;
      
      // Store the starting mouse position and current image position
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragOriginX = originX;
      dragOriginY = originY;
      
      lightboxImg.style.cursor = "grabbing";
      
      // Prevent text selection during drag
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      // Calculate the distance moved
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      
      // Update origin based on initial position + delta
      originX = dragOriginX + deltaX;
      originY = dragOriginY + deltaY;
      
      limitPan();
      updateTransform();
    });

    document.addEventListener("mouseup", e => {
      if (isDragging) {
        isDragging = false;
        lightboxImg.style.cursor = scale > 1 ? "grab" : "default";
        document.body.style.userSelect = "";
      }
    });

    // Handle mouse leave to stop dragging
    document.addEventListener("mouseleave", e => {
      if (isDragging) {
        isDragging = false;
        lightboxImg.style.cursor = scale > 1 ? "grab" : "default";
        document.body.style.userSelect = "";
      }
    });

    // TOUCH DRAG FOR MOBILE
    let touchDragStartX = 0;
    let touchDragStartY = 0;
    let touchDragOriginX = 0;
    let touchDragOriginY = 0;
    let isTouchDragging = false;

    lightboxImg.addEventListener("touchstart", e => {
      if (e.touches.length === 1 && scale > 1) {
        isTouchDragging = true;
        touchDragStartX = e.touches[0].clientX;
        touchDragStartY = e.touches[0].clientY;
        touchDragOriginX = originX;
        touchDragOriginY = originY;
        e.preventDefault();
      }
    }, { passive: false });

    lightboxImg.addEventListener("touchmove", e => {
      if (isTouchDragging && e.touches.length === 1) {
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - touchDragStartX;
        const deltaY = e.touches[0].clientY - touchDragStartY;
        
        originX = touchDragOriginX + deltaX;
        originY = touchDragOriginY + deltaY;
        
        limitPan();
        updateTransform();
      }
    }, { passive: false });

    lightboxImg.addEventListener("touchend", e => {
      isTouchDragging = false;
    });

    // Double-tap to zoom on mobile
    let lastTap = 0;
    lightboxImg.addEventListener("touchend", e => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0 && e.changedTouches.length === 1) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        if (scale === 1) {
          zoom(1, touch.clientX, touch.clientY); // Zoom to 2x
        } else {
          resetImageTransform(); // Reset to 1x
        }
      }
      
      lastTap = currentTime;
    });

    // Initialize cursor style
    lightboxImg.style.cursor = "default";
  }

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

    // Forms functionality
    initializeFormsSections();
});

// Filter tags configuration
const filterTags = [
    { id: 'committee', label: 'Committee' },
    { id: 'review', label: 'Review Process' },
    { id: 'post-approval', label: 'Post-Approval' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'meeting', label: 'Meetings' },
    { id: 'communication', label: 'Communications' },
    { id: 'site-visit', label: 'Site Visit' },
    { id: 'queries', label: 'Queries & SOP' }
];

// Map tag id to lowercased label for search matching
const tagIdToLowerLabel = Object.fromEntries(filterTags.map(t => [t.id, t.label.toLowerCase()]));

// Forms data object
const formsData = {
    "Section 1: Committee Management": {
        forms: [
            {
                id: "1.1A",
                title: "PSURERC Form 1.1A",
                description: "Responsibilities and Qualifications of Members and Officers",
                filename: "PSURERC Form 1.1A Responsibilities and Qualifications of Members and Officers.docx",
                tags: ["committee", "members", "qualifications", "officers"]
            },
            {
                id: "1.1B",
                title: "PSURERC Form 1.1B",
                description: "Appointment Letter for Non-affiliate Non-Scientist Regular Member",
                filename: "PSURERC FORM 1.1B Appointment Letter for Non-affiliate Non-Scientist Regular Member.docx",
                tags: ["committee", "appointment", "non-affiliate", "non-scientist"]
            },
            {
                id: "1.1C",
                title: "PSURERC Form 1.1C",
                description: "Appointment Letter for Non-affiliate Scientist Regular Member",
                filename: "PSURERC FORM 1.1C Appointment Letter for Non-affiliate Scientist Regular Member .docx",
                tags: ["committee", "appointment", "non-affiliate", "scientist"]
            },
            {
                id: "1.1D",
                title: "PSURERC Form 1.1D",
                description: "Appointment Letter for Affiliate Regular Member",
                filename: "PSURERC FORM 1.1D Appointment Letter for Affiliate Regular Member.docx",
                tags: ["committee", "appointment", "affiliate"]
            },
            {
                id: "1.1E",
                title: "PSURERC Form 1.1E",
                description: "Conflict of Interest Disclosure and Confidentiality Agreement",
                filename: "PSURERC Form 1.1E Conflict of Interest Disclosure and Confidentiality Agreement .docx",
                tags: ["committee", "disclosure", "confidentiality"]
            },
            {
                id: "1.1F",
                title: "PSURERC Form 1.1F",
                description: "Curriculum Vitae of Members",
                filename: "PSURERC Form 1.1F Curriculum Vitae of Member.docx",
                tags: ["committee", "cv", "members"]
            },
            {
                id: "1.1G",
                title: "PSURERC Form 1.1G",
                description: "Endorsement of Regular Members",
                filename: "PSURERC Form 1.1G Endorsement of Regular Members.docx",
                tags: ["committee", "endorsement", "members"]
            },
            {
                id: "1.2A",
                title: "PSURERC Form 1.2A",
                description: "Endorsement of Officers",
                filename: "PSURERC Form 1.2A Endorsement of Officers.docx",
                tags: ["committee", "endorsement", "officers"]
            },
            {
                id: "1.2B",
                title: "PSURERC Form 1.2B",
                description: "Appointment of Officers",
                filename: "PSURERC Form 1.2B Appointment of Officers.docx",
                tags: ["committee", "appointment", "officers"]
            },
            {
                id: "1.3A",
                title: "PSURERC Form 1.3A",
                description: "Responsibilities and Qualifications of Independent Consultants",
                filename: "PSURERC Form 1.3A Responsibilities and Qualifications of Independent Consultants.docx",
                tags: ["committee", "consultants", "qualifications"]
            },
            {
                id: "1.3B",
                title: "PSURERC Form 1.3B",
                description: "Appointment Letter for Non-affiliate Independent Consultants",
                filename: "PSURERC FORM 1.3B Appointment Letter for Non-affiliate Independent Consultant.docx",
                tags: ["committee", "consultants", "appointment", "non-affiliate"]
            },
            {
                id: "1.3C",
                title: "PSURERC Form 1.3C",
                description: "Appointment Letter for Affiliate Independent Consultants",
                filename: "PSURERC FORM 1.3C Appointment Letter for Affiliate Independent Consultants.docx",
                tags: ["committee", "consultants", "appointment", "affiliate"]
            },
            {
                id: "1.3D",
                title: "PSURERC Form 1.3D",
                description: "Endorsement of Independent Consultants",
                filename: "PSURERC Form 1.3D Endorsement of Independent Consultants.docxpdf",
                tags: ["committee", "consultants", "endorsement"]
            }
        ]
    },

    "Section 2: Protocol Review": {
        forms: [
            {
                id: "2.1A",
                title: "PSURERC Form 2.1A",
                description: "Application for Review",
                filename: "PSURERC Form 2.1A Application for Review.docx",
                tags: ["review", "application", "initial"]
            },
            {
                id: "2.1B",
                title: "PSURERC Form 2.1B",
                description: "Application for Review Checklist",
                filename: "PSURERC Form 2.1B Application  for Review Checklist.docx",
                tags: ["review", "checklist", "initial"]
            },
            {
                id: "2.1C",
                title: "PSURERC Form 2.1C",
                description: "Worksheet for Initial Protocol Assessment",
                filename: "PSURERC Form 2.1C Worksheet for Initial Protocol Assessment Form.docx",
                tags: ["review", "assessment", "initial"]
            },
            {
                id: "2.1D",
                title: "PSURERC Form 2.1D",
                description: "Assignment of Reviewers",
                filename: "PSURERC Form 2.1D Assignment of Reviewers.docx",
                tags: ["review", "reviewers", "assignment"]
            },
            {
                id: "2.1E",
                title: "PSURERC Form 2.1E",
                description: "Exemption Letter",
                filename: "PSURERC Form 2.1E Exemption Letter.docx",
                tags: ["review", "exemption"]
            },
            {
                id: "2.1F",
                title: "PSURERC Form 2.1F",
                description: "Protocol Database Template",
                filename: "PSURERC Form 2.1F Protocol Database Template.docx",
                tags: ["review", "database", "template"]
            },
            {
                id: "2.2A",
                title: "PSURERC Form 2.2A",
                description: "Resubmitted Study Protocol Assessment Form",
                filename: "PSURERC Form 2.2A Resubmitted Study Protocol Assessment Form.docx",
                tags: ["review", "assessment", "resubmission"]
            }
        ]
    },

    "Section 3: Post-Approval": {
        forms: [
            {
                id: "3.1A",
                title: "PSURERC Form 3.1A",
                description: "Progress Report Form",
                filename: "PSURERC Form 3.1A Progress Report Form.docx",
                tags: ["post-approval", "progress", "report"]
            },
            {
                id: "3.1B",
                title: "PSURERC Form 3.1B",
                description: "Assessment Form for Post-Approval Reports and Applications",
                filename: "PSURERC Form 3.1B Assessment Form for Post-Approval Reports and Applications.docx",
                tags: ["post-approval", "assessment"]
            },
            {
                id: "3.1C",
                title: "PSURERC Form 3.1C",
                description: "Action Letter to Post-Approval Reports and Applications",
                filename: "PSURERC Form 3.1C Action Letter to Post-Approval Reports and Applications.docx",
                tags: ["post-approval", "action-letter"]
            },
            {
                id: "3.2",
                title: "PSURERC Form 3.2",
                description: "Early Study Termination Application/Report Form",
                filename: "PSURERC Form 3.2 Early Study Termination Application Form.docx",
                tags: ["post-approval", "termination"]
            },
            {
                id: "3.3",
                title: "PSURERC Form 3.3",
                description: "Amendment Request Form",
                filename: "PSURERC Form 3.3 Amendment Request Form.docx",
                tags: ["post-approval", "amendment"]
            },
            {
                id: "3.4",
                title: "PSURERC Form 3.4",
                description: "Protocol Deviation and Violation Report",
                filename: "PSURERC Form 3.4 Protocol Deviation Report.docx",
                tags: ["post-approval", "deviation", "violation"]
            },
            {
                id: "3.5A",
                title: "PSURERC Form 3.5A",
                description: "Reportable Negative Event Report",
                filename: "PSURERC Form 3.5A Reportable Negative Event Report.docx",
                tags: ["post-approval", "negative-event"]
            },
            {
                id: "3.5B",
                title: "PSURERC Form 3.5B",
                description: "SAE and SUSAR Report Form",
                filename: "PSURERC Form 3.5B SAE and SUSAR Report Form.docx",
                tags: ["post-approval", "sae", "susar"]
            },
            {
                id: "3.6A",
                title: "PSURERC Form 3.6A",
                description: "Continuing Review Application Form",
                filename: "PSURERC Form 3.6A Continuing Review Application Form.docx",
                tags: ["post-approval", "continuing-review"]
            },
            {
                id: "3.6B",
                title: "PSURERC Form 3.6B",
                description: "Summary of Reports and Decisions on Protocol",
                filename: "PSURERC Form 3.6B Summary of Reports and Decisions on Protocol.docx",
                tags: ["post-approval", "summary", "decisions"]
            },
            {
                id: "3.7",
                title: "PSURERC Form 3.7",
                description: "Final Report Form",
                filename: "PSURERC Form 3.7 Final Report Form.docx",
                tags: ["post-approval", "final-report"]
            }
        ]
    },

    "Section 4: Assessment and Decision": {
        forms: [
            {
                id: "4.1A",
                title: "PSURERC Form 4.1A",
                description: "Study Protocol Assessment Form",
                filename: "PSURERC Form 4.1A  Study Protocol Assessment Form.docx",
                tags: ["assessment", "protocol"]
            },
            {
                id: "4.1B",
                title: "PSURERC Form 4.1B",
                description: "Informed Consent Assessment Form",
                filename: "PSURERC Form 4.1B Informed Consent Assessment Form.docx",
                tags: ["assessment", "informed-consent"]
            },
            {
                id: "4.1C",
                title: "PSURERC Form 4.1C",
                description: "Action Letter to Study Protocol Submissions and Resubmissions",
                filename: "PSURERC Form 4.1C  Action Letter to Study Protocol Submissions and Resubmissions.docx",
                tags: ["assessment", "action-letter", "submission"]
            },
            {
                id: "4.1D",
                title: "PSURERC Form 4.1D",
                description: "Ethics Clearance",
                filename: "PSURERC Form 4.1D Ethics Clearance.docx",
                tags: ["assessment", "clearance"]
            },
            {
                id: "4.1E",
                title: "PSURERC Form 4.1E",
                description: "Protocol Assessment Form for Independent Consultant",
                filename: "PSURERC Form 4.1E Protocol Assessment Form for Independent Consultant.docx",
                tags: ["assessment", "protocol", "consultant"]
            },
            {
                id: "4.1F",
                title: "PSURERC Form 4.1F",
                description: "Approval Letter to Study Protocol Submissions and Resubmissions",
                filename: "PSURERC Form 4.1F Approval Letter to Study Protocol Submissions and Resubmissions.docx",
                tags: ["assessment", "approval", "submission"]
            }
        ]
    },

    "Section 5: Meeting Management": {
        forms: [
            {
                id: "5.1",
                title: "PSURERC Form 5.1",
                description: "Non-Disclosure Agreement for Non-Members",
                filename: "PSURERC Form 5.1 Non-Disclosure Agreement for Non-Members.docx",
                tags: ["meeting", "non-disclosure", "non-members"]
            },
            {
                id: "5.2",
                title: "PSURERC Form 5.2",
                description: "Notice of Meeting and Agenda Template",
                filename: "PSURERC Form 5.2 Notice of Meeting and Agenda.docx",
                tags: ["meeting", "agenda", "notice"]
            },
            {
                id: "5.4",
                title: "PSURERC Form 5.4",
                description: "Minutes of the Meeting Template",
                filename: "PSURERC Form 5.4 Minutes of the Meeting Template.docx",
                tags: ["meeting", "minutes", "template"]
            }
        ]
    },

    "Section 7: Communication Records": {
        forms: [
            {
                id: "7.1A",
                title: "PSURERC Form 7.1A",
                description: "Logbook of Incoming Communications (Administrative Files)",
                filename: "PSURERC Form 7.1A Logbook of Incoming Communications  (Administrative Files).docx",
                tags: ["communication", "incoming", "administrative"]
            },
            {
                id: "7.1B",
                title: "PSURERC Form 7.1B",
                description: "Logbook of Incoming Communications (Protocol-Related Files)",
                filename: "PSURERC Form 7.1B Logbook of Incoming Communications (Protocol-Related Files).docx",
                tags: ["communication", "incoming", "protocol"]
            },
            {
                id: "7.2A",
                title: "PSURERC Form 7.2A",
                description: "Logbook of Outgoing Communications (Administrative Files)",
                filename: "PSURERC Form 7.2A Logbook of Outgoing Communications (Administrative Files).docx",
                tags: ["communication", "outgoing", "administrative"]
            },
            {
                id: "7.2B",
                title: "PSURERC Form 7.2B",
                description: "Logbook of Outgoing Communications (Protocol-Related Files)",
                filename: "PSURERC Form 7.2B Logbook of Outgoing Communication (Protocol-Related Files).docx",
                tags: ["communication", "outgoing", "protocol"]
            },
            // {
            //     id: "7.5",
            //     title: "PSURERC Form 7.5",
            //     description: "Request to Access Files",
            //     filename: "PSURERC-Form-7-5.pdf",
            //     tags: ["communication", "access", "request"]
            // }
        ]
    },

    "Section 8: Site Visit": {
        forms: [
            {
                id: "8A",
                title: "PSURERC Form 8A",
                description: "Notification of Selection as Member of Site Visit Team",
                filename: "PSURERC Form 8A Notice of Selection as Site Visit Team member.docx",
                tags: ["site-visit", "team", "notification"]
            },
            {
                id: "8B",
                title: "PSURERC Form 8B",
                description: "Site Visit Report Form",
                filename: "PSURERC Form 8B Site Visit Report Form.docx",
                tags: ["site-visit", "report"]
            }
        ]
    },

    "Section 9-11: Queries and SOP": {
        forms: [
            {
                id: "9A",
                title: "PSURERC Form 9A",
                description: "Queries, Complaints, Notification Form",
                filename: "PSURERC Form 9A Queries, Complaints, Notification Form.docx",
                tags: ["queries", "complaints", "notification"]
            },
            {
                id: "9B",
                title: "PSURERC Form 9B",
                description: "Logbook of Queries, Complaints, or Notifications",
                filename: "PSURERC Form 9B Logbook of Queries, Complaints, or Notifications.docx",
                tags: ["queries", "complaints", "logbook"]
            },
            {
                id: "9C",
                title: "PSURERC Form 9C",
                description: "Action Letter to Queries, Complaints, or Notifications",
                filename: "PSURERC Form 9C Action Letter to Queries, Complaints, or Notifications.docx",
                tags: ["queries", "complaints", "action-letter"]
            },
            {
                id: "10",
                title: "PSURERC Form 10",
                description: "Action Letter to Appeal",
                filename: "PSURERC Form 10 Action Letter to Appeal.docx",
                tags: ["appeal", "action-letter"]
            },
            {
                id: "11A",
                title: "PSURERC Form 11A",
                description: "Request for Creation/Revision of an SOP",
                filename: "PSURERC Form 11A Request for Writing of New SOP-Revision of SOP.docx",
                tags: ["sop", "creation", "revision"]
            },
            {
                id: "11B",
                title: "PSURERC Form 11B",
                description: "SOP or Guideline Cover Page and Content Template",
                filename: "PSURERC Form 11B SOP or Guideline Cover Page and Content Template.docx",
                tags: ["sop", "template", "guideline"]
            }
        ]
    }
};



// Forms section initialization
function initializeFormsSections() {
    const resourcesContainer = document.querySelector('.resources-container');
    if (!resourcesContainer) return;

    // Clear existing content but keep the header
    const header = resourcesContainer.querySelector('.resources-header');
    resourcesContainer.innerHTML = '';
    if (header) resourcesContainer.appendChild(header);

    // Create search and filter interface
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-input-wrapper">
            <input 
                type="text" 
                id="formSearch" 
                placeholder="Search forms..."
            >
            <button id="searchBtn" class="search-btn" type="button">
                <i class="fas fa-search"></i>
            </button>
        </div>
        <div class="filter-tags">
            ${filterTags.map(tag => `
                <button class="filter-tag" data-tag="${tag.id}">
                    ${tag.label}
                    <span class="tag-count">0</span>
                </button>
            `).join('')}
        </div>
    `;
    resourcesContainer.appendChild(searchContainer);

    // Add sections container
    const sectionsContainer = document.createElement('div');
    sectionsContainer.id = 'sectionsContainer';
    sectionsContainer.className = 'forms-sections-container';
    resourcesContainer.appendChild(sectionsContainer);

    // Initialize functionality
    updateTagCounts();
    renderSections();
    initializeEventListeners();
}

function updateTagCounts(searchTerm = '') {
    const normalizedSearch = searchTerm.toLowerCase();

    filterTags.forEach(tag => {
        let count = 0;
        Object.entries(formsData).forEach(([sectionName, section]) => {
            count += section.forms.filter(form => {
                const matchesTagsField = form.tags.some(t => {
                    const label = tagIdToLowerLabel[t] || '';
                    return t.toLowerCase().includes(normalizedSearch) || label.includes(normalizedSearch);
                });
                const matchesSearch = !normalizedSearch ||
                    form.title.toLowerCase().includes(normalizedSearch) ||
                    form.description.toLowerCase().includes(normalizedSearch) ||
                    form.id.toLowerCase().includes(normalizedSearch) ||
                    (form.filename && form.filename.toLowerCase().includes(normalizedSearch)) ||
                    matchesTagsField ||
                    sectionName.toLowerCase().includes(normalizedSearch);
                const hasTag = form.tags.includes(tag.id);
                return matchesSearch && hasTag;
            }).length;
        });
        const countElement = document.querySelector(`[data-tag="${tag.id}"] .tag-count`);
        if (countElement) countElement.textContent = count;
    });
}

function renderSections(searchTerm = '', activeTags = []) {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(formsData).forEach(([sectionName, section]) => {
        const normalizedSearch = (searchTerm || '').toLowerCase();
        const filteredForms = section.forms.filter(form => {
            const matchesTagsField = form.tags.some(t => {
                const label = tagIdToLowerLabel[t] || '';
                return t.toLowerCase().includes(normalizedSearch) || label.includes(normalizedSearch);
            });
            const matchesSearch = !normalizedSearch || 
                form.title.toLowerCase().includes(normalizedSearch) || 
                form.description.toLowerCase().includes(normalizedSearch) ||
                form.id.toLowerCase().includes(normalizedSearch) ||
                (form.filename && form.filename.toLowerCase().includes(normalizedSearch)) ||
                matchesTagsField ||
                sectionName.toLowerCase().includes(normalizedSearch);

            const matchesTags = activeTags.length === 0 || 
                activeTags.some(tag => form.tags.includes(tag));

            return matchesSearch && matchesTags;
        });

        if (filteredForms.length > 0) {
            container.appendChild(createSectionElement(sectionName, filteredForms));
        }
    });
}

function createSectionElement(title, forms) {
    const section = document.createElement('div');
    section.className = 'forms-section';
    
    section.innerHTML = `
        <div class="section-header">
            <h3>${title}</h3>
            <span class="toggle-icon">+</span>
        </div>
        <div class="section-content" style="max-height: 0;">
            ${forms.map(form => `
                <div class="form-card">
                    <h4>${form.title}</h4>
                    <p>${form.description}</p>
                    <div class="form-tags">
                        ${form.tags.map(tag => `
                            <span class="form-tag">${tag}</span>
                        `).join('')}
                    </div>
                    <a href="resources_files/${form.filename}" class="download-btn" download>
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
            `).join('')}
        </div>
    `;

    // Add collapsible functionality
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    const icon = header.querySelector('.toggle-icon');

    header.addEventListener('click', () => {
        const isActive = header.classList.toggle('active');
        icon.textContent = isActive ? '-' : '+';
        
        if (isActive) {
            // Set fixed height for scrolling
            content.style.maxHeight = '300px';
        } else {
            // Close the section
            content.style.maxHeight = '0';
        }
    });

    return section;
}

function initializeEventListeners() {
    const searchInput = document.getElementById('formSearch');
    const filterButtons = document.querySelectorAll('.filter-tag');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        // Live typing search
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim();
            const activeTags = Array.from(document.querySelectorAll('.filter-tag.active'))
                .map(btn => btn.dataset.tag);
            renderSections(searchTerm, activeTags);
            updateTagCounts(searchTerm);
        });

        // ✅ Trigger search on Enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // stop form submission / page refresh
                if (searchBtn) searchBtn.click(); // reuse your existing click logic
            }
        });
    }

    // Filter button toggles
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            const activeTags = Array.from(document.querySelectorAll('.filter-tag.active'))
                .map(btn => btn.dataset.tag);
            renderSections(searchTerm, activeTags);
            updateTagCounts(searchTerm);
        });
    });

    // Search button click
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        console.log("🔎 Search button clicked! Term:", searchTerm); // <== debug log

        const activeTags = Array.from(document.querySelectorAll('.filter-tag.active'))
          .map(btn => btn.dataset.tag);
        renderSections(searchTerm, activeTags);
        updateTagCounts(searchTerm);
      });
    }
}