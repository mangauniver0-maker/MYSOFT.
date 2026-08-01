document.addEventListener('DOMContentLoaded', () => {
  // 1. Loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 500);
    }, 1500);
  }

  // 2. Navbar & Floating buttons scroll effects
  const navbar = document.getElementById('navbar');
  const floatingBtn = document.getElementById('floating-btn');
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
      if (floatingBtn) floatingBtn.classList.add('visible');
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (floatingBtn) floatingBtn.classList.remove('visible');
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  });

  // 3. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          // eslint-disable-next-line no-undef
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 70, // offset for fixed navbar
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Intersection Observer for fade elements
  const fadeElements = document.querySelectorAll('.fade-element');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (index % 4) * 100); // Stagger effect
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // Add float & pulse to all img-placeholders after they exist
  document.querySelectorAll('.img-placeholder').forEach(el => {
    el.classList.add('pulse-glow-effect');
  });

  // 5. Animated Counters
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const increment = target / (duration / 16); // ~60fps
      
      let current = 0;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
    });
  };

  const statsSection = document.getElementById('stats-container');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // 6. Form Validation
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccessMessage');

  if (contactForm) {
    const honeyField = contactForm.querySelector('input[name="_honey"]');
    const countryCodeSelect = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phone');
    let submitStartTime = 0;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (honeyField && honeyField.value.trim() !== '') {
        successMsg.className = 'alert alert-danger mt-4';
        successMsg.textContent = 'Soumission bloquée.';
        successMsg.classList.remove('d-none');
        return;
      }

      const now = Date.now();
      if (submitStartTime && now - submitStartTime < 3000) {
        successMsg.className = 'alert alert-danger mt-4';
        successMsg.textContent = 'Veuillez patienter avant de soumettre à nouveau.';
        successMsg.classList.remove('d-none');
        return;
      }
      submitStartTime = now;
      
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
      } else {
        if (countryCodeSelect && phoneInput) {
          phoneInput.value = `${countryCodeSelect.value}${phoneInput.value.replace(/^\+243|^\+242/, '')}`;
        }
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';
        submitBtn.disabled = true;
        
        fetch(contactForm.action, {
          method: contactForm.method,
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Échec de l’envoi');
            }
            return response.json();
          })
          .then(() => {
            contactForm.classList.remove('was-validated');
            contactForm.reset();
            successMsg.classList.remove('d-none');
            successMsg.className = 'alert alert-success mt-4';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
              successMsg.classList.add('d-none');
            }, 5000);
          })
          .catch(() => {
            successMsg.className = 'alert alert-danger mt-4';
            successMsg.textContent = 'Une erreur est survenue lors de l’envoi. Veuillez réessayer plus tard.';
            successMsg.classList.remove('d-none');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          });
      }
    }, false);
  }

  // 7. Tilt effect for cards (Pure JS)
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
