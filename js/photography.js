document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader immediately
    document.body.classList.remove('ss-preload');
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxLoading = lightbox.querySelector('.lightbox-loading');
    const closeButton = lightbox.querySelector('.lightbox-close');
    
    // Preload all thumbnails to ensure they display properly
    function preloadThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumbnail => {
            // Add error handling for each thumbnail
            thumbnail.onerror = function() {
                console.error(`Failed to load thumbnail: ${thumbnail.src}`);
                // Try loading with corrected path if needed
                const originalSrc = thumbnail.src;
                if (originalSrc.includes('_MG_')) {
                    // Some image paths might need correction
                    const correctedSrc = originalSrc.replace('_MG_', '_MG_');
                    if (correctedSrc !== originalSrc) {
                        console.log(`Trying corrected path: ${correctedSrc}`);
                        thumbnail.src = correctedSrc;
                    }
                }
            };
            
            // Force reload the image
            const currentSrc = thumbnail.src;
            thumbnail.src = '';
            thumbnail.src = currentSrc;
        });
    }
    
    // Function to open the lightbox
    function openLightbox(imagePath) {
        // Show loading indicator
        lightboxLoading.style.display = 'block';
        lightboxImg.style.opacity = '0';
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Create a new image to preload
        const preloadImg = new Image();
        
        preloadImg.onload = function() {
            // Once loaded, update lightbox image
            lightboxImg.src = imagePath;
            setTimeout(() => {
                lightboxImg.style.opacity = '1';
                lightboxLoading.style.display = 'none';
            }, 100);
        };
        
        preloadImg.onerror = function() {
            console.error(`Failed to load image: ${imagePath}`);
            // Try with a corrected path
            if (imagePath.includes('_MG_')) {
                const correctedPath = imagePath.replace('_MG_', '_MG_');
                if (correctedPath !== imagePath) {
                    console.log(`Trying corrected path: ${correctedPath}`);
                    preloadImg.src = correctedPath;
                    return;
                }
            }
            
            // If still fails, show error
            lightboxLoading.style.display = 'none';
            alert('Failed to load image. Please try again.');
        };
        
        // Start loading
        preloadImg.src = imagePath;
    }
    
    // Function to close the lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear the image src to stop any ongoing downloads
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }
    
    // Add click event to each gallery item
    galleryItems.forEach(item => {
        // Get the image path from data attribute
        const imagePath = item.getAttribute('data-img');
        const thumbnailImg = item.querySelector('.thumbnail');
        
        // Add click event
        item.addEventListener('click', () => {
            openLightbox(imagePath);
        });
    });
    
    // Close lightbox events
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Preload thumbnails after a short delay
    setTimeout(preloadThumbnails, 500);
});
