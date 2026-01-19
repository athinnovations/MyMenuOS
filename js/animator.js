// Intersection Observer & Smooth Scroll (Lenis)
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Parallax & Scroll Logic
    const heroVideo = document.querySelector('.hero_videoBackground__IiktF video');
    // FIX: Target the PARENT column for parallax so we don't override the inner CSS animation
    const galleryCols = document.querySelectorAll('.gallery_column__Q1Uug');

    lenis.on('scroll', (e) => {
        // Hero Parallax
        if (heroVideo) {
            heroVideo.style.transform = `scale(1.1) translateY(${e.scroll * 0.2}px)`; // Slow/Subtle move
        }

        // Gallery Parallax (Staggered columns)
        galleryCols.forEach((col, i) => {
            // User requested: 1st UP, 2nd DOWN, 3rd UP. Made "faster" (speed 0.2)
            const speed = (i % 2 === 0) ? -0.2 : 0.2;

            // Apply transform to PARENT
            col.style.transform = `translateY(${e.scroll * speed}px)`;
        });
    });
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate]');

    // Add staggering to list items automatically
    const staggerGroups = document.querySelectorAll('.pricing_listContainer__ZFxbt, .partners_list__U3BnC');
    staggerGroups.forEach(group => {
        const children = group.children;
        Array.from(children).forEach((child, index) => {
            child.setAttribute('data-animate', 'fade-up');
            child.style.transitionDelay = `${index * 0.1}s`; // 100ms stagger
        });
    });

    const allAnimated = document.querySelectorAll('[data-animate]');
    allAnimated.forEach(el => observer.observe(el));

    // Sticky Nav Scroll Logic
    const stickyNav = document.getElementById('sticky-nav');
    const heroSection = document.getElementById('hero');

    // Sticky Nav (Use Lenis scroll listeners)
    lenis.on('scroll', (e) => {
        if (!stickyNav || !heroSection) return;
        const heroHeight = heroSection.offsetHeight;
        if (e.scroll > heroHeight - 100) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }
    });
});


// Capabilities Switcher Logic
window.switchCapability = function (index, btn) {
    // Update Buttons
    const buttons = document.querySelectorAll('.capabilities_groupTitle__wozkx');
    buttons.forEach(b => b.classList.remove('capabilities_selected__ystUY'));
    if (btn) btn.classList.add('capabilities_selected__ystUY');

    // Update Text
    const texts = document.querySelectorAll('.capabilities_groupCopy__ljx_K');
    texts.forEach(t => {
        t.style.opacity = '0';
        t.classList.remove('capabilities_selected__ystUY');
    });
    const selectedText = document.getElementById(`cap-text-${index}`);
    if (selectedText) {
        selectedText.style.opacity = '1';
        selectedText.classList.add('capabilities_selected__ystUY');
    }

    // Update Image (Filter effect for demo)
    const img = document.getElementById('capability-img');
    if (img) {
        img.style.opacity = 0;
        setTimeout(() => {
            // Change filter/src here if we had different images
            const hues = [0, 120, 240];
            img.style.filter = `hue-rotate(${hues[index]}deg)`;
            img.style.opacity = 1;
        }, 300);
    }
};
