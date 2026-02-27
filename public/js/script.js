document.addEventListener('DOMContentLoaded', () => {
    // Inject Google Translate Custom Switcher
    const navLinksList = document.querySelector('.nav-links');
    if (navLinksList) {
        const langLi = document.createElement('li');
        langLi.className = 'lang-switcher-container';
        langLi.innerHTML = `
            <div class="custom-lang-switcher">
                <a href="#" class="lang-btn" data-lang="en">EN</a>
                <span class="lang-divider">|</span>
                <a href="#" class="lang-btn" data-lang="de">GE</a>
            </div>
            <div id="google_translate_element" style="display:none;"></div>
        `;

        // Insert right before the enquiry button if it exists, otherwise at the end
        // Changing requirement: Add at the end (right side of Enquiry Button)
        navLinksList.appendChild(langLi);

        // Initialize Translate API
        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,de',
                autoDisplay: false
            }, 'google_translate_element');
        };

        const gtScript = document.createElement('script');
        gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(gtScript);

        // Handle Custom Switcher clicks
        const langBtns = langLi.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');

                // Set cookie for google translate
                document.cookie = `googtrans=/en/${lang}; path=/`;

                // Reload the page to apply translation
                location.reload();
            });
        });

        // Set active class based on current cookie
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
        const currentLang = match ? match[1] : 'en';
        const activeBtn = langLi.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // Typing Animation for Hero Section
    const typingTextElement = document.querySelector('.typing-text');
    const typingParagraphElement = document.querySelector('.typing-paragraph');

    if (typingTextElement && typingParagraphElement) {
        const textToType = "Discover the Ancient<br>Wonders of Maharashtra";
        const paragraphToType = "Experience the majestic Ajanta & Ellora caves, historical Aurangabad,<br>and the mysterious Lonar crater with premium guided tours.";

        let i = 0;
        let pIndex = 0;
        let isTag = false;
        let textResult = "";
        let pResult = "";

        function typeHeading() {
            if (i < textToType.length) {
                const char = textToType.charAt(i);

                if (char === '<') isTag = true;
                if (char === '>') isTag = false;

                textResult += char;
                typingTextElement.innerHTML = textResult;

                i++;
                if (isTag) {
                    typeHeading(); // Skip delay for HTML tags
                } else {
                    setTimeout(typeHeading, 50); // Speed of typing heading
                }
            } else {
                // Formatting is done, start typing paragraph
                setTimeout(typeParagraph, 500);
            }
        }

        function typeParagraph() {
            if (pIndex < paragraphToType.length) {
                const char = paragraphToType.charAt(pIndex);

                if (char === '<') isTag = true;
                if (char === '>') isTag = false;

                pResult += char;
                typingParagraphElement.innerHTML = pResult;

                pIndex++;
                if (isTag) {
                    typeParagraph();
                } else {
                    setTimeout(typeParagraph, 30); // Speed of typing paragraph
                }
            }
        }

        // Start animation shortly after load
        setTimeout(typeHeading, 800);
    }

    // Mobile navigation toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Scroll effect for Navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Hero Slider Animation
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }

    // Intersection Observer for scroll animations (fade in / slide up)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    // --- Form Submissions to Backend ---

    // 1. General Contact Form (contact.html)
    const contactForm = document.getElementById('enquiry-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone')?.value || '',
                service: document.getElementById('service')?.value || '',
                message: document.getElementById('message')?.value || ''
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    alert('Thank you! We have received your message and will get back to you shortly.');
                    contactForm.reset();
                } else {
                    alert('Something went wrong. Please try again later.');
                }
            } catch (err) {
                console.error(err);
                alert('Connection error. Please check your internet connection and try again.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // 2. Detailed Enquiry Form (enquiry.html) - Redirects to WhatsApp
    const detailedEnquiryForm = document.getElementById('detailed-enquiry-form');
    if (detailedEnquiryForm) {
        detailedEnquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = detailedEnquiryForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing WhatsApp...';
            btn.disabled = true;

            const data = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                duration: document.getElementById('duration').value,
                people: document.getElementById('people').value,
                tour: document.getElementById('tour')?.value || 'Not specified',
                vehicle: document.getElementById('vehicle')?.value || 'Not specified',
                accommodation: document.getElementById('accommodation')?.value || 'Not specified',
                hotel: document.getElementById('hotel')?.value || 'Not specified',
                notes: document.getElementById('notes')?.value || 'None'
            };

            // Format WhatsApp Message
            const message = `*New Detailed Enquiry Request*%0A%0A`
                + `*Name:* ${data.name}%0A`
                + `*Phone:* ${data.phone}%0A`
                + `*Email:* ${data.email}%0A%0A`
                + `*Journey Details:*%0A`
                + `- Date: ${data.date}%0A`
                + `- Duration: ${data.duration} Days%0A`
                + `- People: ${data.people}%0A`
                + `- Tour Option: ${data.tour}%0A%0A`
                + `*Requirements:*%0A`
                + `- Vehicle: ${data.vehicle}%0A`
                + `- Accommodation: ${data.accommodation}%0A`
                + `- Hotel Category: ${data.hotel}%0A%0A`
                + `*Notes/Special Requests:*%0A${data.notes}`;

            // Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/919595777723?text=${message}`;
            window.open(whatsappUrl, '_blank');

            // Reset Form and Button visually
            setTimeout(() => {
                detailedEnquiryForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }

    // 3. Guide Booking Form (guide-booking.html)
    const guideForm = document.getElementById('guide-booking-form');
    if (guideForm) {
        guideForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = guideForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting...';
            btn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                arrangement: document.getElementById('arrangement')?.value || '',
                language: document.getElementById('language')?.value || '',
                details: document.getElementById('details')?.value || ''
            };

            try {
                const response = await fetch('/api/guide-booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    alert('Thank you! Your guide booking request has been submitted successfully.');
                    guideForm.reset();
                } else {
                    alert('Something went wrong. Please try again later.');
                }
            } catch (err) {
                console.error(err);
                alert('Connection error. Please try again.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- Modal Logic & WhatsApp Form Submission ---
    const popupTriggers = document.querySelectorAll('.popup-trigger');
    const enquiryModal = document.getElementById('enquiryModal');
    const modalCloseBtn = document.querySelector('.modal-close');

    if (enquiryModal) {
        // Open modal when any popup-trigger is clicked
        popupTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                enquiryModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close modal when close button is clicked
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                enquiryModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close modal when clicking outside the modal content
        enquiryModal.addEventListener('click', (e) => {
            if (e.target === enquiryModal) {
                enquiryModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle popup enquiry form submission via WhatsApp
        const popupForm = document.getElementById('popup-enquiry-form');
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitBtn = popupForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
                submitBtn.disabled = true;

                const name = document.getElementById('modal-name').value;
                const phone = document.getElementById('modal-phone').value;
                const email = document.getElementById('modal-email').value;
                const tour = document.getElementById('modal-tour').value || 'Not specified';
                const duration = document.getElementById('modal-duration').value || 'Not specified';
                const people = document.getElementById('modal-people').value || 'Not specified';
                const hotel = document.getElementById('modal-hotel').value || 'Not specified';
                const vehicle = document.getElementById('modal-vehicle').value || 'Not specified';
                const travelDate = document.getElementById('modal-date').value || 'Not specified';
                const message = document.getElementById('modal-message').value || 'None';

                // Generate WhatsApp formatted message
                const rawMessage = `Hello, I am interested in:\n\n` +
                    `Name: ${name}\n` +
                    `Phone: ${phone}\n` +
                    `Email: ${email}\n` +
                    `Tour Option: ${tour}\n` +
                    `Duration: ${duration}\n` +
                    `People: ${people}\n` +
                    `Hotel Category: ${hotel}\n` +
                    `Vehicle: ${vehicle}\n` +
                    `Date: ${travelDate}\n` +
                    `Special Requirements: ${message}`;

                const encodedMessage = encodeURIComponent(rawMessage);
                const whatsappUrl = `https://wa.me/919595777723?text=${encodedMessage}`;

                // Open WhatsApp in new tab
                window.open(whatsappUrl, '_blank');

                // Reset form and UI
                setTimeout(() => {
                    popupForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    enquiryModal.classList.remove('active');
                    document.body.style.overflow = '';
                }, 1000);
            });
        }
    }
});
