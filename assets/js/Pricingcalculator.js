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
  move: {
    basePrice: 199.00,
    name: "Move In/Out Cleaning"
  },
  renovation: {
    basePrice: 249.00,
    name: "Renovation Cleaning"
  },
  student: {
    basePrice: 179.00,
    name: "Student Property Cleaning"
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
    'windows': 40.00,
    'deep-clean': 40.00,
    'move-in-out': 110.00,
    'renovation': 160.00,
    'move-student': 90.00,
    'airbnb': 50.00
  }
};

// Current selections
let currentSelections = {
  cleaningType: 'standard',
  frequency: 'one-time',
  addOns: [],
  squareFootage: '',
  bedrooms: '',
  bathrooms: ''
};

// DOM elements cache
let domElements = {};

function cacheDomElements() {
  domElements = {
    cleaningLevel: document.getElementById('cleaning-level'),
    frequencyInputs: document.querySelectorAll('input[name="frequency"]'),
    squareFootage: document.getElementById('square-footage'),
    bedrooms: document.getElementById('bedrooms'),
    bathrooms: document.getElementById('bathrooms'),
    serviceDate: document.getElementById('service-date'),
    serviceTime: document.getElementById('service-time'),
    cleaningOptions: document.querySelectorAll('.cleaning-option'),
    desktopSummary: document.querySelector('.desktop-summary .pricing-summary'),
    mobileSummaries: document.querySelectorAll('.mobile-summary')
  };
}

function updateSummaryElement(container, data) {
  if (!container) return;
  
  const serviceName = container.querySelector('.service-name');
  const servicePrice = container.querySelector('.service-price');
  const timeSlot = container.querySelector('.time-slot');
  const frequency = container.querySelector('.frequency');
  const subtotal = container.querySelector('.subtotal span:last-child');
  const tax = container.querySelector('.tax span:last-child');
  const initialFee = container.querySelector('.initial-fee span:last-child');
  const recurringFee = container.querySelector('.recurring-fee span:last-child');

  if (serviceName) serviceName.textContent = data.serviceName;
  if (servicePrice) servicePrice.textContent = `$${data.basePrice.toFixed(2)}`;
  if (timeSlot) timeSlot.textContent = data.timeSlot;
  if (frequency) frequency.textContent = data.frequencyText;
  if (subtotal) subtotal.textContent = `$${data.subtotal.toFixed(2)}`;
  if (tax) tax.textContent = `$${data.tax.toFixed(2)}`;
  if (initialFee) initialFee.textContent = `$${data.total.toFixed(2)}`;
  if (recurringFee) recurringFee.textContent = `$${data.recurringTotal.toFixed(2)}`;
}

function calculatePricing() {
  // Get base price with fallback to standard if not set
  const cleaningType = currentSelections.cleaningType || 'standard';
  let basePrice = pricing[cleaningType]?.basePrice || pricing.standard.basePrice;
  
  // Apply square footage multiplier
  if (currentSelections.squareFootage === '1000-1499') basePrice *= 1.2;
  else if (currentSelections.squareFootage === '1500-1999') basePrice *= 1.4;
  else if (currentSelections.squareFootage === '2000+') basePrice *= 1.6;
  
  // Apply bedroom/bathroom adjustments
  if (currentSelections.bedrooms === '3') basePrice *= 1.1;
  else if (currentSelections.bedrooms === '4+') basePrice *= 1.25;
  
  if (currentSelections.bathrooms === '3+') basePrice *= 1.15;
  
  // Apply frequency discount with fallback to one-time
  const frequency = currentSelections.frequency || 'one-time';
  const discount = pricing.frequencyDiscounts[frequency] || 0;
  const discountedPrice = basePrice * (1 - discount);
  
  // Calculate add-ons
  let addOnTotal = 0;
  currentSelections.addOns.forEach(addOn => {
    if (pricing.addOns[addOn]) {
      addOnTotal += pricing.addOns[addOn];
    }
  });
  
  const subtotal = discountedPrice + addOnTotal;
  
  // Calculate tax
  const tax = subtotal * pricing.taxRate;
  const total = subtotal + tax + pricing.initialFee;
  
  // Calculate recurring price (without initial fee)
  const recurringTotal = subtotal + (subtotal * pricing.taxRate);
  
  // Format frequency display text
  const frequencyTexts = {
    'weekly': 'Weekly - 20% off',
    'biweekly': 'Bi-weekly - 15% off',
    'monthly': 'Monthly - 10% off',
    'one-time': 'One Time'
  };
  const frequencyText = frequencyTexts[frequency] || 'One Time';
  
  // Get time slot
  let timeSlot = 'Not selected';
  try {
    const dateValue = domElements.serviceDate?.value;
    const timeValue = domElements.serviceTime?.value;
    if (dateValue && timeValue) {
      timeSlot = `${dateValue} @ ${timeValue}`;
    }
  } catch (e) {
    console.error('Error getting time slot:', e);
  }
  
  // Prepare data for all summaries
  const summaryData = {
    serviceName: pricing[cleaningType]?.name || pricing.standard.name,
    basePrice: basePrice,
    timeSlot: timeSlot,
    frequencyText: frequencyText,
    subtotal: subtotal,
    tax: tax,
    total: total,
    recurringTotal: recurringTotal
  };
  
  // Update desktop summary if it exists
  if (domElements.desktopSummary) {
    updateSummaryElement(domElements.desktopSummary, summaryData);
  }
  
  // Update all mobile summaries if they exist
  if (domElements.mobileSummaries && domElements.mobileSummaries.length > 0) {
    domElements.mobileSummaries.forEach(summary => {
      updateSummaryElement(summary, summaryData);
    });
  }
}

function setupEventListeners() {
  // Cleaning type selection
  if (domElements.cleaningLevel) {
    domElements.cleaningLevel.addEventListener('change', function() {
      currentSelections.cleaningType = this.value;
      calculatePricing();
    });
  }
  
  // Frequency selection
  if (domElements.frequencyInputs && domElements.frequencyInputs.length > 0) {
    domElements.frequencyInputs.forEach(input => {
      input.addEventListener('change', function() {
        currentSelections.frequency = this.value;
        calculatePricing();
      });
    });
  }
  
  // Square footage selection
  if (domElements.squareFootage) {
    domElements.squareFootage.addEventListener('change', function() {
      currentSelections.squareFootage = this.value;
      calculatePricing();
    });
  }
  
  // Bedrooms selection
  if (domElements.bedrooms) {
    domElements.bedrooms.addEventListener('change', function() {
      currentSelections.bedrooms = this.value;
      calculatePricing();
    });
  }
  
  // Bathrooms selection
  if (domElements.bathrooms) {
    domElements.bathrooms.addEventListener('change', function() {
      currentSelections.bathrooms = this.value;
      calculatePricing();
    });
  }
  
  // Add-ons selection
  if (domElements.cleaningOptions && domElements.cleaningOptions.length > 0) {
    domElements.cleaningOptions.forEach(option => {
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
  }
  
  // Date/time selection
  if (domElements.serviceDate) {
    domElements.serviceDate.addEventListener('change', calculatePricing);
  }
  if (domElements.serviceTime) {
    domElements.serviceTime.addEventListener('change', calculatePricing);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements first
  cacheDomElements();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize pricing calculation
  calculatePricing();
  
  // Set default date to today if empty
  if (domElements.serviceDate && !domElements.serviceDate.value) {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    domElements.serviceDate.value = formattedDate;
    domElements.serviceDate.dispatchEvent(new Event('change'));
  }
});