document.addEventListener('DOMContentLoaded', function() {
    // Project data
    const projectsData = [
        {
            id: 'project1',
            title: 'Test 1',
            description: 'This is a more detailed description of Test 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
            demoLink: '#',
            githubLink: '#',
            technologies: ['HTML', 'CSS', 'JS',],
            images: [
                '/img/placeholder.jpg',
                '/img/placeholder.jpg'
            ]
        },
        {
            id: 'project2',
            title: 'Test 2',
            description: 'This is a more detailed description of Test 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
            demoLink: '#',
            githubLink: '#',
            technologies: ['HTML', 'CSS', 'JS',],
            images: [
                '/img/placeholder.jpg',
                '/img/placeholder.jpg'
            ]
        },
        {
            id: 'project3',
            title: 'Test 3',
            description: 'This is a more detailed description of Test 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
            demoLink: '#',
            githubLink: '#',
            technologies: ['HTML', 'CSS', 'JS',],
            images: [
                '/img/placeholder.jpg',
                '/img/placeholder.jpg'
            ]
        }
    ];

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
});

// Lightbox Viewer (IMG Enlarger)
document.addEventListener('DOMContentLoaded', function() {
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
});