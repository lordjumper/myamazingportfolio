document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing effect
    initializeTypingEffect();
    
    // Initialize scroll down arrow
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add enhanced social icon interactions
    initializeSocialIcons();

    // Add navbar scroll behavior
    initializeNavbarBehavior();

    // Load project data from JSON file
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate project cards dynamically
            populateProjectCards(data.projects);
            
            // Initialize all components
            initializeProjects(data.projects);
            initializeLightbox();
            initializeMobileMenu();
        })
        .catch(error => {
            console.error('Error loading project data:', error);
        });

    // Navbar behavior - hide on scroll, show on hover
    function initializeNavbarBehavior() {
        const navbar = document.querySelector('.nav-container');
        const navLinks = document.querySelectorAll('.nav-links a, .nav-right a, .logo');
        let lastScrollTop = 0;
        let isHovering = false;
        let navbarHeight = navbar.offsetHeight;
        let timeout;
        
        // Create a hover area that will trigger the navbar to reappear
        const hoverArea = document.createElement('div');
        hoverArea.className = 'navbar-hover-area';
        document.body.appendChild(hoverArea);
        
        // Handle scroll events
        window.addEventListener('scroll', function() {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Don't hide navbar when at the top of the page
            if (currentScroll <= 50) {
                navbar.classList.remove('hidden');
                return;
            }
            
            // Don't hide navbar when user is hovering over it or the hover area
            if (isHovering) {
                return;
            }
            
            // Hide navbar when scrolling down, show when scrolling up
            if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
                // Scrolling down
                navbar.classList.add('hidden');
            } else {
                // Scrolling up
                navbar.classList.remove('hidden');
            }
            
            lastScrollTop = currentScroll;
        });
        
        // Show navbar when hovering over the hover area
        hoverArea.addEventListener('mouseenter', function() {
            isHovering = true;
            navbar.classList.remove('hidden');
            
            // Clear any existing timeout
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        });
        
        // detect hover on the navbar itself
        navbar.addEventListener('mouseenter', function() {
            isHovering = true;
            navbar.classList.remove('hidden');
            
            // Clear any existing timeout
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        });
        
        // Make sure the navbar stays visible when hovering over any nav element
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                isHovering = true;
                navbar.classList.remove('hidden');
                
                // Clear any existing timeout
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            });
        });
        
        // When mouse leaves hover area
        hoverArea.addEventListener('mouseleave', function() {
            // Small delay before considering the mouse has left
            timeout = setTimeout(() => {
                if (!isHoveringNavbar()) {
                    isHovering = false;
                    
                    // If we've scrolled down, hide the navbar again after leaving
                    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                    if (currentScroll > 50) {
                        navbar.classList.add('hidden');
                    }
                }
            }, 300);
        });
        
        // When mouse leaves navbar
        navbar.addEventListener('mouseleave', function() {
            // Small delay before considering the mouse has left
            timeout = setTimeout(() => {
                if (!isHoveringHoverArea()) {
                    isHovering = false;
                    
                    // If we've scrolled down, hide the navbar again after leaving
                    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                    if (currentScroll > 50) {
                        navbar.classList.add('hidden');
                    }
                }
            }, 300);
        });
        
        // Helper functions to check if we're hovering over specific elements
        function isHoveringNavbar() {
            return document.querySelector('.nav-container:hover') !== null;
        }
        
        function isHoveringHoverArea() {
            return document.querySelector('.navbar-hover-area:hover') !== null;
        }
        
        // Make sure links in the navbar still work
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // If it's a hash link, smoothly scroll to the target
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Populate project cards in the HTML
    function populateProjectCards(projectsData) {
        const projectsGrid = document.querySelector('.projects-grid');
        
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Add each project card
        projectsData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.shortDescription || project.description.substring(0, 100) + '...'}</p>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }

    // Initialize projects with the loaded data
    function initializeProjects(projectsData) {
        // Get all project cards
        const projectCards = document.querySelectorAll('.project-card');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.querySelector('.modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalGallery = document.getElementById('modal-gallery');
        const modalTechList = document.getElementById('modal-tech-list');
        const modalDemo = document.getElementById('modal-demo');
        const modalGithub = document.getElementById('modal-github');

        // Add click event to each project card
        projectCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Get project data
                const project = projectsData[index];
                
                // Populate modal with project data
                modalTitle.textContent = project.title;
                modalDescription.innerHTML = `<p>${project.description}</p>`;
                
                // Clear and populate gallery
                modalGallery.innerHTML = '';
                project.images.forEach(img => {
                    const imgElement = document.createElement('img');
                    imgElement.src = img;
                    imgElement.alt = project.title;
                    modalGallery.appendChild(imgElement);
                });
                
                // Clear and populate tech list
                modalTechList.innerHTML = '';
                project.technologies.forEach(tech => {
                    const li = document.createElement('li');
                    li.textContent = tech;
                    modalTechList.appendChild(li);
                });
                
                // Set links
                modalDemo.href = project.demoLink;
                modalGithub.href = project.githubLink;
                
                // Open modal
                modalOverlay.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });

        // Close modal when clicking the close button
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
        });

        // Close modal when clicking outside the modal content
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // Lightbox Viewer (IMG Enlarger)
    function initializeLightbox() {
        // Lightbox elements
        const lightboxOverlay = document.getElementById('lightbox-overlay');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        // Variables to track current image
        let currentImageIndex = 0;
        let currentImages = [];
        
        // Function to open the lightbox with a specific image
        function openLightbox(images, index) {
            currentImages = images;
            currentImageIndex = index;
            
            // Set the image source
            updateLightboxImage();
            
            // Open the lightbox
            lightboxOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        }
        
        // Function to update the lightbox image and caption
        function updateLightboxImage() {
            lightboxImage.src = currentImages[currentImageIndex];
            lightboxCaption.textContent = `Image ${currentImageIndex + 1} of ${currentImages.length}`;
            
            // Hide navigation if there's only one image
            if (currentImages.length <= 1) {
                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';
            } else {
                lightboxPrev.style.display = 'flex';
                lightboxNext.style.display = 'flex';
            }
        }
        
        // Event delegation for clicking on gallery images
        document.addEventListener('click', function(e) {
            // Check if the clicked element is a gallery image
            if (e.target.closest('.modal-gallery img')) {
                const clickedImg = e.target.closest('.modal-gallery img');
                const galleryImages = Array.from(document.querySelectorAll('.modal-gallery img')).map(img => img.src);
                const clickedIndex = galleryImages.indexOf(clickedImg.src);
                
                openLightbox(galleryImages, clickedIndex);
                
                // Prevent event bubbling to the modal
                e.stopPropagation();
            }
        });
        
        // Previous image button
        lightboxPrev.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        });
        
        // Next image button
        lightboxNext.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            updateLightboxImage();
        });
        
        // Close lightbox when clicking the close button
        lightboxClose.addEventListener('click', function() {
            lightboxOverlay.classList.remove('active');
        });
        
        // Close lightbox when clicking outside the image
        lightboxOverlay.addEventListener('click', function(e) {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightboxOverlay.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                lightboxOverlay.classList.remove('active');
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
                updateLightboxImage();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % currentImages.length;
                updateLightboxImage();
            }
        });
    }

    // Mobile Menu Functionality
    function initializeMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        
        // Toggle menu on hamburger click
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu on X click
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            });
        }
        
        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
                
                // Small delay for smoother navigation experience
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    setTimeout(() => {
                        document.querySelector(href).scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            });
        });
        
        // Close menu when clicking outside the menu content
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Add resize listener to handle window size changes
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Typing effect for the header text
    function initializeTypingEffect() {
        const text = "I'm just a guy that enjoys making cool stuff.";
        const typedTextElement = document.getElementById('typed-text');
        const cursor = document.querySelector('.cursor');
        
        if (!typedTextElement) return;
        
        let charIndex = 0;
        let isDeleting = false;
        let pauseEnd = false;
        
        function typeEffect() {
            const currentText = text.substring(0, charIndex);
            typedTextElement.textContent = currentText;
            
            if (!isDeleting && charIndex < text.length) {
                // Typing forward
                charIndex++;
                // Random typing speed to make it look more natural
                const speed = Math.random() * 200 + 50;
                setTimeout(typeEffect, speed);
            } else if (!isDeleting && charIndex === text.length) {
                // Reached the end of text, pause before starting to delete
                isDeleting = false;
                pauseEnd = true;
                setTimeout(typeEffect, 2000); // Pause at the end
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                charIndex--;
                const speed = Math.random() * 50 + 30;
                setTimeout(typeEffect, speed);
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, start typing again
                isDeleting = false;
                setTimeout(typeEffect, 500); // Pause before starting again
            } else if (pauseEnd) {
                if (Math.random() < 0.25) {
                    isDeleting = true;
                    pauseEnd = false;
                }
                setTimeout(typeEffect, 2000); // Keep checking periodically
            }
        }
        
        // Start the typing effect after a short delay
        setTimeout(typeEffect, 1000);
        
        // Make sure the cursor keeps blinking independently
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    // Social icons enhancements
    function initializeSocialIcons() {
        const socialIcons = document.querySelectorAll('.social-icons a');
        
        // Add hover sound effect (subtle)
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                // Optional: create a subtle hover sound if you want
                // const hoverSound = new Audio('hover.mp3');
                // hoverSound.volume = 0.1;
                // hoverSound.play();
                
                // Add pulse effect on hover
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            });
            
            // Add click effect for mobile
            icon.addEventListener('touchstart', function(e) {
                e.target.classList.add('touch-effect');
                setTimeout(() => {
                    e.target.classList.remove('touch-effect');
                }, 300);
            }, { passive: true });
        });
        
        // Fix for mobile orientation changes
        window.addEventListener('orientationchange', function() {
            // Add slight delay to allow for DOM changes
            setTimeout(adjustLayout, 300);
        });
        
        // Initial layout adjustment
        adjustLayout();
    }
    
    // Function to adjust layout based on screen orientation
    function adjustLayout() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const header = document.querySelector('.header');
        const scrollArrow = document.querySelector('.scroll-down-arrow');
        
        if (isLandscape && window.innerHeight < 500) {
            // Extra space for landscape on small screens
            header.style.paddingBottom = '100px';
            if (scrollArrow) scrollArrow.style.bottom = '20px';
        } else {
            header.style.paddingBottom = '';
            if (scrollArrow) scrollArrow.style.bottom = '';
        }
    }
});

// Cookie Consent Handler - Simplified
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element for animations
    const style = document.createElement('style');
    style.textContent = `
        #cookie-consent.slide-down {
            animation: slideDown 0.5s ease-out forwards;
        }
        
        #cookie-consent.fade-down {
            animation: fadeDown 0.5s ease-out forwards;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Get the cookie consent element
    const cookieConsent = document.getElementById('cookie-consent');
    
    // If element doesn't exist, return early
    if (!cookieConsent) {
        console.error('Cookie consent element not found');
        return;
    }
    
    const acceptButton = document.getElementById('accept-cookies');
    const denyButton = document.getElementById('deny-cookies');
    
    // Check if user has already made a choice - run immediately on page load
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    // Immediately show or hide based on previous choice
    if (cookieChoice === null) {
        // User hasn't decided yet, show the popup
        cookieConsent.classList.remove('fade-down');
        cookieConsent.classList.add('show');
        cookieConsent.classList.add('slide-down');
        cookieConsent.style.display = '';  // Use default display
    } else {
        // User already decided, keep it hidden
        cookieConsent.classList.remove('show');
        cookieConsent.classList.remove('slide-down');
        cookieConsent.style.display = 'none';
    }
    
    // Handle accept button click
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        
        // Add fade-down animation before removing
        cookieConsent.classList.remove('slide-down');
        cookieConsent.classList.add('fade-down');
        
        // Remove after animation completes
        setTimeout(() => {
            cookieConsent.classList.remove('show');
            cookieConsent.classList.remove('fade-down');
            cookieConsent.style.display = 'none';
        }, 500);
        
        // Migrate any session-based data to persistent storage
        migrateTemporaryData();
    });
    
    // Handle deny button click
    denyButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'denied');
        
        // Add fade-down animation before removing
        cookieConsent.classList.remove('slide-down');
        cookieConsent.classList.add('fade-down');
        
        // Remove after animation completes
        setTimeout(() => {
            cookieConsent.classList.remove('show');
            cookieConsent.classList.remove('fade-down');
            cookieConsent.style.display = 'none';
        }, 500);
        
        // Clear any existing cookies
        clearAllCookies();
    });
});

// Clear all cookies if user denies consent
function clearAllCookies() {
    const cookies = document.cookie.split(";");
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

// Migrate temporary session data to persistent storage if consent was given
function migrateTemporaryData() {
    // Check if we have temporary liked posts in sessionStorage
    const tempLikedPosts = sessionStorage.getItem('tempLikedPosts');
    if (tempLikedPosts) {
        // Move to permanent storage
        saveToCookiesOrStorage('likedPosts', tempLikedPosts);
        // Clear temporary storage
        sessionStorage.removeItem('tempLikedPosts');
    }
}

// Get value from cookies
function getCookieValue(key) {
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

// Use this function when you need to save data to cookies or localStorage
function saveToCookiesOrStorage(key, value) {
    // Check user's consent preference
    const consentChoice = localStorage.getItem('cookieConsent');
    
    if (consentChoice === 'accepted') {
        // Save to both cookie and localStorage for redundancy
        document.cookie = `${key}=${value}; max-age=31536000; path=/`;
        localStorage.setItem(key, value);
        return true;
    } else {
        // If consent denied or not yet given, use sessionStorage (temporary)
        sessionStorage.setItem('temp' + key.charAt(0).toUpperCase() + key.slice(1), value);
        return false;
    }
}

// Read data with fallback strategy
function getUserData(key) {
    const consentChoice = localStorage.getItem('cookieConsent');
    
    if (consentChoice === 'accepted') {
        // Try cookie first, then localStorage
        const cookieValue = getCookieValue(key);
        if (cookieValue !== null) {
            return cookieValue;
        }
        return localStorage.getItem(key);
    } else {
        // Check temporary storage
        return sessionStorage.getItem('temp' + key.charAt(0).toUpperCase() + key.slice(1));
    }
}

// Example: Saving liked posts with better handling
function saveLikedPost(postId) {
    const consentChoice = localStorage.getItem('cookieConsent');
    
    // Get current liked posts
    let likedPosts = [];
    
    if (consentChoice === 'accepted') {
        // Get from permanent storage
        const savedPosts = getUserData('likedPosts');
        if (savedPosts) {
            likedPosts = JSON.parse(savedPosts);
        }
        
        // Add new post if not already liked
        if (!likedPosts.includes(postId)) {
            likedPosts.push(postId);
        }
        
        // Save back to permanent storage
        return saveToCookiesOrStorage('likedPosts', JSON.stringify(likedPosts));
    } else if (consentChoice === 'denied') {
        // If cookies denied, just acknowledge the like but don't save
        console.log('Like acknowledged, but not saved due to cookie preferences');
        return false;
    } else {
        // If consent not given yet, use temporary storage
        const tempSavedPosts = sessionStorage.getItem('tempLikedPosts');
        if (tempSavedPosts) {
            likedPosts = JSON.parse(tempSavedPosts);
        }
        
        // Add new post if not already liked
        if (!likedPosts.includes(postId)) {
            likedPosts.push(postId);
        }
        
        // Save to temporary storage
        sessionStorage.setItem('tempLikedPosts', JSON.stringify(likedPosts));
        console.log('Post liked temporarily. Accept cookies to save permanently.');
        return false;
    }
}

// Check if a post is liked
function isPostLiked(postId) {
    const consentChoice = localStorage.getItem('cookieConsent');
    
    // If cookies are denied, always return false
    if (consentChoice === 'denied') {
        return false;
    }
    
    // Get liked posts from appropriate storage
    const savedPosts = getUserData('likedPosts');
    
    if (savedPosts) {
        const likedPosts = JSON.parse(savedPosts);
        return likedPosts.includes(postId);
    }
    
    return false;
}