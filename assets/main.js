// Go Rocket Car Rental - Main Logic

document.addEventListener('DOMContentLoaded', () => {

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


    // --- 3. Background Music Toggle (Unified Desktop & Mobile) ---
    const musicToggleBtns = document.querySelectorAll('#musicToggle, #mobileMusicToggle');
    const bgMusic = document.getElementById('bgMusic');

    let isPlaying = false;

    // Helper to update all icons
    function updateMusicIcons(playing) {
        document.querySelectorAll('.ph-speaker-slash, .ph-speaker-high').forEach(icon => {
            if (playing) {
                icon.classList.remove('ph-speaker-slash');
                icon.classList.add('ph-speaker-high');
            } else {
                icon.classList.remove('ph-speaker-high');
                icon.classList.add('ph-speaker-slash');
            }
        });

        // Update Mobile Label
        const mobileLabel = document.querySelector('.music-label');
        if (mobileLabel) mobileLabel.textContent = playing ? "Tutup Muzik" : "Muzik Latar";
    }

    if (bgMusic && musicToggleBtns.length > 0) {
        bgMusic.volume = 0.3;

        musicToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isPlaying) {
                    bgMusic.pause();
                    updateMusicIcons(false);
                    isPlaying = false;
                } else {
                    bgMusic.play().then(() => {
                        updateMusicIcons(true);
                        isPlaying = true;
                    }).catch(err => {
                        console.log("Audio play failed:", err);
                        alert("Sila klik di mana-mana pada halaman dahulu, kemudian cuba lagi.");
                    });
                }
            });
        });
    }

    // --- 3.1 Fleet Navigation Logic (Floating Pill) ---
    const fleetTabs = document.querySelectorAll('.fleet-tab');
    const fleetSections = document.querySelectorAll('.fleet-category');
    const fleetNavContainer = document.querySelector('.fleet-nav-container');

    if (fleetTabs.length > 0 && fleetNavContainer) {
        // 1. Initial State: Hidden
        fleetNavContainer.classList.add('hidden-pill');

        // 2. Click to Scroll & Set Active
        fleetTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Immediate visual update
                fleetTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetId = tab.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offset = 100; // Adjust for centered view
                    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 3. Floating Pill Visibility Logic (Hybrid Strict)
        const staticNav = document.querySelector('.fleet-nav-static-container');

        if (staticNav) {
            // A. Observer handles the "Is it on screen?" part
            const pillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fleetNavContainer.classList.add('hidden-pill'); // Seeing static, so hide floating
                    } else {
                        // It's off screen, but are we ABOVE it or BELOW it?
                        const rect = staticNav.getBoundingClientRect();

                        // If static nav is off-screen to the TOP (negative top), we are deep in fleet -> SHOW
                        // If static nav is off-screen to the BOTTOM (positive top), we are above it -> HIDE
                        if (rect.top < 0) {
                            fleetNavContainer.classList.remove('hidden-pill');
                        } else {
                            fleetNavContainer.classList.add('hidden-pill');
                        }
                    }
                });
            }, {
                rootMargin: "-20px 0px 0px 0px" // Trigger just as it leaves top
            });

            pillObserver.observe(staticNav);

            // B. Scroll Backup (Double Safety)
            window.addEventListener('scroll', () => {
                const staticTop = staticNav.offsetTop;
                if (window.scrollY < staticTop) {
                    fleetNavContainer.classList.add('hidden-pill');
                }
            }, { passive: true });

            // C. Portfolio Intersection (Bottom Boundary)
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                const portfolioObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            fleetNavContainer.classList.add('hidden-pill'); // Hit bottom boundary
                        } else {
                            // Logic: If we are not intersecting, where is the portfolio?
                            // If rect.top > 0, it means Portfolio is BELOW us (we scrolled up).
                            if (entry.boundingClientRect.top > 0) {
                                // Check if we are safely below the static nav (Active Zone)
                                const staticRect = staticNav.getBoundingClientRect();
                                if (staticRect.top < 0) {
                                    fleetNavContainer.classList.remove('hidden-pill'); // Bring it back!
                                }
                            }
                        }
                    });
                }, {
                    rootMargin: "-50px 0px 0px 0px" // Trigger LATER (when Portfolio is actually visible)
                });
                portfolioObserver.observe(portfolioSection);
            }
        } else {
            fleetNavContainer.classList.remove('hidden-pill');
        }

        // 4. Scroll Spy (Intersection Observer Implementation)
        const spyOption = {
            root: null,
            rootMargin: "-110px 0px -70% 0px",
            threshold: 0
        };

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');

                    // Update Floating Tabs
                    fleetTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('data-target') === currentId) {
                            tab.classList.add('active');
                            // Auto-scroll pill container
                            const container = document.querySelector('.fleet-nav');
                            if (container) {
                                const tabLeft = tab.offsetLeft;
                                const containerWidth = container.offsetWidth;
                                const scrollPos = tabLeft - (containerWidth / 2) + (tab.offsetWidth / 2);
                                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
                            }
                        }
                    });

                    // Update Static Tabs
                    const staticTabs = document.querySelectorAll('.fleet-nav-static .fleet-tab');
                    staticTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('data-target') === currentId) {
                            tab.classList.add('active');
                        }
                    });
                }
            });
        }, spyOption);

        fleetSections.forEach(section => {
            spyObserver.observe(section);
        });
    }

    // --- 4. Pixel & Tracking Stubs ---
    window.trackViewContent = (source = 'page') => {
        console.log(`[Tracking] ViewContent fired. Source: ${source}`);
    };

    window.trackContact = (source = 'cta', method = 'whatsapp') => {
        console.log(`[Tracking] Contact fired. Method: ${method}, Source: ${source}`);
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
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = lastScrollY;
                    if (scrolled < heroSection.offsetHeight) {
                        heroBg.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }


    // --- 7. Typewriter Effect ---
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
        if (typeIndex >= words.length) typeIndex = 0;

        const currentWord = words[typeIndex];
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

    if (document.querySelector('.typewriter')) {
        typeWriterLoop();
    }

    // --- 8. 3D Tilt Effect for Cards ---
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

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);

        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (typeof translations !== 'undefined' && translations[key] && translations[key][lang]) {
                el.innerHTML = translations[key][lang];
            }
        });

        clearTimeout(typeTimeout);
        charIndex = 0;
        isDeleting = false;
        setTimeout(() => {
            typeWriterLoop();
        }, 50);

        document.documentElement.lang = lang === 'bm' ? 'ms' : 'en';
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    const savedLang = localStorage.getItem('preferredLang') || 'bm';
    if (typeof translations !== 'undefined') {
        setLanguage(savedLang);
    }

    // --- 9. VVIP Carousel Logic ---
    const vvipCards = document.querySelectorAll('.vvip-card');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const carouselContainer = document.querySelector('.vvip-carousel-container');

    if (vvipCards.length > 0) {
        let currentCarouselIndex = 3;
        let autoScrollInterval = null;
        const AUTO_SCROLL_DELAY = 4000;

        function updateCarousel(newIndex) {
            if (newIndex < 0) newIndex = vvipCards.length - 1;
            if (newIndex >= vvipCards.length) newIndex = 0;

            currentCarouselIndex = newIndex;

            const prevIndex = (currentCarouselIndex - 1 + vvipCards.length) % vvipCards.length;
            const nextIndex = (currentCarouselIndex + 1) % vvipCards.length;

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

            carouselDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentCarouselIndex);
            });
        }

        function startAutoScroll() {
            stopAutoScroll();
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

        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoScroll);
            carouselContainer.addEventListener('mouseleave', startAutoScroll);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentCarouselIndex - 1);
                startAutoScroll();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentCarouselIndex + 1);
                startAutoScroll();
            });
        }

        vvipCards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (i !== currentCarouselIndex) {
                    updateCarousel(i);
                    startAutoScroll();
                }
            });
        });

        carouselDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                updateCarousel(i);
                startAutoScroll();
            });
        });

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
                        updateCarousel(currentCarouselIndex + 1);
                    } else {
                        updateCarousel(currentCarouselIndex - 1);
                    }
                    startAutoScroll();
                }
            }
        }

        // --- 5. USP Section Auto-Scroll (Mobile Only - Hybrid Snap v2) ---
        if (window.innerWidth <= 768) {
            const uspContainer = document.querySelector('#usp .grid-3, #usp .grid-2');
            if (uspContainer) {

                // 1. Initial State: Disable Snap to allow Drift
                uspContainer.style.scrollBehavior = 'auto';
                uspContainer.style.scrollSnapType = 'none'; // DISABLE SNAP initially

                const originalItems = Array.from(uspContainer.children);

                // Clean styles
                originalItems.forEach(item => {
                    item.classList.remove('scroll-reveal', 'delay-100', 'delay-200', 'delay-300');
                    item.style.opacity = '1';
                    item.style.transform = 'none';
                });

                // Clone 10 times
                for (let i = 0; i < 10; i++) {
                    originalItems.forEach(item => {
                        const clone = item.cloneNode(true);
                        clone.classList.remove('scroll-reveal');
                        clone.style.opacity = '1';
                        clone.style.transform = 'none';
                        clone.setAttribute('aria-hidden', 'true');
                        uspContainer.appendChild(clone);
                    });
                }

                // 2. Drift Engine
                let driftId;
                let isPaused = false;

                function driftEngine() {
                    if (!isPaused) {
                        uspContainer.scrollLeft += 1;

                        if (uspContainer.scrollLeft >= (uspContainer.scrollWidth - uspContainer.clientWidth - 5)) {
                            uspContainer.scrollLeft = 0;
                        }
                    }
                    driftId = requestAnimationFrame(driftEngine);
                }

                // 3. Smart Interaction (Toggle Snap)

                // On Touch: Enable Snap (Manual Feel) & Pause Drift
                uspContainer.addEventListener('touchstart', () => {
                    isPaused = true;
                    uspContainer.style.scrollSnapType = 'x mandatory'; // ENABLE SNAP
                    uspContainer.style.scrollBehavior = 'smooth';
                }, { passive: true });

                // On Touch End: Wait, then Disable Snap & Resume Drift
                uspContainer.addEventListener('touchend', () => {
                    setTimeout(() => {
                        isPaused = false;
                        uspContainer.style.scrollSnapType = 'none'; // DISABLE SNAP AGAIN
                        uspContainer.style.scrollBehavior = 'auto'; // Back to linear drift
                    }, 3000);
                }, { passive: true });

                // Start
                driftEngine();
            }
        }
    }

    // --- 10. Navbar Shrink on Scroll ---
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        let navTicking = false;
        window.addEventListener('scroll', () => {
            if (!navTicking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 100) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    navTicking = false;
                });
                navTicking = true;
            }
        }, { passive: true });
    }

    // --- 11. Video Mute/Unmute Toggle ---
    const muteButtons = document.querySelectorAll('.video-mute-btn');

    muteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoCard = btn.closest('.video-card');
            const video = videoCard.querySelector('video');
            const icon = btn.querySelector('i');

            if (video.muted) {
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
                video.muted = true;
                btn.classList.remove('unmuted');
                icon.className = 'ph ph-speaker-x';
            }
        });
    });

    // --- 12. Scroll-Triggered Active States (Mobile) ---
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
            threshold: 0.5,
            rootMargin: "-10% 0px -10% 0px"
        });

        scrollActiveCards.forEach(card => scrollActiveObserver.observe(card));
    }


    // --- 14. Mobile Floating CTA Logic (Contextual Switch) ---
    const mobileActionBar = document.querySelector('.mobile-action-bar');
    const floatingWhatsApp = document.querySelector('.floating-whatsapp');
    const heroCtaTarget = document.querySelector('.hero');

    if (mobileActionBar && floatingWhatsApp && heroCtaTarget) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) return;

            const heroBottom = heroCtaTarget.getBoundingClientRect().bottom;
            const threshold = 100;

            if (heroBottom < threshold) {
                if (!mobileActionBar.classList.contains('visible')) {
                    mobileActionBar.classList.add('visible');
                    floatingWhatsApp.classList.add('hidden');
                }
            } else {
                if (mobileActionBar.classList.contains('visible')) {
                    mobileActionBar.classList.remove('visible');
                    floatingWhatsApp.classList.remove('hidden');
                }
            }
        });
    }

});
