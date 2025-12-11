// Go Drive Car Rental - Main Logic

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Toggle hamburger animation state
            const bars = hamburger.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                // Simple X transformation
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                // Reset hamburger
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // --- 2. Scroll Animation (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 3. Background Music Toggle ---
    const musicIcon = document.getElementById('musicIcon');
    const musicToggleBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    let isPlaying = false;

    if (musicToggleBtn && bgMusic) {
        bgMusic.volume = 0.3;

        musicToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicIcon.classList.remove('ph-speaker-high');
                musicIcon.classList.add('ph-speaker-slash');
                musicToggleBtn.setAttribute('aria-label', 'Play background music');
                isPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    musicIcon.classList.remove('ph-speaker-slash');
                    musicIcon.classList.add('ph-speaker-high');
                    musicToggleBtn.setAttribute('aria-label', 'Pause background music');
                    isPlaying = true;
                }).catch(err => {
                    console.log("Audio play failed:", err);
                    alert("Sila klik di mana-mana pada halaman dahulu, kemudian cuba lagi.");
                });
            }
        });
    }

    // --- 4. Pixel & Tracking Stubs ---
    window.trackViewContent = (source = 'page') => {
        console.log(`[Tracking] ViewContent fired. Source: ${source}`);
        // if (typeof fbq === 'function') fbq('track', 'ViewContent', { content_name: source });
        // if (typeof ttq === 'object') ttq.track('ViewContent', { content_name: source });
    };

    window.trackContact = (source = 'cta', method = 'whatsapp') => {
        console.log(`[Tracking] Contact fired. Method: ${method}, Source: ${source}`);
        // if (typeof fbq === 'function') fbq('track', 'Contact', { content_name: method });
        // if (typeof ttq === 'object') ttq.track('ClickButton', { content_name: method });
    };

    // --- 5. Event Listeners for Tracking ---
    window.trackViewContent('homepage_load');

    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            window.trackContact('button_click', 'whatsapp');
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
        btn.addEventListener('click', () => {
            window.trackContact('button_click', 'call');
        });
    });

    // --- 6. Parallax Effect for Hero (GPU Accelerated) ---
    const heroBg = document.querySelector('.hero-bg');
    const heroSection = document.querySelector('.hero');

    if (heroSection && heroBg) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            // Optimization: Mobile check removed (User requested parallax back)
            // if (window.innerWidth <= 768) return; 

            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = lastScrollY;
                    if (scrolled < heroSection.offsetHeight) {
                        // Use translate3d for hardware acceleration
                        // Optimization: Use slightly lower speed factor on mobile if needed, but 0.5 is standard.
                        // We will keep 0.5 as it's efficient with will-change.
                        heroBg.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }


    // --- 7. Typewriter Effect ---
    // Defined globally so it can be accessed
    let typeTimeout = null;
    let typeIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentLang = localStorage.getItem('preferredLang') || 'bm';

    const typeWords = {
        bm: ["Dipercayai", "Bersih", "Wangi", "Berbaloi"],
        en: ["Trusted", "Clean", "Fragrant", "First Choice"]
    };

    function typeWriterLoop() {
        const targetEl = document.querySelector('.typewriter');
        if (!targetEl) return;

        const words = typeWords[currentLang];
        // Ensure index is valid for new language
        if (typeIndex >= words.length) typeIndex = 0;

        const currentWord = words[typeIndex];

        // Security check
        if (!currentWord) {
            typeIndex = 0;
            return;
        }

        if (isDeleting) {
            targetEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            targetEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            typeIndex = (typeIndex + 1) % words.length;
            typeSpeed = 500;
        }

        typeTimeout = setTimeout(typeWriterLoop, typeSpeed);
    }

    // Start initial typing
    if (document.querySelector('.typewriter')) {
        typeWriterLoop();
    }

    // --- 8. 3D Tilt Effect for Cards ---
    // Optimization: Only initialize on desktop to save mobile resources
    if (window.innerWidth > 768) {
        const cards = document.querySelectorAll('.fleet-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const maxRot = 10;
                const rotateX = ((y - centerY) / centerY) * -maxRot;
                const rotateY = ((x - centerX) / centerX) * maxRot;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // --- Language Switcher Logic ---
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-i18n]');

    // Function to set language
    function setLanguage(lang) {
        // Update Global State
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);

        // 1. Update Buttons
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Update Content
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (typeof translations !== 'undefined' && translations[key] && translations[key][lang]) {
                el.innerHTML = translations[key][lang];
            }
        });

        // 3. Restart Typewriter
        clearTimeout(typeTimeout);
        charIndex = 0;
        isDeleting = false;
        setTimeout(() => {
            typeWriterLoop();
        }, 50);

        // 4. Update HTML lang
        document.documentElement.lang = lang === 'bm' ? 'ms' : 'en';
    }

    // Event Listeners for language buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Initialize Language
    const savedLang = localStorage.getItem('preferredLang') || 'bm';
    if (typeof translations !== 'undefined') {
        setLanguage(savedLang);
    } else {
        console.warn('Translations object not found');
    }

});
