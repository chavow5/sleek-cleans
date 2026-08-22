/**
 * Sleek Window Cleaning - Interactive Scripts
 * Handles mobile drawer, 3D flip cards, 3-step process tab switcher,
 * accordion toggles, and instant quote calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileNavBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileNavBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileMenu);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 2. Sticky Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Mobile Touch support for 3D Flip Cards
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking button inside back, don't just toggle
      if (e.target.closest('.btn-card-quote')) return;
      if (window.innerWidth <= 1024) {
        card.classList.toggle('is-flipped');
      }
    });
  });

  // 4. "3 Step Protection" Tab Switching
  const processTabs = document.querySelectorAll('.process-tab-btn');
  const stepNumEl = document.getElementById('processStepNum');
  const stepTitleEl = document.getElementById('processStepTitle');
  const stepDescEl = document.getElementById('processStepDesc');
  const stepImgEl = document.getElementById('processStepImg');

  const processData = {
    scrub: {
      step: "Step 01",
      title: "Scrub",
      desc: "We begin with a thorough pre-cleaning process, removing dirt, grime, and stubborn residue. Using professional-grade solutions and specialized scrubbing techniques, we ensure every inch of your window surface is perfectly prepared for the next step.",
      img: "assets/images/process/scrubbing-window-cleaning.webp",
      alt: "Scrubbing Window Cleaning"
    },
    squeegee: {
      step: "Step 02",
      title: "Squeegee",
      desc: "Our expert technicians employ precise squeegee techniques perfected over years of experience. With smooth, continuous strokes, we remove every drop of cleaning solution, leaving behind crystal-clear glass without streaks or water marks.",
      img: "assets/images/process/window-cleaning-services-2-scaled.webp",
      alt: "Squeegee Window Cleaning Technique"
    },
    detail: {
      step: "Step 03",
      title: "Detail",
      desc: "Perfection is in the details. We meticulously clean window frames, sills, and corners that others overlook. Every edge is polished and inspected, ensuring your windows look flawless from every angle and truly shine.",
      img: "assets/images/process/the-sleek-difference-683x1024.webp",
      alt: "Detailing Window Frames and Sills"
    }
  };

  processTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const stepKey = tab.getAttribute('data-step');
      if (!processData[stepKey]) return;

      processTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = processData[stepKey];
      stepNumEl.textContent = data.step;
      stepTitleEl.textContent = data.title;
      stepDescEl.textContent = data.desc;
      stepImgEl.src = data.img;
      stepImgEl.alt = data.alt;
    });
  });

  // 5. Accordion Dropdown
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 50 + "px";
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });

  // 6. Interactive Quote Modal & Dynamic Pricing Calculator
  const modalBackdrop = document.getElementById('quoteModalBackdrop');
  const quoteModalClose = document.getElementById('quoteModalClose');
  const openQuoteButtons = document.querySelectorAll('.btn-open-quote');
  const quoteForm = document.getElementById('quoteForm');
  const estimatePriceEl = document.getElementById('estimatePrice');
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
  const homeSizeSelect = document.getElementById('homeSizeSelect');
  const storyCountSelect = document.getElementById('storyCountSelect');

  function openQuoteModal(serviceName = null) {
    if (serviceName) {
      const s = serviceName.toLowerCase();
      serviceCheckboxes.forEach(cb => {
        const val = cb.value.toLowerCase();
        let match = false;
        if (s.includes('ext') && val === 'window_ext') match = true;
        else if (s.includes('int') && val === 'window_int') match = true;
        else if (s.includes('press') && val === 'pressure') match = true;
        else if (s.includes('roof') && val === 'roof') match = true;
        else if (s.includes('paver') && val === 'paver') match = true;
        else if (s.includes('solar') && val === 'solar') match = true;
        else if (s.includes('gutter') && val === 'gutter') match = true;

        if (match) {
          cb.checked = true;
          cb.closest('.service-checkbox-card').classList.add('selected');
        }
      });
    }
    calculateEstimate();
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuoteModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openQuoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service');
      openQuoteModal(service);
    });
  });

  if (quoteModalClose) quoteModalClose.addEventListener('click', closeQuoteModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeQuoteModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeQuoteModal();
    }
  });

  // Calculate dynamic quote estimate
  function calculateEstimate() {
    let base = 0;
    const baseRates = {
      window_ext: 120,
      window_int: 80,
      pressure: 150,
      roof: 250,
      paver: 220,
      solar: 140,
      gutter: 130
    };

    let selectedCount = 0;
    serviceCheckboxes.forEach(cb => {
      const card = cb.closest('.service-checkbox-card');
      if (cb.checked) {
        card.classList.add('selected');
        base += (baseRates[cb.value] || 100);
        selectedCount++;
      } else {
        card.classList.remove('selected');
      }
    });

    if (selectedCount === 0) {
      estimatePriceEl.textContent = '$0';
      return;
    }

    const sizeMultiplier = parseFloat(homeSizeSelect ? homeSizeSelect.value : 1.0) || 1.0;
    const storyMultiplier = parseFloat(storyCountSelect ? storyCountSelect.value : 1.0) || 1.0;

    // Bundle discount if 2 or more services
    const discount = selectedCount >= 3 ? 0.8 : (selectedCount === 2 ? 0.9 : 1.0);
    const total = Math.round(base * sizeMultiplier * storyMultiplier * discount);

    estimatePriceEl.textContent = `$${total} - $${Math.round(total * 1.25)}`;
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));
  if (homeSizeSelect) homeSizeSelect.addEventListener('change', calculateEstimate);
  if (storyCountSelect) storyCountSelect.addEventListener('change', calculateEstimate);

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = quoteForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span>Submitting...</span>`;
      btn.disabled = true;

      setTimeout(() => {
        alert('Thank you! Your quote request has been received. Our team will contact you within 15 minutes.');
        btn.innerHTML = originalText;
        btn.disabled = false;
        quoteForm.reset();
        closeQuoteModal();
      }, 1000);
    });
  }

  // 7. Update text on native HTML5 <details> owner response toggle
  document.querySelectorAll('.review-owner-details').forEach(details => {
    details.addEventListener('toggle', () => {
      const span = details.querySelector('summary span');
      if (span) {
        span.textContent = details.open ? 'Hide Owner Response' : 'View Owner Response';
      }
    });
  });

  // 8. Read More / Show Less Toggle on Reviews
  document.querySelectorAll('.btn-review-text-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const reviewText = btn.previousElementSibling;
      if (reviewText && reviewText.classList.contains('review-text')) {
        const isClamped = reviewText.classList.toggle('is-clamped');
        btn.textContent = isClamped ? 'Read more' : 'Show less';
        btn.setAttribute('aria-expanded', String(!isClamped));
      }
    });
  });

  // 9. Reviews Autoplay Looping Slider
  const track = document.getElementById('reviewsSliderTrack');
  const dotsContainer = document.getElementById('reviewsSliderDots');
  const btnPrev = document.getElementById('reviewsSliderPrev');
  const btnNext = document.getElementById('reviewsSliderNext');
  const wrapper = document.getElementById('reviewsSliderWrapper');

  if (track) {
    let currentIndex = 0;
    let autoplayTimer = null;

    function getCards() {
      return Array.from(track.children);
    }

    function getItemsPerPage() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      const cards = getCards();
      const itemsPerPage = getItemsPerPage();
      return Math.max(0, cards.length - itemsPerPage);
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();

      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `reviews-slider-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateSlider();
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const itemsPerPage = getItemsPerPage();
      const maxIndex = getMaxIndex();

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      // Calculate shift percentage
      const cardWidthPercent = 100 / itemsPerPage;
      const gapOffset = 24 * (currentIndex / itemsPerPage);
      track.style.transform = `translateX(calc(-${currentIndex * cardWidthPercent}% - ${gapOffset}px))`;

      // Update dots
      if (dotsContainer) {
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        currentIndex = 0; // Loop back to start
      } else {
        currentIndex++;
      }
      updateSlider();
    }

    function prevSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = maxIndex; // Loop back to end
      } else {
        currentIndex--;
      }
      updateSlider();
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetAutoplay();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetAutoplay();
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Touch gestures for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;

    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoplay);
      wrapper.addEventListener('mouseleave', startAutoplay);

      wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoplay();
      }, { passive: true });
    }

    // Keyboard navigation when interacting with slider
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && (document.activeElement.closest('.reviews-section') || document.activeElement.closest('.reviews-slider-container'))) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          resetAutoplay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          resetAutoplay();
        }
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createDots();
        updateSlider();
      }, 100);
    });

    createDots();
    updateSlider();
    startAutoplay();
  }

});




