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
    // ensure immediate visual feedback
    activateNavLink(clickedItem);

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Activate a nav link (and its mobile counterpart) immediately
  function activateNavLink(linkEl) {
    if (!linkEl) return;
    const href = linkEl.getAttribute('href');
    // clear previous
    navItems.forEach(i => {
      i.classList.remove('active');
      i.removeAttribute('aria-current');
    });
    mobileNavItems.forEach(i => {
      i.classList.remove('active');
      i.removeAttribute('aria-current');
    });

    // set on matching items (both nav and mobile)
    navItems.forEach(i => {
      if (i.getAttribute('href') === href) {
        i.classList.add('active');
        i.setAttribute('aria-current', 'page');
      }
    });
    mobileNavItems.forEach(i => {
      if (i.getAttribute('href') === href) {
        i.classList.add('active');
        i.setAttribute('aria-current', 'page');
      }
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // immediate activation for feedback
      activateNavLink(this);
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, navItems);
      }
      // for external/path links we let navigation proceed; activation remains until page unload
    });
  });

  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // immediate activation for feedback
      activateNavLink(this);
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        handleNavigation(targetId, this, mobileNavItems);
      }
      // close mobile nav after click
      if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        mobileNavMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('mobile-nav-open');
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
  // Detect true home page path only
  const pathname = window.location.pathname.toLowerCase();
  const normalizedPath = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;
  const isIndexPage = normalizedPath === '' || normalizedPath === '/' || normalizedPath === '/index.html';
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

  // Navbar stick-to-top behavior with spacer (smooth, no content snap)
  let navSpacer = null;
  let navStartY = 0;
  let navTicking = false;

  function navIsMobileHidden() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function navSetStuck(shouldStick) {
    if (!nav || !navSpacer) return;
    if (shouldStick) {
      if (!nav.classList.contains('is-stuck')) {
        nav.classList.add('is-stuck');
      }
      navSpacer.style.height = `${nav.offsetHeight}px`;
    } else {
      nav.classList.remove('is-stuck');
      navSpacer.style.height = '0px';
    }
  }

  function navRecalculateStart() {
    if (!nav) return;
    navSetStuck(false);
    navStartY = nav.getBoundingClientRect().top + window.scrollY;
  }

  function navUpdateStickyState() {
    if (!nav || !navSpacer) return;
    if (navIsMobileHidden()) {
      navSetStuck(false);
      return;
    }
    navSetStuck(window.scrollY >= navStartY);
  }

  if (nav) {
    navSpacer = document.createElement('div');
    navSpacer.className = 'bottom-nav-spacer';
    nav.parentNode.insertBefore(navSpacer, nav);
    navRecalculateStart();
    navUpdateStickyState();

    window.addEventListener('scroll', () => {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(() => {
        navUpdateStickyState();
        navTicking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', () => {
      navRecalculateStart();
      navUpdateStickyState();
    });

    window.addEventListener('load', () => {
      navRecalculateStart();
      navUpdateStickyState();
    });
  }

  // Highlight nav item on scroll + back-to-top button
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
  const bgImages = ["/assets/images/psu_bg2.png", "/assets/images/psu_bg.jpg", "/assets/images/psu_bg3.jpg"];
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

  // Lightbox touch swipe for navigation (only when not zoomed in)
  let touchStartX = 0, touchEndX = 0;
  let touchStartY = 0, touchEndY = 0;
  let lbTouchHasMoved = false; // shared flag: prevents tap-zoom from firing after a drag/swipe

  if (lightboxImg) {
    lightboxImg.addEventListener("touchstart", e => {
      if (e.touches.length === 1 && scale <= 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });

    // Track movement so tap-zoom doesn't fire after a swipe
    lightboxImg.addEventListener("touchmove", e => {
      if (e.touches.length === 1 && scale <= 1) {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 8 || dy > 8) lbTouchHasMoved = true;
      }
    });

    lightboxImg.addEventListener("touchend", e => {
      if (e.changedTouches.length === 1 && scale <= 1 && !lbTouchHasMoved) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        const swipeDistanceX = touchStartX - touchEndX;
        const swipeDistanceY = Math.abs(touchStartY - touchEndY);
        if (Math.abs(swipeDistanceX) > 50 && swipeDistanceY < 100) {
          lbTouchHasMoved = true; // block tap-zoom in the second touchend listener
          if (swipeDistanceX > 0) showLightboxSlide(lightboxIndex + 1);
          else showLightboxSlide(lightboxIndex - 1);
        }
      }
      touchStartX = 0; touchEndX = 0;
      touchStartY = 0; touchEndY = 0;
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

  // Mouse wheel zoom (no Ctrl required)
  if (lightbox) {
    lightbox.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      zoom(delta, e.clientX, e.clientY);
    }, { passive: false });
  }

  // Keyboard zoom (no Ctrl required)
  document.addEventListener("keydown", e => {
    if (!lightbox || lightbox.style.display !== "flex") return;
    if (e.key === "=" || e.key === "+") {
      e.preventDefault();
      const rect = lightboxImg.getBoundingClientRect();
      zoom(0.2, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if (e.key === "-") {
      e.preventDefault();
      const rect = lightboxImg.getBoundingClientRect();
      zoom(-0.2, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  });

  // FIXED MOUSE DRAG FUNCTIONALITY
  if (lightboxImg) {
    let carouselHasDragged = false;
    
    lightboxImg.addEventListener("mousedown", e => {
      if (e.button !== 0 || scale <= 1) return; // Only left click and when zoomed
      
      e.preventDefault();
      isDragging = true;
      carouselHasDragged = false; // Reset drag flag
      
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
      
      // Mark as dragged if moved more than 3 pixels
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        carouselHasDragged = true;
      }
      
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

    // Click to zoom (when not dragging) for carousel
    lightboxImg.addEventListener("click", e => {
      if (!carouselHasDragged && lightbox && lightbox.style.display === "flex") {
        e.preventDefault();
        if (scale === 1) {
          zoom(1, e.clientX, e.clientY); // Zoom to 2x
        } else {
          resetImageTransform(); // Reset to 1x
        }
      }
      carouselHasDragged = false; // Reset after click
    });

    // MOBILE: pan (1-finger drag), pinch-to-zoom (2-finger), single-tap toggle zoom
    let touchDragStartX = 0, touchDragStartY = 0;
    let touchDragOriginX = 0, touchDragOriginY = 0;
    let isTouchDragging = false;
    let lbPinching = false;
    let lbPinchStartDist = 0, lbPinchStartScale = 1;

    function getLbPinchDist(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    lightboxImg.addEventListener("touchstart", e => {
      if (e.touches.length === 2) {
        // Start pinch — cancel any single-finger drag
        lbPinching = true;
        isTouchDragging = false;
        lbTouchHasMoved = false;
        lbPinchStartDist = getLbPinchDist(e.touches);
        lbPinchStartScale = scale;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        lbPinching = false;
        lbTouchHasMoved = false;
        if (scale > 1) {
          // Start pan drag
          isTouchDragging = true;
          touchDragStartX = e.touches[0].clientX;
          touchDragStartY = e.touches[0].clientY;
          touchDragOriginX = originX;
          touchDragOriginY = originY;
          e.preventDefault();
        } else {
          isTouchDragging = false;
        }
      }
    }, { passive: false });

    lightboxImg.addEventListener("touchmove", e => {
      if (lbPinching && e.touches.length === 2) {
        e.preventDefault();
        const currentDist = getLbPinchDist(e.touches);
        const ratio = currentDist / lbPinchStartDist;
        const newScale = Math.min(Math.max(lbPinchStartScale * ratio, 1), 4);
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const prevScale = scale;
        scale = newScale;
        if (scale > 1) {
          const rect = lightboxImg.getBoundingClientRect();
          const imgCX = rect.left + rect.width / 2;
          const imgCY = rect.top  + rect.height / 2;
          originX = (originX - (cx - imgCX)) * (scale / prevScale) + (cx - imgCX);
          originY = (originY - (cy - imgCY)) * (scale / prevScale) + (cy - imgCY);
        } else {
          originX = 0; originY = 0;
        }
        limitPan();
        updateTransform();
        lightboxImg.style.cursor = scale > 1 ? "grab" : "default";
        lbTouchHasMoved = true;
      } else if (isTouchDragging && e.touches.length === 1 && scale > 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - touchDragStartX;
        const dy = e.touches[0].clientY - touchDragStartY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) lbTouchHasMoved = true;
        originX = touchDragOriginX + dx;
        originY = touchDragOriginY + dy;
        limitPan();
        updateTransform();
      }
    }, { passive: false });

    lightboxImg.addEventListener("touchend", e => {
      if (lbPinching) {
        if (e.touches.length < 2) lbPinching = false;
        lbTouchHasMoved = true; // prevent accidental tap-zoom right after pinch
        return;
      }
      if (isTouchDragging) {
        isTouchDragging = false;
        if (lbTouchHasMoved) { lbTouchHasMoved = false; return; } // was a real drag
      }
      // Single tap: toggle zoom (only when no movement happened)
      if (!lbTouchHasMoved && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        if (scale === 1) {
          zoom(1, touch.clientX, touch.clientY);
        } else {
          resetImageTransform();
        }
      }
      lbTouchHasMoved = false;
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

  // Campus Map footer modal — matches lightbox style, transform-based zoom
  (function setupCampusMapModal() {
    const campusMapLinks = Array.from(document.querySelectorAll('.footer-links a'))
      .filter(link => link.textContent && link.textContent.trim().toLowerCase() === 'campus map');
    if (campusMapLinks.length === 0) return;

    const cmSlides = [
      { src: '/assets/images/PSU-Campuses-Map.png', alt: 'Palawan State University Campus Locations' }
    ];

    if (!document.getElementById('cm-modal-style')) {
      const s = document.createElement('style');
      s.id = 'cm-modal-style';
      s.textContent = `
        .cm-modal {
          display: none;
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.9);
          justify-content: center;
          align-items: center;
          z-index: 10050;
        }
        .cm-modal.open { display: flex; }
        .cm-close {
          position: absolute;
          top: 20px; right: 30px;
          color: #fff; font-size: 32px;
          cursor: pointer; z-index: 10051;
          background: none; border: none;
          line-height: 1; padding: 0;
        }
        .cm-close:hover { color: #ccc; }
        .cm-image {
          max-width: 90%; max-height: 80%;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          cursor: default;
          -webkit-user-select: none; user-select: none;
          -webkit-user-drag: none;
          transition: transform 0.1s ease-out;
        }
        .cm-dots {
          position: absolute; bottom: 20px;
          left: 50%; transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 10051;
        }
        .cm-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          cursor: pointer; transition: background 0.2s;
        }
        .cm-dot.active { background: #fff; }
      `;
      document.head.appendChild(s);
    }

    const modal = document.createElement('div');
    modal.className = 'cm-modal';
    modal.id = 'campusMapModal';
    modal.innerHTML = `
      <button class="cm-close" aria-label="Close">&times;</button>
      <img class="cm-image" src="" alt="">
      <div class="cm-dots"></div>
    `;
    document.body.appendChild(modal);

    const cmCloseBtn = modal.querySelector('.cm-close');
    const cmImg      = modal.querySelector('.cm-image');
    const cmDotsEl   = modal.querySelector('.cm-dots');

    let cmIndex = 0;
    let cmScale = 1, cmOriginX = 0, cmOriginY = 0;
    let cmDragging = false, cmDragMoved = false;
    let cmDragSX = 0, cmDragSY = 0, cmDragOX = 0, cmDragOY = 0;

    cmSlides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'cm-dot';
      dot.addEventListener('click', () => { cmIndex = idx; cmShowSlide(); });
      cmDotsEl.appendChild(dot);
    });

    function cmApplyTransform() {
      cmImg.style.transform = `translate(${cmOriginX}px,${cmOriginY}px) scale(${cmScale})`;
    }

    function cmLimitPan() {
      if (cmScale <= 1) { cmOriginX = 0; cmOriginY = 0; return; }
      const mR = modal.getBoundingClientRect();
      const maxX = Math.max((cmImg.naturalWidth  * cmScale - mR.width)  / 2, 0);
      const maxY = Math.max((cmImg.naturalHeight * cmScale - mR.height) / 2, 0);
      cmOriginX = Math.min(Math.max(cmOriginX, -maxX), maxX);
      cmOriginY = Math.min(Math.max(cmOriginY, -maxY), maxY);
    }

    function cmReset() {
      cmScale = 1; cmOriginX = 0; cmOriginY = 0;
      cmDragging = false; cmDragMoved = false;
      cmApplyTransform();
      cmImg.style.cursor = 'default';
    }

    function cmZoom(delta, cx, cy) {
      const prev = cmScale;
      cmScale = Math.min(Math.max(cmScale + delta, 1), 4);
      if (cmScale > 1) {
        const r = cmImg.getBoundingClientRect();
        const icx = r.left + r.width / 2, icy = r.top + r.height / 2;
        cmOriginX = (cmOriginX - (cx - icx)) * (cmScale / prev) + (cx - icx);
        cmOriginY = (cmOriginY - (cy - icy)) * (cmScale / prev) + (cy - icy);
      } else { cmOriginX = 0; cmOriginY = 0; }
      cmLimitPan();
      cmApplyTransform();
      cmImg.style.cursor = cmScale > 1 ? 'grab' : 'default';
    }

    function cmShowSlide() {
      const slide = cmSlides[cmIndex];
      cmImg.src = slide.src;
      cmImg.alt = slide.alt;
      Array.from(cmDotsEl.children).forEach((d, i) => d.classList.toggle('active', i === cmIndex));
      cmReset();
    }

    function cmOpen()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; cmShowSlide(); }
    function cmClose() { modal.classList.remove('open'); document.body.style.overflow = ''; cmReset(); }

    campusMapLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); cmOpen(); }));
    cmCloseBtn.addEventListener('click', cmClose);
    modal.addEventListener('click', e => { if (e.target === modal) cmClose(); });

    document.addEventListener('keydown', e => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') { cmClose(); return; }
      if (e.key === 'ArrowLeft')  { cmIndex = Math.max(0, cmIndex - 1); cmShowSlide(); }
      if (e.key === 'ArrowRight') { cmIndex = Math.min(cmSlides.length - 1, cmIndex + 1); cmShowSlide(); }
      if (e.key === '+' || e.key === '=') { const r = cmImg.getBoundingClientRect(); cmZoom( 0.2, r.left+r.width/2, r.top+r.height/2); }
      if (e.key === '-')                  { const r = cmImg.getBoundingClientRect(); cmZoom(-0.2, r.left+r.width/2, r.top+r.height/2); }
    });

    // Mouse wheel zoom (no Ctrl required)
    modal.addEventListener('wheel', e => {
      e.preventDefault();
      cmZoom(e.deltaY < 0 ? 0.2 : -0.2, e.clientX, e.clientY);
    }, { passive: false });

    // Mouse: click to zoom toggle, drag to pan when zoomed
    cmImg.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      cmDragging = true; cmDragMoved = false;
      cmDragSX = e.clientX; cmDragSY = e.clientY;
      cmDragOX = cmOriginX; cmDragOY = cmOriginY;
      cmImg.style.cursor = cmScale > 1 ? 'grabbing' : 'default';
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!cmDragging) return;
      e.preventDefault();
      const dx = e.clientX - cmDragSX, dy = e.clientY - cmDragSY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) cmDragMoved = true;
      if (cmScale > 1) { cmOriginX = cmDragOX + dx; cmOriginY = cmDragOY + dy; cmLimitPan(); cmApplyTransform(); }
    });
    document.addEventListener('mouseup', () => {
      if (!cmDragging) return;
      cmDragging = false;
      document.body.style.userSelect = '';
      cmImg.style.cursor = cmScale > 1 ? 'grab' : 'default';
    });
    cmImg.addEventListener('click', e => {
      if (cmDragMoved) { cmDragMoved = false; return; }
      cmScale === 1 ? cmZoom(1, e.clientX, e.clientY) : cmReset();
    });

    // Mobile: pinch-to-zoom, 1-finger drag (when zoomed), single-tap toggle zoom
    let cmTouch = { moved: false, pinching: false, pinchDist: 0, pinchScale: 1,
                    dragging: false, sx: 0, sy: 0, ox: 0, oy: 0 };

    function cmPinchDist(t) {
      const dx = t[0].clientX-t[1].clientX, dy = t[0].clientY-t[1].clientY;
      return Math.sqrt(dx*dx+dy*dy);
    }

    cmImg.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        cmTouch.pinching = true; cmTouch.dragging = false; cmTouch.moved = false;
        cmTouch.pinchDist  = cmPinchDist(e.touches);
        cmTouch.pinchScale = cmScale;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        cmTouch.pinching = false; cmTouch.moved = false;
        if (cmScale > 1) {
          cmTouch.dragging = true;
          cmTouch.sx = e.touches[0].clientX; cmTouch.sy = e.touches[0].clientY;
          cmTouch.ox = cmOriginX; cmTouch.oy = cmOriginY;
          e.preventDefault();
        } else { cmTouch.dragging = false; }
      }
    }, { passive: false });

    cmImg.addEventListener('touchmove', e => {
      if (cmTouch.pinching && e.touches.length === 2) {
        e.preventDefault();
        const dist  = cmPinchDist(e.touches);
        const ratio = dist / cmTouch.pinchDist;
        const newSc = Math.min(Math.max(cmTouch.pinchScale * ratio, 1), 4);
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const prev = cmScale; cmScale = newSc;
        if (cmScale > 1) {
          const r = cmImg.getBoundingClientRect();
          const icx = r.left+r.width/2, icy = r.top+r.height/2;
          cmOriginX = (cmOriginX-(cx-icx))*(cmScale/prev)+(cx-icx);
          cmOriginY = (cmOriginY-(cy-icy))*(cmScale/prev)+(cy-icy);
        } else { cmOriginX = 0; cmOriginY = 0; }
        cmLimitPan(); cmApplyTransform();
        cmImg.style.cursor = cmScale > 1 ? 'grab' : 'default';
        cmTouch.moved = true;
      } else if (cmTouch.dragging && e.touches.length === 1 && cmScale > 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - cmTouch.sx;
        const dy = e.touches[0].clientY - cmTouch.sy;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) cmTouch.moved = true;
        cmOriginX = cmTouch.ox + dx; cmOriginY = cmTouch.oy + dy;
        cmLimitPan(); cmApplyTransform();
      }
    }, { passive: false });

    cmImg.addEventListener('touchend', e => {
      if (cmTouch.pinching) {
        if (e.touches.length < 2) cmTouch.pinching = false;
        cmTouch.moved = true; return; // block accidental tap-zoom after pinch
      }
      if (cmTouch.dragging) {
        cmTouch.dragging = false;
        if (cmTouch.moved) { cmTouch.moved = false; return; } // real drag — no tap
      }
      // Single tap = toggle zoom
      if (!cmTouch.moved && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        cmScale === 1 ? cmZoom(1, t.clientX, t.clientY) : cmReset();
      }
      cmTouch.moved = false;
    });

    cmShowSlide();
  })();

  // ── Privacy Policy & Terms & Conditions footer modals ──
  (function setupLegalModals() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const legalContent = {
      'privacy policy': {
        title: 'Privacy Policy (RERC)',
        body: `
          <p class="legal-date">Last updated: ${formattedDate}</p>
          <p>The Research Ethics Review Committee (RERC) is committed to protecting the privacy and confidentiality of its users.</p>

          <h3>Information We Collect</h3>
          <p>We may collect the following information when you use the RERC system:</p>
          <ul>
            <li>Personal information (such as name, email address, institutional affiliation)</li>
            <li>Login credentials</li>
            <li>Research submission details and supporting documents</li>
            <li>System usage data for security and auditing purposes</li>
          </ul>

          <h3>How We Use Your Information</h3>
          <p>Your information is used to:</p>
          <ul>
            <li>Facilitate researcher submissions and ethics review processes</li>
            <li>Manage user authentication and role-based access (Researcher, Committee)</li>
            <li>Communicate application status and review outcomes</li>
            <li>Maintain system security and integrity</li>
          </ul>

          <h3>Data Protection</h3>
          <ul>
            <li>Access to submitted data is restricted to authorized RERC personnel only</li>
            <li>Research data and personal information are treated as confidential</li>
            <li>Reasonable technical and organizational measures are used to protect stored data</li>
          </ul>

          <h3>Data Sharing</h3>
          <p>RERC does not sell or share personal data with third parties, except:</p>
          <ul>
            <li>When required by institutional policy</li>
            <li>When required by law or regulatory authorities</li>
          </ul>

          <h3>User Responsibility</h3>
          <p>Users are responsible for:</p>
          <ul>
            <li>Keeping their login credentials secure</li>
            <li>Ensuring uploaded research data complies with ethical and institutional guidelines</li>
          </ul>

          <h3>Contact</h3>
          <p>For privacy-related concerns, please contact our Facebook Page:<br>
          📧 <a href="https://www.facebook.com/people/PSU-Research-Ethics-Review-Committee/100091248249310" target="_blank" style="color:#22c55e;">PSU-Research Ethics Review Committee</a></p>
        `
      },
      'terms & conditions': {
        title: 'Terms and Conditions (RERC)',
        body: `
          <p class="legal-date">Last updated: ${formattedDate}</p>
          <p>By accessing and using the RERC system, you agree to the following terms and conditions.</p>

          <h3>Use of the System</h3>
          <ul>
            <li>The system is intended solely for official RERC research ethics submissions and reviews</li>
            <li>Users must provide accurate, truthful, and complete information</li>
            <li>Unauthorized access or misuse of the system is strictly prohibited</li>
          </ul>

          <h3>User Roles</h3>
          <ul>
            <li>Researchers may submit applications and supporting documents</li>
            <li>Committee Members may review, evaluate, and provide decisions on submissions</li>
            <li>Access and actions are limited based on assigned roles</li>
          </ul>

          <h3>Intellectual Property</h3>
          <ul>
            <li>Submitted research materials remain the intellectual property of the researcher</li>
            <li>RERC reserves the right to store and process submissions for review and record-keeping purposes</li>
          </ul>

          <h3>Confidentiality</h3>
          <p>All users must:</p>
          <ul>
            <li>Maintain confidentiality of research materials and review discussions</li>
            <li>Not disclose sensitive or restricted information obtained through the system</li>
          </ul>

          <h3>System Availability</h3>
          <ul>
            <li>RERC does not guarantee uninterrupted access</li>
            <li>The system may be temporarily unavailable due to maintenance or updates</li>
          </ul>

          <h3>Limitation of Liability</h3>
          <p>RERC is not liable for:</p>
          <ul>
            <li>Data loss caused by user error</li>
            <li>Delays due to system downtime or external factors</li>
          </ul>

          <h3>Changes to Terms</h3>
          <p>RERC may update these terms at any time. Continued use of the system indicates acceptance of the updated terms.</p>
        `
      }
    };

    // Inject styles
    if (!document.getElementById('legal-modal-style')) {
      const s = document.createElement('style');
      s.id = 'legal-modal-style';
      s.textContent = `
        .legal-modal-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.85);
          z-index: 10060;
          justify-content: center;
          align-items: center;
          overflow-y: auto;
        }
        .legal-modal-overlay.open { display: flex; }
        .legal-modal-box {
          background: #fff;
          border-radius: 12px;
          width: 92%;
          max-width: 680px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2.5rem 2rem 2rem;
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          animation: legalFadeIn 0.25s ease;
        }
        @keyframes legalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .legal-modal-close {
          position: absolute;
          top: 14px; right: 18px;
          background: none; border: none;
          font-size: 28px; color: #555;
          cursor: pointer; line-height: 1;
          padding: 4px 8px; border-radius: 4px;
          transition: background 0.2s, color 0.2s;
        }
        .legal-modal-close:hover { background: #f0f0f0; color: #111; }
        .legal-modal-box h2 {
          margin: 0 0 0.3rem;
          font-size: 1.5rem;
          color: #1a3d2f;
          font-weight: 700;
          padding-right: 40px;
        }
        .legal-modal-box .legal-date {
          color: #888;
          font-size: 0.88rem;
          margin: 0 0 1.2rem;
          font-style: italic;
        }
        .legal-modal-box h3 {
          margin: 1.4rem 0 0.5rem;
          font-size: 1.08rem;
          color: #1a3d2f;
          font-weight: 600;
        }
        .legal-modal-box p {
          margin: 0 0 0.7rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: #333;
        }
        .legal-modal-box ul {
          margin: 0 0 0.8rem 1.2rem;
          padding: 0;
          list-style: disc;
        }
        .legal-modal-box li {
          font-size: 0.93rem;
          line-height: 1.6;
          color: #444;
          margin-bottom: 0.3rem;
        }
        .legal-modal-box a {
          color: #1a3d2f;
          text-decoration: underline;
        }
        /* Scrollbar styling */
        .legal-modal-box::-webkit-scrollbar { width: 6px; }
        .legal-modal-box::-webkit-scrollbar-track { background: transparent; }
        .legal-modal-box::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        .legal-modal-box::-webkit-scrollbar-thumb:hover { background: #aaa; }
        @media (max-width: 500px) {
          .legal-modal-box { padding: 1.5rem 1.2rem 1.2rem; }
          .legal-modal-box h2 { font-size: 1.25rem; }
        }
      `;
      document.head.appendChild(s);
    }

    // Create modal element
    const overlay = document.createElement('div');
    overlay.className = 'legal-modal-overlay';
    overlay.id = 'legalModal';
    overlay.innerHTML = `
      <div class="legal-modal-box">
        <button class="legal-modal-close" aria-label="Close">&times;</button>
        <h2 class="legal-modal-title"></h2>
        <div class="legal-modal-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const box      = overlay.querySelector('.legal-modal-box');
    const closeBtn = overlay.querySelector('.legal-modal-close');
    const titleEl  = overlay.querySelector('.legal-modal-title');
    const bodyEl   = overlay.querySelector('.legal-modal-body');

    function openLegal(key) {
      const data = legalContent[key];
      if (!data) return;
      titleEl.textContent = data.title;
      bodyEl.innerHTML = data.body;
      box.scrollTop = 0;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLegal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLegal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLegal(); });
    document.addEventListener('keydown', e => {
      if (overlay.classList.contains('open') && e.key === 'Escape') closeLegal();
    });

    // Hook footer links
    document.querySelectorAll('.footer-links a').forEach(link => {
      const text = (link.textContent || '').trim().toLowerCase();
      if (text === 'privacy policy' || text === 'terms & conditions') {
        link.addEventListener('click', e => {
          e.preventDefault();
          openLegal(text);
        });
      }
    });

    // Also hook login page links if present
    document.querySelectorAll('.terms a').forEach(link => {
      const text = (link.textContent || '').trim().toLowerCase();
      if (text === 'privacy policy') {
        link.addEventListener('click', e => { e.preventDefault(); openLegal('privacy policy'); });
      } else if (text === 'terms of service') {
        link.addEventListener('click', e => { e.preventDefault(); openLegal('terms & conditions'); });
      }
    });
  })();

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
                    <a href="/assets/documents/${form.filename}" class="download-btn" download>
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
// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.fas');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.fas').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });


    // Requirements Image Lightbox Functionality
    const requirementsTitleClick = document.getElementById('requirementsTitleClick');
    const requirementsLightbox = document.getElementById('requirementsLightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxRequirementsImg = document.getElementById('lightboxRequirementsImg');

    // Zoom and pan variables
    let reqScale = 1;
    let reqOriginX = 0;
    let reqOriginY = 0;
    let reqIsDragging = false;
    let reqDragStartX = 0;
    let reqDragStartY = 0;
    let reqDragOriginX = 0;
    let reqDragOriginY = 0;
    let reqHasDragged = false;

    function reqUpdateTransform() {
        if (lightboxRequirementsImg) {
            lightboxRequirementsImg.style.transform = `translate(${reqOriginX}px, ${reqOriginY}px) scale(${reqScale})`;
        }
    }

    function reqLimitPan() {
        if (reqScale <= 1) {
            reqOriginX = 0;
            reqOriginY = 0;
            return;
        }
        
        if (!requirementsLightbox || !lightboxRequirementsImg) return;
        
        const lbRect = requirementsLightbox.getBoundingClientRect();
        const imgRect = lightboxRequirementsImg.getBoundingClientRect();
        
        const scaledWidth = imgRect.width * reqScale;
        const scaledHeight = imgRect.height * reqScale;
        
        const maxPanX = Math.max((scaledWidth - lbRect.width) / 2, 0);
        const maxPanY = Math.max((scaledHeight - lbRect.height) / 2, 0);
        
        reqOriginX = Math.min(Math.max(reqOriginX, -maxPanX), maxPanX);
        reqOriginY = Math.min(Math.max(reqOriginY, -maxPanY), maxPanY);
    }

    function reqResetImageTransform() {
        reqScale = 1;
        reqOriginX = 0;
        reqOriginY = 0;
        reqUpdateTransform();
        if (lightboxRequirementsImg) {
            lightboxRequirementsImg.style.cursor = reqScale > 1 ? 'grab' : 'zoom-in';
        }
    }

    if (requirementsTitleClick && requirementsLightbox) {
        console.log('Requirements functionality initialized');
        
        requirementsTitleClick.addEventListener('click', function(e) {
            e.preventDefault();
            requirementsLightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
            reqResetImageTransform();
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                requirementsLightbox.style.display = 'none';
                document.body.style.overflow = '';
                reqResetImageTransform();
            });
        }

        requirementsLightbox.addEventListener('click', function(e) {
            if (e.target === requirementsLightbox) {
                requirementsLightbox.style.display = 'none';
                document.body.style.overflow = '';
                reqResetImageTransform();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && requirementsLightbox.style.display === 'block') {
                requirementsLightbox.style.display = 'none';
                document.body.style.overflow = '';
                reqResetImageTransform();
            }
        });

        if (lightboxRequirementsImg) {
            lightboxRequirementsImg.addEventListener('wheel', function(e) {
                e.preventDefault();
                
                const rect = lightboxRequirementsImg.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - rect.width / 2;
                const mouseY = e.clientY - rect.top - rect.height / 2;
                
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                const newScale = Math.min(Math.max(reqScale * zoomFactor, 1), 4);
                
                if (newScale !== reqScale) {
                    const scaleRatio = newScale / reqScale;
                    reqOriginX = reqOriginX * scaleRatio + mouseX * (1 - scaleRatio);
                    reqOriginY = reqOriginY * scaleRatio + mouseY * (1 - scaleRatio);
                    reqScale = newScale;
                    
                    reqLimitPan();
                    reqUpdateTransform();
                    lightboxRequirementsImg.style.cursor = reqScale > 1 ? 'grab' : 'zoom-in';
                }
            });

            lightboxRequirementsImg.addEventListener('click', function(e) {
                if (reqHasDragged) {
                    reqHasDragged = false;
                    return;
                }
                
                if (reqScale === 1) {
                    const rect = lightboxRequirementsImg.getBoundingClientRect();
                    const clickX = e.clientX - rect.left - rect.width / 2;
                    const clickY = e.clientY - rect.top - rect.height / 2;
                    
                    reqScale = 2;
                    reqOriginX = -clickX;
                    reqOriginY = -clickY;
                    
                    reqLimitPan();
                    reqUpdateTransform();
                    lightboxRequirementsImg.style.cursor = 'grab';
                } else {
                    reqResetImageTransform();
                }
                
                e.preventDefault();
                e.stopPropagation();
            });

            lightboxRequirementsImg.addEventListener('mousedown', function(e) {
                if (reqScale > 1) {
                    reqIsDragging = true;
                    reqHasDragged = false;
                    reqDragStartX = e.clientX;
                    reqDragStartY = e.clientY;
                    reqDragOriginX = reqOriginX;
                    reqDragOriginY = reqOriginY;
                    lightboxRequirementsImg.style.cursor = 'grabbing';
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            document.addEventListener('mousemove', function(e) {
                if (reqIsDragging && reqScale > 1) {
                    e.preventDefault();
                    const deltaX = e.clientX - reqDragStartX;
                    const deltaY = e.clientY - reqDragStartY;
                    
                    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                        reqHasDragged = true;
                    }
                    
                    reqOriginX = reqDragOriginX + deltaX;
                    reqOriginY = reqDragOriginY + deltaY;
                    
                    reqLimitPan();
                    reqUpdateTransform();
                }
            });

            document.addEventListener('mouseup', function(e) {
                if (reqIsDragging) {
                    reqIsDragging = false;
                    if (lightboxRequirementsImg) {
                        lightboxRequirementsImg.style.cursor = reqScale > 1 ? 'grab' : 'zoom-in';
                    }
                    e.preventDefault();
                    if (reqHasDragged) {
                        e.stopPropagation();
                    }
                }
            });

            lightboxRequirementsImg.style.cursor = "zoom-in";
        }
    }
});
