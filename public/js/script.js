document.addEventListener('DOMContentLoaded', () => {
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

    // 2. Detailed Enquiry Form (enquiry.html)
    const detailedEnquiryForm = document.getElementById('detailed-enquiry-form');
    if (detailedEnquiryForm) {
        detailedEnquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = detailedEnquiryForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            btn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                duration: document.getElementById('duration').value,
                people: document.getElementById('people').value,
                tour: document.getElementById('tour')?.value || '',
                vehicle: document.getElementById('vehicle')?.value || '',
                accommodation: document.getElementById('accommodation')?.value || '',
                hotel: document.getElementById('hotel')?.value || '',
                notes: document.getElementById('notes')?.value || ''
            };

            try {
                const response = await fetch('/api/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    alert('Thank you! Your detailed enquiry has been received. Our experts will contact you soon.');
                    detailedEnquiryForm.reset();
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
});
