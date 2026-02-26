// Requirements Lightbox with Zoom and Pan
document.addEventListener("DOMContentLoaded", function () {
    console.log('Requirements script loaded');
    
    const requirementsTitleClick = document.getElementById('requirementsTitleClick');
    const requirementsLightbox = document.getElementById('requirementsLightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxRequirementsImg = document.getElementById('lightboxRequirementsImg');

    console.log('Elements found:');
    console.log('- Title:', requirementsTitleClick);
    console.log('- Lightbox:', requirementsLightbox);
    console.log('- Close button:', lightboxClose);
    console.log('- Lightbox image:', lightboxRequirementsImg);

    // Zoom and pan variables
    let reqScale = 1;
    let reqOriginX = 0;
    let reqOriginY = 0;
    let reqIsDragging = false;
    let reqDragStartX = 0;
    let reqDragStartY = 0;
    let reqDragOriginX = 0;
    let reqDragOriginY = 0;
    let reqHasDragged = false; // Track if user actually dragged

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
        
        // Calculate the scaled dimensions
        const scaledWidth = imgRect.width * reqScale;
        const scaledHeight = imgRect.height * reqScale;
        
        // Calculate max pan distances
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
        console.log('Setting up click handler...');
        
        requirementsTitleClick.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Title clicked! Opening lightbox...');
            requirementsLightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
            reqResetImageTransform();
        });

        // Close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                console.log('Close button clicked');
                requirementsLightbox.style.display = 'none';
                document.body.style.overflow = '';
                reqResetImageTransform();
            });
        }

        // Click outside to close
        requirementsLightbox.addEventListener('click', function(e) {
            if (e.target === requirementsLightbox) {
                console.log('Clicked outside image');
                requirementsLightbox.style.display = 'none';
                document.body.style.overflow = '';
                reqResetImageTransform();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && requirementsLightbox.style.display === 'block') {
                console.log('Escape pressed');
                requirementsLightbox.style.display = 'none';
                document.body.style.overflow = '';
                reqResetImageTransform();
            }
        });

        // Image zoom and pan functionality
        if (lightboxRequirementsImg) {
            // Mouse wheel zoom
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
                    
                    // Update cursor based on zoom level
                    lightboxRequirementsImg.style.cursor = reqScale > 1 ? 'grab' : 'zoom-in';
                }
            });

            // Click to zoom
            lightboxRequirementsImg.addEventListener('click', function(e) {
                // Don't zoom if we just finished dragging
                if (reqHasDragged) {
                    reqHasDragged = false; // Reset for next interaction
                    return;
                }
                
                if (reqScale === 1) {
                    // Zoom in to 2x at click point
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
                    // Reset zoom only if not dragging
                    reqResetImageTransform();
                }
                
                e.preventDefault();
                e.stopPropagation();
            });

            // Mouse drag for panning when zoomed
            lightboxRequirementsImg.addEventListener('mousedown', function(e) {
                if (reqScale > 1) {
                    reqIsDragging = true;
                    reqHasDragged = false; // Reset drag flag
                    reqDragStartX = e.clientX;
                    reqDragStartY = e.clientY;
                    reqDragOriginX = reqOriginX;
                    reqDragOriginY = reqOriginY;
                    lightboxRequirementsImg.style.cursor = 'grabbing';
                    e.preventDefault();
                    e.stopPropagation(); // Prevent other events
                }
            });

            document.addEventListener('mousemove', function(e) {
                if (reqIsDragging && reqScale > 1) {
                    e.preventDefault();
                    const deltaX = e.clientX - reqDragStartX;
                    const deltaY = e.clientY - reqDragStartY;
                    
                    // Mark as dragged if moved more than a few pixels
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
                        e.stopPropagation(); // Prevent click event after drag
                    }
                }
            });

            // Touch support for mobile
            let isTouchDragging = false;
            let touchDragStartX = 0;
            let touchDragStartY = 0;
            let touchDragOriginX = 0;
            let touchDragOriginY = 0;

            lightboxRequirementsImg.addEventListener("touchstart", function(e) {
                if (e.touches.length === 1 && reqScale > 1) {
                    isTouchDragging = true;
                    touchDragStartX = e.touches[0].clientX;
                    touchDragStartY = e.touches[0].clientY;
                    touchDragOriginX = reqOriginX;
                    touchDragOriginY = reqOriginY;
                } else if (e.touches.length === 1 && reqScale === 1) {
                    // Single tap to zoom
                    const rect = lightboxRequirementsImg.getBoundingClientRect();
                    const touchX = e.touches[0].clientX - rect.left - rect.width / 2;
                    const touchY = e.touches[0].clientY - rect.top - rect.height / 2;
                    
                    reqScale = 2;
                    reqOriginX = -touchX;
                    reqOriginY = -touchY;
                    
                    reqLimitPan();
                    reqUpdateTransform();
                }
                e.preventDefault();
            }, { passive: false });

            lightboxRequirementsImg.addEventListener("touchmove", function(e) {
                if (e.touches.length === 1 && isTouchDragging && reqScale > 1) {
                    const deltaX = e.touches[0].clientX - touchDragStartX;
                    const deltaY = e.touches[0].clientY - touchDragStartY;
                    
                    reqOriginX = touchDragOriginX + deltaX;
                    reqOriginY = touchDragOriginY + deltaY;
                    
                    reqLimitPan();
                    reqUpdateTransform();
                }
                e.preventDefault();
            }, { passive: false });

            lightboxRequirementsImg.addEventListener("touchend", function(e) {
                if (e.touches.length === 0) {
                    isTouchDragging = false;
                }
                // Double tap to reset zoom
                if (e.changedTouches.length === 1 && reqScale > 1) {
                    // Simple timeout-based double tap detection
                    const now = Date.now();
                    if (this.lastTouchTime && (now - this.lastTouchTime) < 300) {
                        reqResetImageTransform();
                    }
                    this.lastTouchTime = now;
                }
            });

            // Initialize cursor style
            lightboxRequirementsImg.style.cursor = "zoom-in";
        }

    } else {
        console.error('Required elements not found!');
    }
});