/* ==========================================
   TALHA FAREEDI - PORTFOLIO JS
   Interactive Features & Animations
   ========================================== */

(function () {
    'use strict';

    // ---- Particles Background ----
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: 0, y: 0 };
            this.resize();
            this.init();
            this.bindEvents();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
            this.particles = [];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.resize();
                this.init();
            });
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const isDark = document.body.classList.contains('dark');
            const baseColor = isDark ? '16, 185, 129' : '5, 150, 105';

            this.particles.forEach((p, i) => {
                // Mouse repulsion
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    p.vx -= dx * 0.00008;
                    p.vy -= dy * 0.00008;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${baseColor}, ${p.opacity})`;
                this.ctx.fill();

                // Draw connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (d < 120) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(${baseColor}, ${0.15 * (1 - d / 120)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ---- Custom Cursor ----
    function initCursor() {
        const dot = document.getElementById('cursor-dot');
        const outline = document.getElementById('cursor-outline');
        if (!dot || !outline || window.innerWidth <= 768) return;

        let mx = 0, my = 0;
        let ox = 0, oy = 0;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx - 4 + 'px';
            dot.style.top = my - 4 + 'px';
        });

        function animateOutline() {
            ox += (mx - ox) * 0.15;
            oy += (my - oy) * 0.15;
            outline.style.left = ox - 18 + 'px';
            outline.style.top = oy - 18 + 'px';
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effects on interactive elements
        document.querySelectorAll('a, button, .card-tags span, .project-card, .topic-card, .research-card, .edu-card, .contact-card').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
        });
    }

    // ---- Typewriter Effect ----
    function initTypewriter() {
        const el = document.getElementById('typewriter');
        if (!el) return;

        const texts = [
            'Machine Learning Engineer',
            'AI Researcher',
            'Deep Learning Specialist',
            'Computer Vision Expert',
            'Multi-Agent Systems Architect',
            'NLP & LLM Practitioner',
            'Reinforcement Learning Developer',
        ];

        let textIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typingSpeed = 60;
        const deletingSpeed = 30;
        const pauseAfterType = 2000;
        const pauseAfterDelete = 500;

        function type() {
            const current = texts[textIdx];

            if (isDeleting) {
                el.textContent = current.substring(0, charIdx - 1);
                charIdx--;
            } else {
                el.textContent = current.substring(0, charIdx + 1);
                charIdx++;
            }

            let delay = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIdx === current.length) {
                delay = pauseAfterType;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                textIdx = (textIdx + 1) % texts.length;
                delay = pauseAfterDelete;
            }

            setTimeout(type, delay);
        }

        type();
    }

    // ---- Counter Animation ----
    function initCounters() {
        const counters = document.querySelectorAll('.stat-value[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 40;
        const duration = 1500;
        const step = duration / 40;

        function update() {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            setTimeout(update, step);
        }
        update();
    }

    // ---- Scroll Reveal ----
    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                    entry.target.style.transitionDelay = delay;
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '-40px' });

        elements.forEach(el => observer.observe(el));
    }

    // ---- Skill Bars Animation ----
    function initSkillBars() {
        const bars = document.querySelectorAll('.skill-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(b => observer.observe(b));
    }

    // ---- Navigation ----
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const progress = document.getElementById('nav-progress');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        // Scroll effects
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPct = (scrollY / docHeight) * 100;

            // Navbar background
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Progress bar
            if (progress) {
                progress.style.width = scrollPct + '%';
            }

            // Active nav link
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const top = section.offsetTop - 100;
                const bottom = top + section.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.dataset.section === section.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            lastScroll = scrollY;
        });

        // Hamburger menu
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ---- Dark Mode Toggle ----
    function initTheme() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // ---- Back to Top ----
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Card Tilt Effect ----
    function initTiltEffect() {
        const cards = document.querySelectorAll('.topic-card, .research-card, .project-card, .edu-card');
        if (window.innerWidth <= 768) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ---- Smooth Scroll Progress with requestAnimationFrame ----
    function initSmoothScroll() {
        // Already handled in initNavigation
    }

    // ---- Initialize Everything ----
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleSystem(document.getElementById('particles-canvas'));
        initCursor();
        initTypewriter();
        initCounters();
        initScrollReveal();
        initSkillBars();
        initNavigation();
        initTheme();
        initBackToTop();
        initTiltEffect();
    });

})();
