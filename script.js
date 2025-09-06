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

  // FIXED: Highlight nav item on scroll + move nav + back to top button
  window.addEventListener("scroll", () => {
    let current = "";
    document.querySelectorAll("section").forEach(section => {
      if (scrollY >= section.offsetTop - 60) current = section.getAttribute("id");
    });
    navItems.forEach(item => item.classList.toggle("active", item.getAttribute("href") === `#${current}`));
    mobileNavItems.forEach(item => item.classList.toggle("active", item.getAttribute("href") === `#${current}`));
    
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
      if (progressBar) progressBar.classList.remove("hidden-during-lightbox");
      resetImageTransform();
    });
  }

  // Navigation inside lightbox
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => showLightboxSlide(lightboxIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => showLightboxSlide(lightboxIndex + 1));

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
});