// Go Rocket Car Rental - Main Logic

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggle ---
    // --- 1. Mobile Menu Toggle (Refactored v3.11) ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navClose = document.getElementById('navClose');

    if (hamburger && mobileMenu) {
        // Toggle Menu
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');

            // X Animation
            const bars = hamburger.querySelectorAll('.bar');
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close when clicking links
        document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Reset bars
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });

        // Close when clicking OUTSIDE
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Reset bars
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Dedicated Close Button
        if (navClose) {
            navClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Reset bars
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        }
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

    // --- 9. VVIP Carousel Logic ---
    const vvipCards = document.querySelectorAll('.vvip-card');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const carouselContainer = document.querySelector('.vvip-carousel-container');

    if (vvipCards.length > 0) {
        let currentCarouselIndex = 3; // Start with Lazada (center card) active
        let autoScrollInterval = null;
        const AUTO_SCROLL_DELAY = 4000; // 4 seconds

        function updateCarousel(newIndex) {
            // Wrap around logic
            if (newIndex < 0) newIndex = vvipCards.length - 1;
            if (newIndex >= vvipCards.length) newIndex = 0;

            currentCarouselIndex = newIndex;

            // Calculate prev and next indices with wrap
            const prevIndex = (currentCarouselIndex - 1 + vvipCards.length) % vvipCards.length;
            const nextIndex = (currentCarouselIndex + 1) % vvipCards.length;

            // Update cards - show only active, prev, and next
            vvipCards.forEach((card, i) => {
                card.classList.remove('active', 'prev-card', 'next-card');

                if (i === currentCarouselIndex) {
                    card.classList.add('active');
                } else if (i === prevIndex) {
                    card.classList.add('prev-card');
                } else if (i === nextIndex) {
                    card.classList.add('next-card');
                }
            });

            // Update dots
            carouselDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentCarouselIndex);
            });
        }

        // Auto-scroll function
        function startAutoScroll() {
            stopAutoScroll(); // Clear any existing interval
            autoScrollInterval = setInterval(() => {
                updateCarousel(currentCarouselIndex + 1);
            }, AUTO_SCROLL_DELAY);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        // Pause on hover
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoScroll);
            carouselContainer.addEventListener('mouseleave', startAutoScroll);
        }

        // Navigation button handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentCarouselIndex - 1);
                startAutoScroll(); // Reset timer after manual navigation
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentCarouselIndex + 1);
                startAutoScroll(); // Reset timer after manual navigation
            });
        }

        // Click on card to navigate
        vvipCards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (i !== currentCarouselIndex) {
                    updateCarousel(i);
                    startAutoScroll(); // Reset timer after manual navigation
                }
            });
        });

        // Dot click handlers
        carouselDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                updateCarousel(i);
                startAutoScroll(); // Reset timer after manual navigation
            });
        });

        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        const carouselElement = document.querySelector('.vvip-carousel');

        if (carouselElement) {
            carouselElement.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carouselElement.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next
                        updateCarousel(currentCarouselIndex + 1);
                    } else {
                        // Swipe right - prev
                        updateCarousel(currentCarouselIndex - 1);
                    }
                    startAutoScroll();
                }
            }
        }

        // Start auto-scroll on page load
        startAutoScroll();
    }

    // --- 10. Navbar Shrink on Scroll ---
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- 11. Video Mute/Unmute Toggle ---
    const muteButtons = document.querySelectorAll('.video-mute-btn');

    muteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoCard = btn.closest('.video-card');
            const video = videoCard.querySelector('video');
            const icon = btn.querySelector('i');

            if (video.muted) {
                // Unmute this video, mute all others
                document.querySelectorAll('.video-player').forEach(v => {
                    v.muted = true;
                });
                document.querySelectorAll('.video-mute-btn').forEach(b => {
                    b.classList.remove('unmuted');
                    b.querySelector('i').className = 'ph ph-speaker-x';
                });

                video.muted = false;
                btn.classList.add('unmuted');
                icon.className = 'ph ph-speaker-high';
            } else {
                // Mute this video
                video.muted = true;
                btn.classList.remove('unmuted');
                icon.className = 'ph ph-speaker-x';
            }
        });
    });

    // --- 12. Scroll-Triggered Active States (Mobile) ---
    // Use Intersection Observer to add 'scroll-active' class when cards are in viewport
    if (window.innerWidth <= 768) {
        const scrollActiveCards = document.querySelectorAll('.fleet-card, .usp-card, .step-item, .info-block');

        const scrollActiveObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-active');
                } else {
                    entry.target.classList.remove('scroll-active');
                }
            });
        }, {
            threshold: 0.5, // Trigger when 50% visible
            rootMargin: "-10% 0px -10% 0px" // Slightly offset from center
        });

        scrollActiveCards.forEach(card => scrollActiveObserver.observe(card));
    }

});
