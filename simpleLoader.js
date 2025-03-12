document.addEventListener('DOMContentLoaded', function() {
    // Create a simple loader overlay
    const loaderOverlay = document.createElement('div');
    loaderOverlay.id = 'simple-loader-overlay';
    
    // Create spinner container that will hold both spinner and text
    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'spinner-container';
    
    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'simple-spinner';
    
    // Create initials (now placed inside spinner)
    const initials = document.createElement('div');
    initials.className = 'simple-initials';
    initials.textContent = 'MZ';
    
    // Assemble elements - put initials inside the spinner container
    spinnerContainer.appendChild(spinner);
    spinnerContainer.appendChild(initials);
    loaderOverlay.appendChild(spinnerContainer);
    
    // Add to document (as the first element in body)
    document.body.insertBefore(loaderOverlay, document.body.firstChild);
    
    // Temporarily hide the body content (except the loader) to prepare for smooth fade-in
    const bodyContent = Array.from(document.body.children).filter(el => el !== loaderOverlay);
    bodyContent.forEach(el => {
        if (el !== loaderOverlay) {
            el.style.opacity = '0';
            el.style.transition = 'opacity 1s ease-in-out';
        }
    });
    
    // Add inline styles to avoid dependency on external CSS
    const style = document.createElement('style');
    style.textContent = `
        #simple-loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #121212;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 1.2s ease-out; /* Slower, smoother fade for background */
        }
        
        .spinner-container {
            position: relative;
            width: 150px;
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); /* More natural easing */
        }
        
        .simple-spinner {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid rgba(85, 139, 255, 0.1);
            border-top: 5px solid #558bff;
            animation: simple-spin 0.8s linear infinite;
        }
        
        .simple-initials {
            color: #558bff;
            font-family: sans-serif;
            font-size: 2.5rem;
            letter-spacing: 3px;
            z-index: 2;
            text-shadow: 0 0 10px rgba(85, 139, 255, 0.5);
            animation: pulse 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes simple-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0% { opacity: 0.7; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1.05); }
        }
        
        .simple-fade-out {
            opacity: 0 !important;
            pointer-events: none;
        }
        
        @keyframes zoom-out {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.8); opacity: 0; }
        }
        
        .zoom-out-effect {
            animation: zoom-out 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; /* Smoother easing */
        }
        
        /* Background darkening effect that fades out with the loader */
        .site-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
            pointer-events: none;
            transition: opacity 1.5s ease;
        }
        
        .site-backdrop.fade-out {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Create a fading backdrop to smooth the transition
    const backdrop = document.createElement('div');
    backdrop.className = 'site-backdrop';
    document.body.insertBefore(backdrop, document.body.firstChild);
    
    // Remove loader when everything is loaded
    window.addEventListener('load', function() {
        // Short delay to ensure everything is rendered
        setTimeout(function() {
            // First apply the zoom-out animation to the spinner
            spinnerContainer.classList.add('zoom-out-effect');
            
            // Start fading out the background at the same time as the zoom effect
            loaderOverlay.classList.add('simple-fade-out');
            
            // Start fading in the page content before the loader is completely gone for a smoother transition
            setTimeout(function() {
                // Fade in all body content
                bodyContent.forEach(el => {
                    el.style.opacity = '1';
                });
                
                // Fade out the backdrop
                backdrop.classList.add('fade-out');
                
                // Then remove loader elements after animations complete
                setTimeout(function() {
                    if (document.body.contains(loaderOverlay)) {
                        document.body.removeChild(loaderOverlay);
                    }
                    if (document.body.contains(backdrop)) {
                        document.body.removeChild(backdrop);
                    }
                    if (document.head.contains(style)) {
                        document.head.removeChild(style);
                    }
                    
                    // Remove the inline opacity styles
                    bodyContent.forEach(el => {
                        setTimeout(() => {
                            el.style.opacity = '';
                            el.style.transition = '';
                        }, 100);
                    });
                }, 1500); // Extended time to ensure animations complete
            }, 400); // Start fading in content before loader is completely gone
        }, 450);
    });
});
