document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 2. Smooth Scroll (Fallback for older browsers, though CSS handles it mostly)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Ignore if href is just "#"
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Adjust for sticky header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Service Scope Toggle
    document.querySelectorAll('.btn-escopo').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                content.style.maxHeight = '0';
                btn.setAttribute('aria-expanded', 'false');
                btn.innerText = 'Ver escopo de ensaios ▾';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
                btn.innerText = 'Ocultar escopo ▴';
            }
        });
    });

    // 3. Simple Form Interaction Feedback (Visual enhancement)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'translateY(-2px)';
                input.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'none';
            });
        });
    }

    // 4. FAQ Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });

    // 5. Form Submit Handling
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formBody = document.getElementById('formBody');
            const formSuccess = document.getElementById('formSuccess');
            if(formBody && formSuccess) {
                formBody.style.display = 'none';
                formSuccess.style.display = 'block';
            }
        });
    }

    // 6. Intersection Observer for Fade-Up animations
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section:not(.hero):not(.credibilidade)').forEach(sec => {
        sec.classList.add('fade-up');
        fadeObserver.observe(sec);
    });

    // 7. Intersection Observer for Number Counters
    const animateValue = (obj, start, end, duration, prefix, suffix) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(easeProgress * (end - start) + start);
            
            const formatted = current.toLocaleString('pt-BR');
            obj.innerHTML = `${prefix}${formatted}${suffix}`;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = `${prefix}${end.toLocaleString('pt-BR')}${suffix}`;
            }
        };
        window.requestAnimationFrame(step);
    };

    const numObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.innerText.trim();
                const match = text.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
                if (match) {
                    const prefix = match[1];
                    const numStr = match[2].replace(/\./g, '');
                    const suffix = match[3];
                    const end = parseInt(numStr, 10);
                    if (!isNaN(end)) {
                        el.innerText = `${prefix}0${suffix}`;
                        animateValue(el, 0, end, 1500, prefix, suffix);
                    }
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.stat-number').forEach(num => {
        if (/\d/.test(num.innerText)) {
            numObserver.observe(num);
        }
    });
});
