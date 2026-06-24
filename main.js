document.addEventListener('DOMContentLoaded', () => {
  // 1. Page Transition Page-Out & Page-In
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition';
  document.body.appendChild(transitionOverlay);

  // Play Page-In transition on load
  setTimeout(() => {
    // Add active, then remove it shortly after
    document.body.style.overflow = 'hidden';
    transitionOverlay.style.transform = 'translateY(0)';
    
    // Smooth scroll to top on load
    window.scrollTo(0, 0);

    setTimeout(() => {
      transitionOverlay.style.transition = 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)';
      transitionOverlay.style.transform = 'translateY(-100%)';
      document.body.style.overflow = '';
    }, 100);
  }, 50);

  // Intercept nav links for custom page transitions
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
  links.forEach(link => {
    // Make sure it is an internal page
    const href = link.getAttribute('href');
    if (href && (href.endsWith('.html') || href === '/' || href.includes('index') || href.includes('about') || href.includes('services') || href.includes('contact'))) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset scroll position and toggle state before navigating
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuToggle.classList.remove('active');
        }

        // Slide the transition panel up
        transitionOverlay.style.transform = 'translateY(100%)';
        setTimeout(() => {
          transitionOverlay.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
          window.location.href = href;
        }, 550);
      });
    }
  });

  // 2. Header Scroll Effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Hamburger Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Prevent body scrolling when menu is active on mobile
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add delay if specified
          const delay = entry.target.getAttribute('data-delay');
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add('active');
            }, parseInt(delay));
          } else {
            entry.target.classList.add('active');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => element.classList.add('active'));
  }

  // 5. Accordion (FAQ) Interactions
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = '0';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // 6. Contact Form Submission (Submit to Google Form)
  const contactForm = document.getElementById('therapy-intake-form');
  const formFeedback = document.querySelector('.form-feedback');
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Visual feedback for sending
      submitBtn.textContent = 'Sending Details...';
      submitBtn.disabled = true;

      // Extract form data and convert to URLSearchParams (application/x-www-form-urlencoded)
      const formData = new FormData(contactForm);
      const searchParams = new URLSearchParams(formData);
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdIAH44cAG_58LJ0_2ho8Z0S39esZepC-PAtk0LFZEhrDjxBg/formResponse';
      
      // Submit using no-cors mode to bypass CORS restriction and record entry
      fetch(googleFormUrl, {
        method: 'POST',
        body: searchParams,
        mode: 'no-cors'
      })
      .then(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        formFeedback.style.display = 'block';
        formFeedback.style.borderColor = 'var(--accent-gold)';
        formFeedback.style.color = 'var(--accent-gold)';
        formFeedback.innerHTML = 'Thank you, Tritha has received your message. She will reach out within 24 hours to schedule your session.';
        
        // Scroll to feedback
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        formFeedback.style.display = 'block';
        formFeedback.style.borderColor = '#ff4d4d';
        formFeedback.style.color = '#ff4d4d';
        formFeedback.innerHTML = 'There was an error submitting your form. Please try again or reach out via direct email.';
        
        // Scroll to feedback
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }
});
