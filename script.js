document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            
            // Handle home click - move nav to bottom and scroll to top
            if (targetId === 'home') {
                bottomNav.classList.remove('move-to-top');
                document.body.style.paddingTop = '0';
                document.body.style.paddingBottom = '60px';
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // For other sections (about, resources, updates, contacts) - move nav to top first
            bottomNav.classList.add('move-to-top');
            document.body.style.paddingTop = '60px';
            document.body.style.paddingBottom = '0';
            
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Move navigation to top/bottom based on scroll position
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const aboutSection = document.getElementById('about');
        
        if (aboutSection) {
            const aboutSectionTop = aboutSection.offsetTop - 50;
            
            // Move to top when scrolling to About section and beyond
            if (currentScrollTop >= aboutSectionTop) {
                bottomNav.classList.add('move-to-top');
                document.body.style.paddingTop = '60px';
                document.body.style.paddingBottom = '0';
            } else {
                bottomNav.classList.remove('move-to-top');
                document.body.style.paddingTop = '0';
                document.body.style.paddingBottom = '60px';
            }
        }

        // Update active state based on scroll position
        const sections = document.querySelectorAll('section[id]'); // Changed this line
        const scrollPos = window.scrollY + 100;

        // Check if we're at the top (home section)
        if (currentScrollTop < 50) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#home') {
                    item.classList.add('active');
                }
            });
            return;
        }

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
});



window.onscroll = function () {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let progress = (scrollTop / scrollHeight) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
};

