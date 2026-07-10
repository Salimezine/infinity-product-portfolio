/* ============================================
   INFINITY PRODUCT - PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Cursor Glow Effect
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const suffixElements = document.querySelectorAll('.stat-suffix');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeProgress);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counter animation
                if (entry.target.classList.contains('hero-stats')) {
                    statNumbers.forEach(el => animateCounter(el));
                }
            }
        });
    }, observerOptions);

    // Add reveal class to elements
    document.querySelectorAll('.section-header, .work-card, .youtube-card, .contact-card, .skill-item, .about-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Also observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);

    // Video Modal
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');

    function openModal(videoSrc, title, desc) {
        modalVideo.src = videoSrc;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modalVideo.play().catch(() => {});
        }, 300);
    }

    function closeModal() {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Video Cards - Click to open modal
    document.querySelectorAll('.work-card').forEach(card => {
        const video = card.querySelector('video');
        const playBtn = card.querySelector('.play-btn');
        const title = card.querySelector('.work-title')?.textContent || 'Project';
        const desc = card.querySelector('.work-desc')?.textContent || '';

        if (video && playBtn) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });

            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(video.src, title, desc);
            });

            card.addEventListener('click', () => {
                openModal(video.src, title, desc);
            });
        }
    });

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            workCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Parallax Effect on Hero Shapes
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('.shape').forEach((shape, i) => {
            const speed = (i + 1) * 0.02;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // Magnetic Button Effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Tilt Effect on Work Cards
    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (y - 0.5) * -8;
            const rotateY = (x - 0.5) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Page Load Animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    console.log('%c Infinity Product Portfolio ', 'background: linear-gradient(135deg, #6c5ce7, #a855f7); color: white; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: bold;');
});
