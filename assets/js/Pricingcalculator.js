document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing pricing calculator');
  
  // Pricing configuration
  const pricing = {
    standard: {
      basePrice: 89.00,
      name: "Standard House Cleaning"
    },
    deep: {
      basePrice: 129.00,
      name: "Deep House Cleaning"
    },
    taxRate: 0.13, // 13%
    initialFee: 25.00,
    frequencyDiscounts: {
      'weekly': 0.20,
      'biweekly': 0.15,
      'monthly': 0.10,
      'one-time': 0.00
    },
    addOns: {
      'pets': 15.00,
      'fridge': 25.00,
      'oven': 25.00,
      'cabinets': 20.00,
      'kitchen': 30.00,
      'blinds': 5.00,
      'windows': 40.00
    }
  };

  // Current selections with defaults
  let currentSelections = {
    cleaningType: 'standard',
    frequency: 'one-time',
    addOns: [],
    squareFootage: '',
    bedrooms: '',
    bathrooms: ''
  };

  function updateSummaryElement(container, data) {
    if (!container) {
      console.error('Summary container not found');
      return;
    }

    const elements = {
      serviceName: container.querySelector('.service-name'),
      servicePrice: container.querySelector('.service-price'),
      timeSlot: container.querySelector('.time-slot'),
      frequency: container.querySelector('.frequency'),
      subtotal: container.querySelector('.subtotal span:last-child'),
      tax: container.querySelector('.tax span:last-child'),
      initialFee: container.querySelector('.initial-fee span:last-child'),
      recurringFee: container.querySelector('.recurring-fee span:last-child')
    };

    // Check if elements exist before updating
    if (elements.serviceName) elements.serviceName.textContent = data.serviceName;
    if (elements.servicePrice) elements.servicePrice.textContent = `$${data.basePrice.toFixed(2)}`;
    if (elements.timeSlot) elements.timeSlot.textContent = data.timeSlot;
    if (elements.frequency) elements.frequency.textContent = data.frequencyText;
    if (elements.subtotal) elements.subtotal.textContent = `$${data.subtotal.toFixed(2)}`;
    if (elements.tax) elements.tax.textContent = `$${data.tax.toFixed(2)}`;
    if (elements.initialFee) elements.initialFee.textContent = `$${data.total.toFixed(2)}`;
    if (elements.recurringFee) elements.recurringFee.textContent = `$${data.recurringTotal.toFixed(2)}`;
  }

  function calculatePricing() {
    console.log('Calculating pricing with selections:', currentSelections);
    
    // Get base price
    let basePrice = pricing[currentSelections.cleaningType]?.basePrice || 89.00;
    
    // Apply square footage multiplier
    if (currentSelections.squareFootage === '1000-1499') basePrice *= 1.2;
    if (currentSelections.squareFootage === '1500-1999') basePrice *= 1.4;
    if (currentSelections.squareFootage === '2000+') basePrice *= 1.6;
    
    // Apply bedroom/bathroom adjustments
    if (currentSelections.bedrooms === '3') basePrice *= 1.1;
    if (currentSelections.bedrooms === '4+') basePrice *= 1.25;
    if (currentSelections.bathrooms === '3+') basePrice *= 1.15;
    
    // Apply frequency discount
    const discount = pricing.frequencyDiscounts[currentSelections.frequency] || 0;
    const discountedPrice = basePrice * (1 - discount);
    
    // Calculate add-ons
    let addOnTotal = 0;
    currentSelections.addOns.forEach(addOn => {
      if (pricing.addOns[addOn]) {
        addOnTotal += pricing.addOns[addOn];
      }
    });
    
    const subtotal = discountedPrice + addOnTotal;
    const tax = subtotal * pricing.taxRate;
    const total = subtotal + tax + pricing.initialFee;
    const recurringTotal = subtotal + (subtotal * pricing.taxRate);
    
    // Format frequency display text
    const frequencyTexts = {
      'weekly': 'Weekly - 20% off',
      'biweekly': 'Bi-weekly - 15% off',
      'monthly': 'Monthly - 10% off',
      'one-time': 'One Time'
    };
    
    // Get time slot
    const dateInput = document.getElementById('service-date');
    const timeSelect = document.getElementById('service-time');
    let timeSlot = 'Not selected';
    if (dateInput && timeSelect && dateInput.value && timeSelect.value) {
      timeSlot = `${dateInput.value} @ ${timeSelect.value}`;
    }
    
    // Prepare data for all summaries
    const summaryData = {
      serviceName: pricing[currentSelections.cleaningType]?.name || 'Standard House Cleaning',
      basePrice: basePrice,
      timeSlot: timeSlot,
      frequencyText: frequencyTexts[currentSelections.frequency] || 'One Time',
      subtotal: subtotal,
      tax: tax,
      total: total,
      recurringTotal: recurringTotal
    };
    
    // Update desktop summary
    const desktopSummary = document.querySelector('.desktop-summary .pricing-summary');
    if (desktopSummary) {
      console.log('Updating desktop summary');
      updateSummaryElement(desktopSummary, summaryData);
    } else {
      console.log('Desktop summary not found');
    }
    
    // Update all mobile summaries
    const mobileSummaries = document.querySelectorAll('.mobile-summary');
    console.log(`Found ${mobileSummaries.length} mobile summaries`);
    mobileSummaries.forEach(summary => {
      updateSummaryElement(summary, summaryData);
    });
  }

  // Initialize event listeners
  function initEventListeners() {
    console.log('Initializing event listeners');
    
    // Cleaning type selection
    const cleaningLevel = document.getElementById('cleaning-level');
    if (cleaningLevel) {
      cleaningLevel.addEventListener('change', function() {
        currentSelections.cleaningType = this.value;
        calculatePricing();
      });
    }

    // Frequency selection
    document.querySelectorAll('input[name="frequency"]').forEach(input => {
      input.addEventListener('change', function() {
        currentSelections.frequency = this.value;
        calculatePricing();
      });
    });
    
    // Square footage selection
    const squareFootage = document.getElementById('square-footage');
    if (squareFootage) {
      squareFootage.addEventListener('change', function() {
        currentSelections.squareFootage = this.value;
        calculatePricing();
      });
    }
    
    // Bedrooms selection
    const bedrooms = document.getElementById('bedrooms');
    if (bedrooms) {
      bedrooms.addEventListener('change', function() {
        currentSelections.bedrooms = this.value;
        calculatePricing();
      });
    }
    
    // Bathrooms selection
    const bathrooms = document.getElementById('bathrooms');
    if (bathrooms) {
      bathrooms.addEventListener('change', function() {
        currentSelections.bathrooms = this.value;
        calculatePricing();
      });
    }
    
    // Add-ons selection
    document.querySelectorAll('.cleaning-option').forEach(option => {
      option.addEventListener('click', function() {
        const addOn = this.getAttribute('data-option');
        const index = currentSelections.addOns.indexOf(addOn);
        
        if (index === -1) {
          currentSelections.addOns.push(addOn);
          this.classList.add('selected');
        } else {
          currentSelections.addOns.splice(index, 1);
          this.classList.remove('selected');
        }
        
        calculatePricing();
      });
    });
    
    // Date/time selection
    const serviceDate = document.getElementById('service-date');
    if (serviceDate) {
      serviceDate.addEventListener('change', calculatePricing);
    }
    
    const serviceTime = document.getElementById('service-time');
    if (serviceTime) {
      serviceTime.addEventListener('change', calculatePricing);
    }
  }

  // Initialize everything
  initEventListeners();
  calculatePricing();
});