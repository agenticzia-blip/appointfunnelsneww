document.addEventListener('DOMContentLoaded', () => {
    // Calculator elements
    const trafficInput = document.getElementById('traffic-size');
    const sitInput = document.getElementById('sit-rate');
    const closeInput = document.getElementById('close-rate');
    const dealInput = document.getElementById('deal-size');

    const trafficVal = document.getElementById('traffic-val');
    const sitVal = document.getElementById('sit-val');
    const closeVal = document.getElementById('close-val');
    const dealVal = document.getElementById('deal-val');

    const projRev = document.getElementById('proj-rev');
    const netRoi = document.getElementById('net-roi');

    function calculateDarkROI() {
        if (!trafficInput) return; // Prevent errors if not on page

        const traffic = parseInt(trafficInput.value);
        const sit = parseInt(sitInput.value) / 100;
        const close = parseInt(closeInput.value) / 100;
        const deal = parseInt(dealInput.value);

        // Update displays
        trafficVal.textContent = traffic.toLocaleString() + " leads";
        sitVal.textContent = Math.round(sit * 100) + "%";
        closeVal.textContent = Math.round(close * 100) + "%";
        dealVal.textContent = "$" + deal.toLocaleString();

        // Calculate ROI
        const bookedAppts = traffic * sit;
        const closedDeals = bookedAppts * close;
        const grossRev = closedDeals * deal;
        const fee = 2000;
        const finalNet = grossRev - fee;

        projRev.textContent = "$" + Math.round(grossRev).toLocaleString();
        netRoi.textContent = "$" + Math.round(finalNet).toLocaleString();
        
        if (finalNet < 0) {
            netRoi.style.color = "#ff4d4d"; // red if negative
        } else {
            netRoi.style.color = "var(--primary-blue)";
        }
    }

    if (trafficInput) {
        [trafficInput, sitInput, closeInput, dealInput].forEach(input => {
            input.addEventListener('input', calculateDarkROI);
        });
        calculateDarkROI(); // Initial calc
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Toggle Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.textContent = '+';
            } else {
                answer.style.display = 'block';
                icon.textContent = '-';
            }
        });
    });

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up, .fade-down, .fade-left, .fade-right');
    fadeElements.forEach(el => observer.observe(el));

    // 4. Number Counter Animation for Metrics
    const formatNumber = (num, hasK, hasM, hasPercent, hasPlus, isDollar) => {
        let displayStr = Math.floor(num).toString();
        if(hasM) displayStr += 'M';
        if(hasK) displayStr += 'K';
        if(hasPercent) displayStr += '%';
        if(hasPlus) displayStr += '+';
        if(isDollar) displayStr = '$' + displayStr;
        return displayStr;
    };

    const counterElements = document.querySelectorAll('.metric-card h3');
    const numberObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.innerText;
                if(text === "GUARANTEED") return;
                
                let isDollar = text.includes('$');
                let hasK = text.includes('K');
                let hasM = text.includes('M');
                let hasPlus = text.includes('+');
                let hasPercent = text.includes('%');
                
                let targetNum = parseInt(text.replace(/[^0-9]/g, ''));
                if(isNaN(targetNum)) return;

                let currentNum = 0;
                let duration = 2000; // 2 seconds
                let stepTime = 20;
                let steps = duration / stepTime;
                let increment = targetNum / steps;

                let timer = setInterval(() => {
                    currentNum += increment;
                    if (currentNum >= targetNum) {
                        currentNum = targetNum;
                        clearInterval(timer);
                    }
                    
                    el.innerText = formatNumber(currentNum, hasK, hasM, hasPercent, hasPlus, isDollar);
                }, stepTime);

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    counterElements.forEach(el => numberObserver.observe(el));

    // ==========================================
    // 5. Responsive Mobile Navigation & Hamburger Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Dynamically create the background overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    if (mobileToggle && navLinks) {
        // Toggle mobile drawer and hamburger animation
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent background page body scroll while menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking the backdrop overlay
        overlay.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when clicking nav links (important for smooth anchoring)
        const links = navLinks.querySelectorAll('a:not(.dropdown > a)');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Handle mobile dropdown toggle on click for the Services menu
        const dropdown = document.querySelector('.dropdown');
        const dropdownTrigger = document.querySelector('.dropdown > a');
        if (dropdownTrigger && dropdown) {
            dropdownTrigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Stop native link click/redirect
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });
        }
    }
});
