document.addEventListener('DOMContentLoaded', function() {
    initializeTypingEffect();
    
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

    initializeSocialIcons();
    initializeNavbarBehavior();

    // Load project data and initialize components
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateProjectCards(data.projects);
            
            initializeProjects(data.projects);
            initializeLightbox();
            initializeMobileMenu();
        })
        .catch(error => {
            console.error('Error loading project data:', error);
        });

    function initializeNavbarBehavior() {
        const navbar = document.querySelector('.nav-container');
        const navLinks = document.querySelectorAll('.nav-links a, .nav-right a, .logo');
        let lastScrollTop = 0;
        let isHovering = false;
        let navbarHeight = navbar.offsetHeight;
        let timeout;
        
        const hoverArea = document.createElement('div');
        hoverArea.className = 'navbar-hover-area';
        document.body.appendChild(hoverArea);
        
        window.addEventListener('scroll', function() {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll <= 50) {
                navbar.classList.remove('hidden');
                return;
            }
            
            if (isHovering) {
                return;
            }
            
            if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            
            lastScrollTop = currentScroll;
        });
        
        hoverArea.addEventListener('mouseenter', function() {
            isHovering = true;
            navbar.classList.remove('hidden');
            
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        });
        
        navbar.addEventListener('mouseenter', function() {
            isHovering = true;
            navbar.classList.remove('hidden');
            
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        });
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                isHovering = true;
                navbar.classList.remove('hidden');
                
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            });
        });
        
        hoverArea.addEventListener('mouseleave', function() {
            timeout = setTimeout(() => {
                if (!isHoveringNavbar()) {
                    isHovering = false;
                    
                    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                    if (currentScroll > 50) {
                        navbar.classList.add('hidden');
                    }
                }
            }, 300);
        });
        
        navbar.addEventListener('mouseleave', function() {
            timeout = setTimeout(() => {
                if (!isHoveringHoverArea()) {
                    isHovering = false;
                    
                    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                    if (currentScroll > 50) {
                        navbar.classList.add('hidden');
                    }
                }
            }, 300);
        });
        
        function isHoveringNavbar() {
            return document.querySelector('.nav-container:hover') !== null;
        }
        
        function isHoveringHoverArea() {
            return document.querySelector('.navbar-hover-area:hover') !== null;
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
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

    function populateProjectCards(projectsData) {
        const projectsGrid = document.querySelector('.projects-grid');
        
        projectsGrid.innerHTML = '';
        
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

    function initializeProjects(projectsData) {
        const projectCards = document.querySelectorAll('.project-card');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.querySelector('.modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalGallery = document.getElementById('modal-gallery');
        const modalTechList = document.getElementById('modal-tech-list');
        const modalDemo = document.getElementById('modal-demo');
        const modalGithub = document.getElementById('modal-github');

        projectCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const project = projectsData[index];
                
                modalTitle.textContent = project.title;
                modalDescription.innerHTML = `<p>${project.description}</p>`;
                
                modalGallery.innerHTML = '';
                project.images.forEach(img => {
                    const imgElement = document.createElement('img');
                    imgElement.src = img;
                    imgElement.alt = project.title;
                    modalGallery.appendChild(imgElement);
                });
                
                modalTechList.innerHTML = '';
                project.technologies.forEach(tech => {
                    const li = document.createElement('li');
                    li.textContent = tech;
                    modalTechList.appendChild(li);
                });
                
                modalDemo.href = project.demoLink;
                modalGithub.href = project.githubLink;
                
                modalOverlay.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });

        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }

    function initializeLightbox() {
        const lightboxOverlay = document.getElementById('lightbox-overlay');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        let currentImageIndex = 0;
        let currentImages = [];
        
        function openLightbox(images, index) {
            currentImages = images;
            currentImageIndex = index;
            
            updateLightboxImage();
            
            lightboxOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        }
        
        function updateLightboxImage() {
            lightboxImage.src = currentImages[currentImageIndex];
            lightboxCaption.textContent = `Image ${currentImageIndex + 1} of ${currentImages.length}`;
            
            if (currentImages.length <= 1) {
                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';
            } else {
                lightboxPrev.style.display = 'flex';
                lightboxNext.style.display = 'flex';
            }
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('.modal-gallery img')) {
                const clickedImg = e.target.closest('.modal-gallery img');
                const galleryImages = Array.from(document.querySelectorAll('.modal-gallery img')).map(img => img.src);
                const clickedIndex = galleryImages.indexOf(clickedImg.src);
                
                openLightbox(galleryImages, clickedIndex);
                
                e.stopPropagation();
            }
        });
        
        lightboxPrev.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        });
        
        lightboxNext.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            updateLightboxImage();
        });
        
        lightboxClose.addEventListener('click', function() {
            lightboxOverlay.classList.remove('active');
        });
        
        lightboxOverlay.addEventListener('click', function(e) {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
            }
        });
        
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

    function initializeMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
            mobileMenuToggle.classList.toggle('active');
        });
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            });
        }
        
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
                
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
        
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
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
                charIndex++;
                const speed = Math.random() * 50 + 30;
                setTimeout(typeEffect, speed);
            } else if (!isDeleting && charIndex === text.length) {
                isDeleting = false;
                pauseEnd = true;
                setTimeout(typeEffect, 1000);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                const speed = Math.random() * 50 + 30;
                setTimeout(typeEffect, speed);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                setTimeout(typeEffect, 500);
            } else if (pauseEnd) {
                if (Math.random() < 0.25) {
                    isDeleting = true;
                    pauseEnd = false;
                }
                setTimeout(typeEffect, 2000);
            }
        }
        
        setTimeout(typeEffect, 1000);
        
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    function initializeSocialIcons() {
        const socialIcons = document.querySelectorAll('.social-icons a');
        
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            });
            
            icon.addEventListener('touchstart', function(e) {
                e.target.classList.add('touch-effect');
                setTimeout(() => {
                    e.target.classList.remove('touch-effect');
                }, 300);
            }, { passive: true });
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(adjustLayout, 300);
        });
        
        adjustLayout();
    }
    
    function adjustLayout() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const header = document.querySelector('.header');
        const scrollArrow = document.querySelector('.scroll-down-arrow');
        
        if (isLandscape && window.innerHeight < 500) {
            header.style.paddingBottom = '100px';
            if (scrollArrow) scrollArrow.style.bottom = '20px';
        } else {
            header.style.paddingBottom = '';
            if (scrollArrow) scrollArrow.style.bottom = '';
        }
    }
});