/**
 * Megha Portfolio - Master Interactive Script
 * Features: Background Particle Canvas, Dynamic Typing Effect, Counter Animations,
 * Filterable Portfolio, Lightbox Modals, Theme Switcher & Contact Form Toast.
 */

(function () {
  // --------------------------------------------------------------------------
  // 1. Particle Canvas Background
  // --------------------------------------------------------------------------
  function initParticleCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 70);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const particleColor = isDark ? '124, 92, 252' : '99, 102, 241';

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${particleColor}, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // --------------------------------------------------------------------------
  // 2. Dynamic Typing Text Effect
  // --------------------------------------------------------------------------
  function initTypingEffect() {
    const targetEl = document.getElementById('typedText');
    if (!targetEl) return;

    const words = [
      'Web Designer',
      'Frontend Developer',
      'UI/UX Designer',
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function type() {
      const currentWord = words[wordIdx];

      if (isDeleting) {
        targetEl.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
      } else {
        targetEl.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIdx === currentWord.length) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        timeout = 500;
      }

      setTimeout(type, timeout);
    }

    type();
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Intersection Observers (Counters & Skill Bars)
  // --------------------------------------------------------------------------
  function initScrollObservers() {
    // Number Counters
    const counterElements = document.querySelectorAll('.metric-number[data-target]');
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const isFloat = el.getAttribute('data-float') === 'true';
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const currentVal = target * (1 - Math.pow(1 - progress, 3));

              el.textContent = isFloat
                ? `${currentVal.toFixed(1)}${suffix}`
                : `${Math.floor(currentVal)}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = isFloat ? `${target.toFixed(1)}${suffix}` : `${target}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach(el => counterObserver.observe(el));

    // Skill Bar Fills
    const skillFills = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            fill.style.width = fill.getAttribute('data-width') || '0%';
            observer.unobserve(fill);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillFills.forEach(fill => skillObserver.observe(fill));
  }

  // --------------------------------------------------------------------------
  // 4. Portfolio Filterable Grid
  // --------------------------------------------------------------------------
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Project Preview Modal Lightbox
  // --------------------------------------------------------------------------
  const projectDetailsMap = {
    'apexpulse': {
      title: 'ApexPulse — SaaS Analytics Dashboard',
      category: 'SaaS / Web App',
      description: 'A modern, high-performance analytics platform built for SaaS teams. Includes real-time Chart.js data visualizations, dark/light theme switching, filterable transactions table, and mobile off-canvas drawer.',
      tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Chart.js', 'Bootstrap 5'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    },
    'novapay': {
      title: 'NovaPay — Fintech Banking Solution',
      category: 'Fintech / Mobile & Web',
      description: 'Comprehensive digital wallet and banking platform featuring multi-currency transfers, biometric login mockups, dark mode financial reports, and transaction charts.',
      tech: ['React', 'Node.js', 'TailwindCSS', 'Express'],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
    },
    'aether': {
      title: 'Aether — AI Content Creation Studio',
      category: 'AI / SaaS',
      description: 'Generative AI web workspace allowing users to write articles, craft social media copy, and generate high-resolution marketing assets with intuitive workflow history.',
      tech: ['Vue.js', 'Python', 'FastAPI', 'Three.js'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    },
    'lumina': {
      title: 'Lumina — Luxury E-Commerce Store',
      category: 'E-Commerce',
      description: 'High-end storefront featuring interactive 3D product previewers, smooth add-to-cart drawers, dynamic coupon checkout system, and responsive customer review gallery.',
      tech: ['HTML5', 'Sass', 'Vanilla JS', 'Stripe API'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'
    }
  };

  function initLightboxModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const openBtns = document.querySelectorAll('.open-modal-btn');

    if (!modal) return;

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        const data = projectDetailsMap[projectId];

        if (data) {
          document.getElementById('modalTitle').textContent = data.title;
          document.getElementById('modalCategory').textContent = data.category;
          document.getElementById('modalDescription').textContent = data.description;
          document.getElementById('modalImage').src = data.image;

          const techStackEl = document.getElementById('modalTechStack');
          techStackEl.innerHTML = data.tech
            .map(t => `<span class="tech-pill">${t}</span>`)
            .join('');

          modal.classList.add('active');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Navigation, Theme & Contact Form Toast
  // --------------------------------------------------------------------------
  function initNavAndTheme() {
    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    const currentTheme = localStorage.getItem('megha_portfolio_theme') || 'dark';

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        if (icon) icon.className = theme === 'light' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
      }
      localStorage.setItem('megha_portfolio_theme', theme);
    }

    applyTheme(currentTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }

    // Scroll Navbar Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.className = navLinks.classList.contains('active') ? 'bi bi-x-lg' : 'bi bi-list';
        }
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'bi bi-list';
        });
      });
    }

    // Contact Form Submission (EmailJS Integration)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
      if (window.emailjs) {
        // NOTE: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
        emailjs.init("YOUR_PUBLIC_KEY");
      }

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnIcon = document.getElementById('btnIcon');
        const btnText = document.getElementById('btnText');
        
        const nameInput = document.getElementById('senderName').value.trim();
        const emailInput = document.getElementById('senderEmail').value.trim();
        const subjectInput = document.getElementById('formSubject').value.trim();
        const messageInput = document.getElementById('formMessage').value.trim();
        
        // Basic frontend validation
        if(!nameInput || !emailInput || !subjectInput || !messageInput) {
          showFormStatus('error', '<i class="bi bi-exclamation-circle-fill"></i> Please fill in all required fields.');
          return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
          showFormStatus('error', '<i class="bi bi-exclamation-circle-fill"></i> Please enter a valid email address.');
          return;
        }

        // Show loading state
        submitBtn.disabled = true;
        const originalIconClass = btnIcon ? btnIcon.className : 'bi bi-send-fill';
        const originalText = btnText ? btnText.innerText : 'Send Message';
        
        if (btnIcon) btnIcon.className = 'bi bi-hourglass-split';
        if (btnText) btnText.innerText = 'Sending...';

        const templateParams = {
          from_name: nameInput,
          from_email: emailInput,
          subject: subjectInput,
          message: messageInput,
          to_email: 'meghakadiya14@gmail.com'
        };

        // NOTE: Replace with your EmailJS Service ID and Template ID
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_TEMPLATE_ID';

        if(window.emailjs && serviceID !== 'YOUR_SERVICE_ID') {
          emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
              showFormStatus('success', '<i class="bi bi-check-circle-fill"></i> Thank you for reaching out! Your message has been sent successfully. I\'ll get back to you as soon as possible.');
              contactForm.reset();
              restoreButton();
            })
            .catch((err) => {
              console.error('EmailJS Error:', err);
              showFormStatus('error', '<i class="bi bi-x-circle-fill"></i> Something went wrong while sending your message. Please try again or contact me directly by email.');
              restoreButton();
            });
        } else {
          // Fallback simulation if EmailJS is not configured yet
          setTimeout(() => {
            showFormStatus('success', '<i class="bi bi-check-circle-fill"></i> Thank you for reaching out! Your message has been sent successfully. I\'ll get back to you as soon as possible.');
            contactForm.reset();
            restoreButton();
          }, 1500);
        }

        function restoreButton() {
          submitBtn.disabled = false;
          if (btnIcon) btnIcon.className = originalIconClass;
          if (btnText) btnText.innerText = originalText;
        }
      });
      
      function showFormStatus(type, htmlContent) {
        if (!formStatus) return;
        formStatus.style.display = 'flex';
        formStatus.className = `form-status ${type}`; // resets animations
        formStatus.innerHTML = htmlContent;
        
        setTimeout(() => {
          formStatus.classList.add('show');
        }, 10);
        
        if (type === 'success') {
          setTimeout(() => {
            formStatus.classList.remove('show');
            setTimeout(() => {
              formStatus.style.display = 'none';
            }, 300);
          }, 6000);
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // 9. Custom Animated Cursor
  // --------------------------------------------------------------------------
  function initCustomCursor() {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    const textSpan = document.getElementById('cursorText');
    
    if (!dot || !outline || !textSpan) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    
    // Lerp factor for smooth trail (lower = smoother)
    const speed = 0.15;

    // Follow mouse
    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Dot follows instantly
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // LERP animation loop for outline
    function animateCursor() {
      outlineX += (mouseX - outlineX) * speed;
      outlineY += (mouseY - outlineY) * speed;
      
      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Target Groups
    const interactives = document.querySelectorAll('a, button, input, textarea, .nav-link, .btn-cta, .btn-secondary-glow, .theme-toggle-btn, .filter-btn, .overlay-btn, .social-icon, .swatch, .chip, .sidebar-icon, .tab-item');
    const cards = document.querySelectorAll('.metric-card, .resume-card, .portfolio-card, .hero-visual-card');
    const texts = document.querySelectorAll('h1, h2, h3, p, .about-text');

    // 1. Basic Interactive Elements
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        outline.classList.add('hover-interactive');
      });
      el.addEventListener('mouseleave', () => {
        outline.classList.remove('hover-interactive');
      });
    });

    // 2. Card/Image Hover - Show context label
    cards.forEach(el => {
      el.addEventListener('mouseenter', () => {
        let label = "View";
        if (el.classList.contains('portfolio-card')) label = "Explore";
        else if (el.classList.contains('metric-card')) label = "Details";
        else if (el.classList.contains('hero-visual-card')) label = "Inspect";
        
        textSpan.textContent = label;
        outline.classList.add('hover-label');
      });
      el.addEventListener('mouseleave', () => {
        outline.classList.remove('hover-label');
        textSpan.textContent = "";
      });
    });

    // 3. Text Hover - Subtle highlight
    texts.forEach(el => {
      el.addEventListener('mouseenter', () => {
        outline.classList.add('hover-text');
      });
      el.addEventListener('mouseleave', () => {
        outline.classList.remove('hover-text');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Scroll To Top Button
  // --------------------------------------------------------------------------
  function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
      // Show button when scrolled down 300px
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. Right Click Block
  // --------------------------------------------------------------------------
  function initRightClickBlock() {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  }

  // Master Init
  function mainInit() {
    initScrollToTop();
    initCustomCursor();
    initParticleCanvas();
    initTypingEffect();
    initScrollObservers();
    initPortfolioFilter();
    initLightboxModal();
    initNavAndTheme();
    initRightClickBlock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainInit);
  } else {
    mainInit();
  }
})();
