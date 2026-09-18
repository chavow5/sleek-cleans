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
  const windowPaneSelect = document.getElementById('windowPaneSelect');
  const solarPanelSelect = document.getElementById('solarPanelSelect');
  const windowPaneGroup = document.getElementById('windowPaneGroup');
  const solarPanelGroup = document.getElementById('solarPanelGroup');

  // Helper to safely set text content if element exists
  function setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

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
          const card = cb.closest('.service-checkbox-card');
          if (card) card.classList.add('selected');
        }
      });
    }
    updateDynamicFormGroups();
    calculateEstimate();
    if (modalBackdrop) modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuoteModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openQuoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const service = btn.getAttribute('data-service');
      if (modalBackdrop) {
        e.preventDefault();
        openQuoteModal(service);
      } else {
        // If modal backdrop is not present on subpage, allow default link or navigate to root quote section
        if (btn.getAttribute('href') === '#quote') {
          e.preventDefault();
          const depth = (window.location.pathname.split('/').length - 2);
          let rootPrefix = '';
          for (let i = 0; i < depth; i++) {
            rootPrefix += '../';
          }
          if (!rootPrefix) rootPrefix = './';
          window.location.href = rootPrefix + 'index.html#quote';
        }
      }
    });
  });

  if (quoteModalClose) quoteModalClose.addEventListener('click', closeQuoteModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeQuoteModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalBackdrop && modalBackdrop.classList.contains('open')) closeQuoteModal();
      if (printableModalBackdrop && printableModalBackdrop.classList.contains('open')) closePrintableModal();
    }
  });

  // Toggle visibility of specific service sub-selectors
  function updateDynamicFormGroups() {
    let hasWindowService = false;
    let hasSolarService = false;

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        if (cb.value === 'window_ext' || cb.value === 'window_int') hasWindowService = true;
        if (cb.value === 'solar') hasSolarService = true;
      }
    });

    if (windowPaneGroup) {
      windowPaneGroup.style.display = hasWindowService ? 'block' : 'none';
    }
    if (solarPanelGroup) {
      solarPanelGroup.style.display = hasSolarService ? 'block' : 'none';
    }
  }

  // Calculate dynamic quote estimate using client's exact pricing tables
  function calculateEstimate() {
    updateDynamicFormGroups();

    let minTotal = 0;
    let maxTotal = 0;
    let hasCustomPricing = false;
    let selectedCount = 0;

    const paneCount = parseInt(windowPaneSelect ? windowPaneSelect.value : '25', 10) || 25;
    const solarCount = solarPanelSelect ? solarPanelSelect.value : '10';
    const homeSize = homeSizeSelect ? homeSizeSelect.value : '1500_2500';
    const storyMultiplier = parseFloat(storyCountSelect ? storyCountSelect.value : '1.0') || 1.0;

    // 1. Exterior Windows Price Table
    const extWindowRates = { 25: 199, 40: 295, 60: 375, 80: 440, 100: 499 };
    // 2. Interior Windows Price Table
    const intWindowRates = { 25: 75, 40: 99, 60: 149, 80: 199, 100: 249 };

    // 3. Roof Soft Wash (No stories baseline)
    const roofRates = {
      'under_1000': { min: 500, max: 500 },
      '1500_2500': { min: 500, max: 700 },
      '2500_3500': { min: 700, max: 999 },
      '3500_4500': { min: 999, max: 1400 },
      '5000_plus': { min: 1400, max: 1800 }
    };

    // 4. Paver Sealing (No stories baseline)
    const paverRates = {
      'under_1000': { min: 1099, max: 1099 },
      '1500_2500': { min: 1650, max: 2750 },
      '2500_3500': { min: 2750, max: 3850 },
      '3500_4500': { min: 3850, max: 4950 },
      '5000_plus': { custom: true }
    };

    // 5. Pressure Washing (No stories baseline)
    const pressureRates = {
      'under_1000': { min: 175, max: 275 },
      '1500_2500': { min: 375, max: 499 },
      '2500_3500': { min: 499, max: 699 },
      '3500_4500': { min: 699, max: 899 },
      '5000_plus': { custom: true }
    };

    // 6. Solar Panel Cleaning
    const solarRates = {
      '10': { min: 179, max: 179 },
      '20': { min: 179, max: 349 },
      '30': { min: 349, max: 480 },
      '40': { min: 480, max: 599 },
      '40_plus': { custom: true }
    };

    // 7. Gutter Cleaning
    const gutterBase = 149;

    serviceCheckboxes.forEach(cb => {
      const card = cb.closest('.service-checkbox-card');
      if (cb.checked) {
        if (card) card.classList.add('selected');
        selectedCount++;

        switch (cb.value) {
          case 'window_ext':
            const extP = extWindowRates[paneCount] || 199;
            minTotal += extP;
            maxTotal += extP;
            break;
          case 'window_int':
            const intP = intWindowRates[paneCount] || 75;
            minTotal += intP;
            maxTotal += intP;
            break;
          case 'roof':
            const r = roofRates[homeSize] || { min: 500, max: 700 };
            minTotal += r.min;
            maxTotal += r.max;
            break;
          case 'paver':
            const pv = paverRates[homeSize] || { min: 1650, max: 2750 };
            if (pv.custom) hasCustomPricing = true;
            else { minTotal += pv.min; maxTotal += pv.max; }
            break;
          case 'pressure':
            const pr = pressureRates[homeSize] || { min: 375, max: 499 };
            if (pr.custom) hasCustomPricing = true;
            else { minTotal += pr.min; maxTotal += pr.max; }
            break;
          case 'solar':
            const sl = solarRates[solarCount] || { min: 179, max: 179 };
            if (sl.custom) hasCustomPricing = true;
            else { minTotal += sl.min; maxTotal += sl.max; }
            break;
          case 'gutter':
            minTotal += gutterBase;
            maxTotal += gutterBase;
            break;
        }
      } else {
        if (card) card.classList.remove('selected');
      }
    });

    if (selectedCount === 0) {
      if (estimatePriceEl) estimatePriceEl.textContent = '$0';
      return;
    }

    // Apply story multiplier adjustment for multi-story buildings
    if (storyMultiplier > 1.0) {
      minTotal = Math.round(minTotal * (1 + (storyMultiplier - 1) * 0.25));
      maxTotal = Math.round(maxTotal * storyMultiplier);
    }

    // Apply bundle discount if 2 or more services selected
    const bundleDiscount = selectedCount >= 3 ? 0.85 : (selectedCount === 2 ? 0.90 : 1.0);
    minTotal = Math.round(minTotal * bundleDiscount);
    maxTotal = Math.round(maxTotal * bundleDiscount);

    if (estimatePriceEl) {
      if (hasCustomPricing) {
        estimatePriceEl.textContent = `$${minTotal}+ (Custom Pricing Required)`;
      } else if (minTotal === maxTotal) {
        estimatePriceEl.textContent = `$${minTotal}`;
      } else {
        estimatePriceEl.textContent = `$${minTotal} - $${maxTotal}`;
      }
    }
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));
  if (homeSizeSelect) homeSizeSelect.addEventListener('change', calculateEstimate);
  if (storyCountSelect) storyCountSelect.addEventListener('change', calculateEstimate);
  if (windowPaneSelect) windowPaneSelect.addEventListener('change', calculateEstimate);
  if (solarPanelSelect) solarPanelSelect.addEventListener('change', calculateEstimate);

  const printableModalBackdrop = document.getElementById('printableEstimateModalBackdrop');
  const closePrintableModalBtn = document.getElementById('closePrintableModal');
  const triggerPrintBtn = document.getElementById('triggerPrintBtn');
  const triggerDownloadPdfBtn = document.getElementById('triggerDownloadPdfBtn');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  let latestQuoteData = null;

  function closePrintableModal() {
    if (printableModalBackdrop) {
      printableModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closePrintableModalBtn) closePrintableModalBtn.addEventListener('click', closePrintableModal);
  if (triggerPrintBtn) {
    triggerPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }
  if (printableModalBackdrop) {
    printableModalBackdrop.addEventListener('click', (e) => {
      if (e.target === printableModalBackdrop) closePrintableModal();
    });
  }

  async function downloadEstimatePdf(quoteId) {
    const element = document.getElementById('printableEstimateSheet');
    if (!element) {
      window.print();
      return;
    }
    const cleanId = (quoteId || 'Estimate').replace(/[^a-zA-Z0-9_-]/g, '');
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `Sleek_Clean_Estimate_${cleanId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1.8, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  }

  function buildWhatsAppMessage(q) {
    if (!q) return 'Hello! I would like to request an estimate with Sleek Clean.';
    let msg = `✨ *NEW ESTIMATE REQUEST - SLEEK CLEAN™*\n\n`;
    msg += `📋 *Quote ID:* ${q.quoteId}\n`;
    msg += `📅 *Date:* ${q.issueDate}\n\n`;
    msg += `👤 *Customer Details:*\n`;
    msg += `• *Name:* ${q.customerName}\n`;
    msg += `• *Phone:* ${q.customerPhone}\n`;
    if (q.customerEmail && q.customerEmail !== 'Not provided') {
      msg += `• *Email:* ${q.customerEmail}\n`;
    }
    msg += `• *Service Address:* ${q.customerAddress}\n\n`;
    msg += `🏡 *Property Specifications:*\n`;
    msg += `• *Home Size:* ${q.homeSize}\n`;
    msg += `• *Stories:* ${q.stories}\n`;
    if (q.panes && q.panes !== 'N/A') msg += `• *Window Panes:* ${q.panes}\n`;
    if (q.panels && q.panels !== 'N/A') msg += `• *Solar Panels:* ${q.panels}\n`;
    msg += `\n🛠️ *Selected Services:*\n`;
    if (Array.isArray(q.services) && q.services.length > 0) {
      q.services.forEach(s => {
        msg += `• *${s.title}:* ${s.price} (${s.scope})\n`;
      });
    } else if (q.servicesText) {
      msg += `${q.servicesText}\n`;
    }
    msg += `\n💰 *Total Estimated Investment:* ${q.totalAmount}\n`;
    msg += `⏱️ *Estimated Duration:* ${q.duration}\n\n`;
    msg += `📄 *PDF Estimate:* Prepared and downloaded.\n\n`;
    msg += `Hello Sleek Clean! I just generated this estimate on your website and would like to confirm and schedule my service.`;
    return msg;
  }

  if (triggerDownloadPdfBtn) {
    triggerDownloadPdfBtn.addEventListener('click', async () => {
      const origHtml = triggerDownloadPdfBtn.innerHTML;
      triggerDownloadPdfBtn.innerHTML = `<span>Downloading...</span>`;
      triggerDownloadPdfBtn.disabled = true;
      try {
        if (!latestQuoteData && typeof generatePrintableEstimate === 'function') {
          latestQuoteData = generatePrintableEstimate();
        }
        await downloadEstimatePdf(latestQuoteData?.quoteId);
      } finally {
        triggerDownloadPdfBtn.innerHTML = origHtml;
        triggerDownloadPdfBtn.disabled = false;
      }
    });
  }

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', async () => {
      const origHtml = sendWhatsAppBtn.innerHTML;
      sendWhatsAppBtn.innerHTML = `<span>Opening WhatsApp...</span>`;
      sendWhatsAppBtn.disabled = true;
      try {
        if (!latestQuoteData && typeof generatePrintableEstimate === 'function') {
          latestQuoteData = generatePrintableEstimate();
        }
        await downloadEstimatePdf(latestQuoteData?.quoteId);
        const msg = buildWhatsAppMessage(latestQuoteData);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=17272699002&text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
      } finally {
        sendWhatsAppBtn.innerHTML = origHtml;
        sendWhatsAppBtn.disabled = false;
      }
    });
  }

  function getReadableHomeSize(val) {
    const map = {
      'under_1000': 'Under 1,000 sq ft',
      '1500_2500': '1,500 - 2,500 sq ft',
      '2500_3500': '2,500 - 3,500 sq ft',
      '3500_4500': '3,500 - 4,500 sq ft',
      '5000_plus': '5,000+ sq ft'
    };
    return map[val] || 'Standard';
  }

  function getReadableStories(val) {
    if (val === '1.25') return '2 Stories';
    if (val === '1.5') return '3 Stories';
    return '1 Story';
  }

  // 6.1 Conditional Email Field Handling

  const sendEmailCopyCheckbox = document.getElementById('sendEmailCopy');
  const quoteEmailInput = document.getElementById('quoteEmail');
  const emailRequiredAsterisk = document.getElementById('emailRequiredAsterisk');

  if (sendEmailCopyCheckbox && quoteEmailInput) {
    sendEmailCopyCheckbox.addEventListener('change', () => {
      if (sendEmailCopyCheckbox.checked) {
        quoteEmailInput.required = true;
        if (emailRequiredAsterisk) emailRequiredAsterisk.style.display = 'inline';
      } else {
        quoteEmailInput.required = false;
        if (emailRequiredAsterisk) emailRequiredAsterisk.style.display = 'none';
      }
    });
  }

  function generatePrintableEstimate() {
    const quoteName = document.getElementById('quoteName')?.value || 'Valued Customer';
    const quotePhone = document.getElementById('quotePhone')?.value || 'Not provided';
    const quoteEmail = document.getElementById('quoteEmail')?.value || 'Not provided';
    const quoteAddress = document.getElementById('quoteAddress')?.value || 'Tampa Bay Area, FL';

    const paneCount = parseInt(windowPaneSelect ? windowPaneSelect.value : '25', 10) || 25;
    const solarCount = solarPanelSelect ? solarPanelSelect.value : '10';
    const homeSize = homeSizeSelect ? homeSizeSelect.value : '1500_2500';
    const storyVal = storyCountSelect ? storyCountSelect.value : '1.0';
    const storyMultiplier = parseFloat(storyVal) || 1.0;

    // Set Customer & Meta Info safely
    setElText('printCustomerName', quoteName);
    setElText('printCustomerPhone', quotePhone);
    setElText('printCustomerEmail', quoteEmail);
    setElText('printCustomerAddress', quoteAddress);

    const randomId = Math.floor(1000 + Math.random() * 9000);
    setElText('printQuoteId', `#SLK-2026-${randomId}`);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setElText('printIssueDate', dateStr);

    setElText('printHomeSize', getReadableHomeSize(homeSize));
    setElText('printStories', getReadableStories(storyVal));

    let hasExtIntWin = false;
    let hasSolar = false;

    // Rate tables for itemized listing
    const extWindowRates = { 25: 199, 40: 295, 60: 375, 80: 440, 100: 499 };
    const intWindowRates = { 25: 75, 40: 99, 60: 149, 80: 199, 100: 249 };

    const roofRates = {
      'under_1000': { min: 500, max: 500 },
      '1500_2500': { min: 500, max: 700 },
      '2500_3500': { min: 700, max: 999 },
      '3500_4500': { min: 999, max: 1400 },
      '5000_plus': { min: 1400, max: 1800 }
    };

    const paverRates = {
      'under_1000': { min: 1099, max: 1099 },
      '1500_2500': { min: 1650, max: 2750 },
      '2500_3500': { min: 2750, max: 3850 },
      '3500_4500': { min: 3850, max: 4950 },
      '5000_plus': { custom: true }
    };

    const pressureRates = {
      'under_1000': { min: 175, max: 275 },
      '1500_2500': { min: 375, max: 499 },
      '2500_3500': { min: 499, max: 699 },
      '3500_4500': { min: 699, max: 899 },
      '5000_plus': { custom: true }
    };

    const solarRates = {
      '10': { min: 179, max: 179 },
      '20': { min: 179, max: 349 },
      '30': { min: 349, max: 480 },
      '40': { min: 480, max: 599 },
      '40_plus': { custom: true }
    };

    let minTotal = 0;
    let maxTotal = 0;
    let hasCustomPricing = false;
    let selectedCount = 0;

    let estMinHours = 0.5;
    let estMaxHours = 1.0;

    const tbody = document.getElementById('printServicesTbody');
    if (tbody) tbody.innerHTML = '';
    const servicesList = [];

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        selectedCount++;
        let serviceTitle = '';
        let scopeDesc = '';
        let priceStr = '';

        switch (cb.value) {
          case 'window_ext':
            hasExtIntWin = true;
            serviceTitle = 'Exterior Window Cleaning';
            scopeDesc = `Pure-water streak-free exterior wash up to ${paneCount} panes`;
            const extP = extWindowRates[paneCount] || 199;
            priceStr = `$${extP}`;
            minTotal += extP;
            maxTotal += extP;
            estMinHours += (paneCount / 40);
            estMaxHours += (paneCount / 25);
            break;
          case 'window_int':
            hasExtIntWin = true;
            serviceTitle = 'Interior Window Cleaning';
            scopeDesc = `Hand-scrubbed & detailed interior glass up to ${paneCount} panes`;
            const intP = intWindowRates[paneCount] || 75;
            priceStr = `$${intP}`;
            minTotal += intP;
            maxTotal += intP;
            estMinHours += 0.5;
            estMaxHours += 1.0;
            break;
          case 'roof':
            serviceTitle = 'Roof Soft Wash';
            scopeDesc = `Low-pressure chemical treatment removing moss & dark algae (${getReadableHomeSize(homeSize)})`;
            const r = roofRates[homeSize] || { min: 500, max: 700 };
            priceStr = r.min === r.max ? `$${r.min}` : `$${r.min} - $${r.max}`;
            minTotal += r.min;
            maxTotal += r.max;
            estMinHours += 1.5;
            estMaxHours += 2.5;
            break;
          case 'paver':
            serviceTitle = 'Paver Sealing';
            scopeDesc = `Deep clean, joint sand lock & premium sealant application (${getReadableHomeSize(homeSize)})`;
            const pv = paverRates[homeSize] || { min: 1650, max: 2750 };
            if (pv.custom) {
              priceStr = 'Custom Pricing';
              hasCustomPricing = true;
            } else {
              priceStr = `$${pv.min} - $${pv.max}`;
              minTotal += pv.min;
              maxTotal += pv.max;
            }
            estMinHours += 2.0;
            estMaxHours += 4.0;
            break;
          case 'pressure':
            serviceTitle = 'Pressure Washing';
            scopeDesc = `Commercial rotary surface wash for driveways, pool decks & walkways (${getReadableHomeSize(homeSize)})`;
            const pr = pressureRates[homeSize] || { min: 375, max: 499 };
            if (pr.custom) {
              priceStr = 'Custom Pricing';
              hasCustomPricing = true;
            } else {
              priceStr = `$${pr.min} - $${pr.max}`;
              minTotal += pr.min;
              maxTotal += pr.max;
            }
            estMinHours += 1.0;
            estMaxHours += 2.0;
            break;
          case 'solar':
            hasSolar = true;
            serviceTitle = 'Solar Panel Cleaning';
            scopeDesc = `Deionized water solar array efficiency wash (${solarCount === '40_plus' ? '40+ panels' : 'Up to ' + solarCount + ' panels'})`;
            const sl = solarRates[solarCount] || { min: 179, max: 179 };
            if (sl.custom) {
              priceStr = 'Custom Pricing';
              hasCustomPricing = true;
            } else {
              priceStr = sl.min === sl.max ? `$${sl.min}` : `$${sl.min} - $${sl.max}`;
              minTotal += sl.min;
              maxTotal += sl.max;
            }
            estMinHours += 0.5;
            estMaxHours += 1.2;
            break;
          case 'gutter':
            serviceTitle = 'Gutter Cleaning';
            scopeDesc = 'Complete debris removal, downspout flush & flow check';
            priceStr = 'Starting at $149';
            minTotal += 149;
            maxTotal += 149;
            estMinHours += 0.75;
            estMaxHours += 1.25;
            break;
        }

        servicesList.push({
          title: serviceTitle,
          scope: scopeDesc,
          price: priceStr
        });

        if (tbody) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${serviceTitle}</strong></td>
            <td style="color: #64748b; font-size: 0.85rem;">${scopeDesc}</td>
            <td style="text-align: right; font-weight: 700; color: #0284c7;">${priceStr}</td>
          `;
          tbody.appendChild(tr);
        }
      }
    });

    setElText('printPanes', hasExtIntWin ? `Up to ${paneCount} panes` : 'N/A');
    setElText('printPanels', hasSolar ? (solarCount === '40_plus' ? '40+ panels' : `Up to ${solarCount} panels`) : 'N/A');

    // Multi-story time adjustment
    if (storyMultiplier > 1.0) {
      estMinHours += (storyMultiplier - 1.0) * 0.75;
      estMaxHours += (storyMultiplier - 1.0) * 1.25;
      minTotal = Math.round(minTotal * (1 + (storyMultiplier - 1) * 0.25));
      maxTotal = Math.round(maxTotal * storyMultiplier);
    }

    // Bundle discount adjustment
    const bundleDiscount = selectedCount >= 3 ? 0.85 : (selectedCount === 2 ? 0.90 : 1.0);
    minTotal = Math.round(minTotal * bundleDiscount);
    maxTotal = Math.round(maxTotal * bundleDiscount);

    // Format Estimated Duration Pill
    const roundedMin = Math.max(1, Math.round(estMinHours * 2) / 2);
    const roundedMax = Math.max(roundedMin + 0.5, Math.round(estMaxHours * 2) / 2);
    setElText('printEstimatedDuration', `${roundedMin} - ${roundedMax} Hours`);

    // Total Amount Display
    let totalText = '$0';
    if (hasCustomPricing) {
      totalText = `$${minTotal}+ (Custom)`;
    } else if (minTotal === maxTotal) {
      totalText = `$${minTotal}`;
    } else {
      totalText = `$${minTotal} - $${maxTotal}`;
    }
    setElText('printTotalAmount', totalText);

    latestQuoteData = {
      quoteId: `#SLK-2026-${randomId}`,
      issueDate: dateStr,
      customerName: quoteName,
      customerPhone: quotePhone,
      customerEmail: quoteEmail,
      customerAddress: quoteAddress,
      homeSize: getReadableHomeSize(homeSize),
      stories: getReadableStories(storyVal),
      panes: hasExtIntWin ? `Up to ${paneCount} panes` : 'N/A',
      panels: hasSolar ? (solarCount === '40_plus' ? '40+ panels' : `Up to ${solarCount} panels`) : 'N/A',
      services: servicesList,
      servicesText: servicesList.map(s => `• ${s.title} (${s.scope}): ${s.price}`).join('\n'),
      duration: `${roundedMin} - ${roundedMax} Hours`,
      totalAmount: totalText
    };

    return latestQuoteData;
  }

  // 6.2 Client-side PDF Generation via html2pdf.js
  async function generatePdfBase64(quoteId) {
    if (typeof html2pdf === 'undefined') {
      console.warn('html2pdf library is not loaded.');
      return null;
    }
    const element = document.getElementById('printableEstimateSheet');
    if (!element) return null;

    try {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `Estimate_${quoteId.replace('#', '')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 1.8, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfDataUri = await html2pdf().set(opt).from(element).outputPdf('datauristring');
      if (pdfDataUri && pdfDataUri.includes('base64,')) {
        return pdfDataUri.split('base64,')[1];
      }
      return null;
    } catch (err) {
      console.warn('PDF generation encountered an issue:', err);
      return null;
    }
  }

  // 6.3 Send Estimate & PDF via Vercel Serverless Function (/api/send-estimate)
  async function sendEstimateEmail(quoteData, pdfBase64) {
    try {
      const response = await fetch('/api/send-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...quoteData,
          pdfBase64: pdfBase64 || null
        })
      });

      if (!response.ok) {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
        if (isLocal && (response.status === 404 || response.status === 405)) {
          console.info('Running on a local static server (Live Server cannot execute serverless POST functions). Deploy to Vercel to test live emails.');
          return { success: false, reason: 'local_environment' };
        }
        return { success: false, reason: 'http_error', status: response.status };
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Could not connect to /api/send-estimate:', err);
      return { success: false, reason: 'network_error', error: err };
    }
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = quoteForm.querySelector('button[type="submit"]');
      const originalBtnHTML = btn ? btn.innerHTML : '';
      const shouldSendEmail = sendEmailCopyCheckbox ? sendEmailCopyCheckbox.checked : false;
      const customerEmail = quoteEmailInput ? quoteEmailInput.value.trim() : '';

      if (btn) {
        btn.innerHTML = shouldSendEmail
          ? `<span>Generating PDF &amp; Sending Estimate...</span>`
          : `<span>Preparing Estimate Sheet...</span>`;
        btn.disabled = true;
      }

      // 1. Generate estimate data & render printable sheet DOM
      const quoteData = generatePrintableEstimate();

      const alertBox = document.getElementById('estimateEmailAlert');
      const alertText = document.getElementById('estimateEmailAlertText');
      const subtext = document.getElementById('printModalSubtext');

      if (shouldSendEmail && customerEmail) {
        // 2. Generate PDF Base64
        const pdfBase64 = await generatePdfBase64(quoteData.quoteId);

        // 3. Send email with PDF attached via Vercel serverless function
        const sendResult = await sendEstimateEmail(quoteData, pdfBase64);

        if (alertBox && alertText) {
          alertBox.style.display = 'flex';
          if (sendResult.success) {
            alertBox.style.backgroundColor = '#ecfdf5';
            alertBox.style.borderBottomColor = '#a7f3d0';
            alertBox.style.color = '#065f46';
            alertText.textContent = `A copy of this estimate and your PDF have been sent to ${customerEmail}.`;
            if (subtext) subtext.textContent = `A copy was sent to ${customerEmail}. You can also print or save as PDF below.`;
          } else if (sendResult.reason === 'not_configured') {
            alertBox.style.backgroundColor = '#fef3c7';
            alertBox.style.borderBottomColor = '#fde68a';
            alertBox.style.color = '#92400e';
            alertText.textContent = `Estimate & PDF ready! Note: Set RESEND_API_KEY in Vercel to activate automated emailing.`;
            if (subtext) subtext.textContent = `You can print or save this estimate summary as a PDF.`;
          } else if (sendResult.reason === 'local_environment') {
            alertBox.style.backgroundColor = '#f0fdf4';
            alertBox.style.borderBottomColor = '#bbf7d0';
            alertBox.style.color = '#166534';
            alertText.textContent = `Estimate & PDF generated! (Deploy to Vercel to test live automated email sending)`;
            if (subtext) subtext.textContent = `You can print or save this estimate summary as a PDF.`;
          } else {
            alertBox.style.backgroundColor = '#fef2f2';
            alertBox.style.borderBottomColor = '#fecaca';
            alertBox.style.color = '#991b1b';
            alertText.textContent = `Estimate ready! We couldn't send the email copy right now, but your estimate summary is ready below.`;
            if (subtext) subtext.textContent = `You can print or save this estimate summary as a PDF.`;
          }
        }
      } else {
        if (alertBox) alertBox.style.display = 'none';
        if (subtext) subtext.textContent = `You can print or save this estimate summary as a PDF.`;
      }

      if (btn) {
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;
      }

      closeQuoteModal();
      if (printableModalBackdrop) {
        printableModalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
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

  // ==========================================================================
  // 9. CHRISTMAS LIGHT INSTALLATION & HOLIDAY QUOTE SYSTEM
  // ==========================================================================

  // 9.1 Real-Time Countdown Timer to December 1st
  function initHolidayCountdown() {
    const daysEl = document.getElementById('holidayDays');
    const hoursEl = document.getElementById('holidayHours');
    const minutesEl = document.getElementById('holidayMinutes');
    const secondsEl = document.getElementById('holidaySeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateTimer() {
      const now = new Date();
      let targetYear = now.getFullYear();
      // Target is December 1st, 23:59:59
      let targetDate = new Date(targetYear, 11, 1, 23, 59, 59);

      // If current date has passed Dec 1st, count down to next year's Dec 1st
      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(targetYear + 1, 11, 1, 23, 59, 59);
      }

      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
  initHolidayCountdown();

  // 9.2 Christmas Quote Modal Open & Close Handlers
  const christmasModalBackdrop = document.getElementById('christmasQuoteModalBackdrop');
  const christmasModalCloseBtn = document.getElementById('christmasQuoteModalClose');
  const openChristmasModalBtns = document.querySelectorAll('.btn-open-christmas-quote');

  function openChristmasModal() {
    if (christmasModalBackdrop) {
      christmasModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeChristmasModal() {
    if (christmasModalBackdrop) {
      christmasModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openChristmasModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openChristmasModal();
  }));

  if (christmasModalCloseBtn) {
    christmasModalCloseBtn.addEventListener('click', closeChristmasModal);
  }

  if (christmasModalBackdrop) {
    christmasModalBackdrop.addEventListener('click', (e) => {
      if (e.target === christmasModalBackdrop) closeChristmasModal();
    });
  }

  // 9.3 Christmas Printable Estimate Sheet Modal Handlers
  const printableChristmasModalBackdrop = document.getElementById('printableChristmasEstimateModalBackdrop');
  const closePrintableChristmasModalBtn = document.getElementById('closePrintableChristmasModal');
  const triggerDownloadChristmasPdfBtn = document.getElementById('triggerDownloadChristmasPdfBtn');
  const triggerPrintChristmasBtn = document.getElementById('triggerPrintChristmasBtn');
  const sendChristmasWhatsAppBtn = document.getElementById('sendChristmasWhatsAppBtn');
  let latestChristmasQuoteData = null;

  function closePrintableChristmasModal() {
    if (printableChristmasModalBackdrop) {
      printableChristmasModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closePrintableChristmasModalBtn) {
    closePrintableChristmasModalBtn.addEventListener('click', closePrintableChristmasModal);
  }

  if (printableChristmasModalBackdrop) {
    printableChristmasModalBackdrop.addEventListener('click', (e) => {
      if (e.target === printableChristmasModalBackdrop) closePrintableChristmasModal();
    });
  }

  if (triggerPrintChristmasBtn) {
    triggerPrintChristmasBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 9.4 Christmas PDF Generator via html2pdf.js
  async function downloadChristmasPdf(quoteId) {
    const element = document.getElementById('printableChristmasEstimateSheet');
    if (!element) {
      window.print();
      return;
    }
    const cleanId = (quoteId || 'Holiday_Estimate').replace(/[^a-zA-Z0-9_-]/g, '');
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `Sleek_Holiday_Lights_Estimate_${cleanId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1.8, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  }

  async function generateChristmasPdfBase64(quoteId) {
    if (typeof html2pdf === 'undefined') return null;
    const element = document.getElementById('printableChristmasEstimateSheet');
    if (!element) return null;

    try {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `Sleek_Holiday_Lights_Estimate_${quoteId.replace('#', '')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 1.8, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      const pdfDataUri = await html2pdf().set(opt).from(element).outputPdf('datauristring');
      if (pdfDataUri && pdfDataUri.includes('base64,')) {
        return pdfDataUri.split('base64,')[1];
      }
      return null;
    } catch (err) {
      console.warn('Christmas PDF generation warning:', err);
      return null;
    }
  }

  if (triggerDownloadChristmasPdfBtn) {
    triggerDownloadChristmasPdfBtn.addEventListener('click', async () => {
      const origHtml = triggerDownloadChristmasPdfBtn.innerHTML;
      triggerDownloadChristmasPdfBtn.innerHTML = `<span>Downloading...</span>`;
      triggerDownloadChristmasPdfBtn.disabled = true;
      try {
        await downloadChristmasPdf(latestChristmasQuoteData?.quoteId);
      } finally {
        triggerDownloadChristmasPdfBtn.innerHTML = origHtml;
        triggerDownloadChristmasPdfBtn.disabled = false;
      }
    });
  }

  // 9.5 WhatsApp Message for Christmas Quotes
  function buildChristmasWhatsAppMessage(q) {
    if (!q) return 'Hello Sleek Clean! I would like to request a Christmas Light Installation quote.';
    let msg = `🎄 *NEW CHRISTMAS LIGHT INSTALLATION LEAD - SLEEK CLEAN™*\n\n`;
    msg += `📋 *Quote ID:* ${q.quoteId}\n`;
    msg += `📅 *Date:* ${q.issueDate}\n\n`;
    msg += `👤 *Client Details:*\n`;
    msg += `• *Name:* ${q.customerName}\n`;
    msg += `• *Phone:* ${q.customerPhone}\n`;
    if (q.customerEmail && q.customerEmail !== 'Not provided') {
      msg += `• *Email:* ${q.customerEmail}\n`;
    }
    msg += `• *Service Address:* ${q.customerAddress}\n\n`;
    msg += `🏡 *Holiday Project Specifications:*\n`;
    msg += `• *Stories:* ${q.stories}\n`;
    msg += `• *Where on House:* ${q.rooflineCoverage}\n`;
    msg += `• *Lighting Theme:* ${q.lightColor}\n`;
    msg += `• *Referral Source:* ${q.referralSource}\n`;
    if (q.specialNotes) msg += `• *Notes:* ${q.specialNotes}\n`;
    msg += `\n🎁 *Special Offer:* 50% OFF Early Bird + Free Takedown & Storage!\n`;
    msg += `💰 *Estimated Investment:* ${q.totalAmount}\n\n`;
    msg += `Hello Sleek Clean! I just generated this Christmas lighting estimate on your website and would like to lock in my 50% Early Bird spot!`;
    return msg;
  }

  if (sendChristmasWhatsAppBtn) {
    sendChristmasWhatsAppBtn.addEventListener('click', async () => {
      const origHtml = sendChristmasWhatsAppBtn.innerHTML;
      sendChristmasWhatsAppBtn.innerHTML = `<span>Opening WhatsApp...</span>`;
      sendChristmasWhatsAppBtn.disabled = true;
      try {
        await downloadChristmasPdf(latestChristmasQuoteData?.quoteId);
        const msg = buildChristmasWhatsAppMessage(latestChristmasQuoteData);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=17272699002&text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
      } finally {
        sendChristmasWhatsAppBtn.innerHTML = origHtml;
        sendChristmasWhatsAppBtn.disabled = false;
      }
    });
  }

  // 9.6 Generate Christmas Printable Estimate DOM
  function generateChristmasPrintableEstimate() {
    const firstName = document.getElementById('christmasFirstName')?.value.trim() || 'Valued';
    const lastName = document.getElementById('christmasLastName')?.value.trim() || 'Customer';
    const fullName = `${firstName} ${lastName}`.trim();
    const phone = document.getElementById('christmasPhone')?.value.trim() || 'Not provided';
    const email = document.getElementById('christmasEmail')?.value.trim() || 'Not provided';
    const address = document.getElementById('christmasAddress')?.value.trim() || 'Tampa Bay Area';
    const city = document.getElementById('christmasCity')?.value.trim() || 'Tampa';
    const zip = document.getElementById('christmasZip')?.value.trim() || '';
    const state = document.getElementById('christmasState')?.value || 'FL';
    const fullAddress = `${address}, ${city}, ${state} ${zip}`.trim();

    const stories = document.getElementById('christmasStories')?.value || '1 Story';
    const coverage = document.getElementById('christmasCoverage')?.value || 'Front Only';
    const color = document.getElementById('christmasColor')?.value || 'Classic Warm White';
    const referral = document.getElementById('christmasReferral')?.value || 'Website';
    const notes = document.getElementById('christmasNotes')?.value.trim() || '';

    // Price placeholder $1 - $2 as requested by user
    const totalAmount = '$1 - $2';

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const quoteId = `#SLK-XMAS-2026-${randomId}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Update DOM fields in #printableChristmasEstimateSheet
    const safeSet = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    safeSet('printChristmasCustomerName', fullName);
    safeSet('printChristmasCustomerPhone', phone);
    safeSet('printChristmasCustomerEmail', email);
    safeSet('printChristmasCustomerAddress', fullAddress);
    safeSet('printChristmasQuoteId', quoteId);
    safeSet('printChristmasIssueDate', dateStr);
    safeSet('printChristmasReferral', referral);
    safeSet('printChristmasCoverage', coverage);
    safeSet('printChristmasColor', color);
    safeSet('printChristmasStories', stories);
    safeSet('printChristmasTotalAmount', totalAmount);

    latestChristmasQuoteData = {
      isHoliday: true,
      quoteId,
      issueDate: dateStr,
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      customerAddress: fullAddress,
      stories,
      rooflineCoverage: coverage,
      lightColor: color,
      referralSource: referral,
      specialNotes: notes,
      totalAmount,
      duration: 'Full Turnkey Installation'
    };

    return latestChristmasQuoteData;
  }

  // 9.7 Christmas Form Submit Event Handler
  const christmasQuoteForm = document.getElementById('christmasQuoteForm');
  if (christmasQuoteForm) {
    christmasQuoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = christmasQuoteForm.querySelector('button[type="submit"]');
      const origBtnHtml = btn ? btn.innerHTML : '';
      const sendEmailCopy = document.getElementById('christmasSendEmailCopy')?.checked ?? true;
      const customerEmail = document.getElementById('christmasEmail')?.value.trim() || '';

      if (btn) {
        btn.innerHTML = sendEmailCopy
          ? `<span>Generating PDF &amp; Sending Proposal...</span>`
          : `<span>Preparing Proposal Sheet...</span>`;
        btn.disabled = true;
      }

      // 1. Populate printable Christmas Estimate DOM
      const quoteData = generateChristmasPrintableEstimate();

      const alertBox = document.getElementById('christmasEstimateEmailAlert');
      const alertText = document.getElementById('christmasEstimateEmailAlertText');
      const subtext = document.getElementById('printChristmasModalSubtext');

      if (sendEmailCopy && customerEmail) {
        // 2. Generate Christmas PDF base64
        const pdfBase64 = await generateChristmasPdfBase64(quoteData.quoteId);

        // 3. Send via Serverless function (/api/send-estimate)
        const sendResult = await sendEstimateEmail(quoteData, pdfBase64);

        if (alertBox && alertText) {
          alertBox.style.display = 'flex';
          if (sendResult.success) {
            alertBox.style.backgroundColor = '#ecfdf5';
            alertBox.style.color = '#065f46';
            alertText.textContent = `A copy of your Christmas Light Proposal and PDF have been sent to ${customerEmail}.`;
            if (subtext) subtext.textContent = `Proposal sent to ${customerEmail}. You can also download the PDF or send via WhatsApp.`;
          } else if (sendResult.reason === 'local_environment') {
            alertBox.style.backgroundColor = '#f0fdf4';
            alertBox.style.color = '#166534';
            alertText.textContent = `Christmas Proposal & PDF ready! (Deploy to Vercel with RESEND_API_KEY to test live emails)`;
          } else if (sendResult.reason === 'not_configured') {
            alertBox.style.backgroundColor = '#fef3c7';
            alertBox.style.color = '#92400e';
            alertText.textContent = `Christmas Proposal & PDF ready! Set RESEND_API_KEY in Vercel to activate automated emailing.`;
          } else {
            alertBox.style.backgroundColor = '#fef2f2';
            alertBox.style.color = '#991b1b';
            alertText.textContent = `Christmas proposal generated! You can download your PDF or message us directly on WhatsApp below.`;
          }
        }
      } else {
        if (alertBox) alertBox.style.display = 'none';
        if (subtext) subtext.textContent = `You can print, download as PDF, or send your proposal via WhatsApp.`;
      }

      if (btn) {
        btn.innerHTML = origBtnHtml;
        btn.disabled = false;
      }

      closeChristmasModal();
      if (printableChristmasModalBackdrop) {
        printableChristmasModalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

});




