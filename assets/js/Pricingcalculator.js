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
    'windows': 40.00
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

function updateSummaryElement(container, data) {
  container.querySelector('.service-name').textContent = data.serviceName;
  container.querySelector('.service-price').textContent = `$${data.basePrice.toFixed(2)}`;
  container.querySelector('.time-slot').textContent = data.timeSlot;
  container.querySelector('.frequency').textContent = data.frequencyText;
  container.querySelector('.subtotal span:last-child').textContent = `$${data.subtotal.toFixed(2)}`;
  container.querySelector('.tax span:last-child').textContent = `$${data.tax.toFixed(2)}`;
  container.querySelector('.initial-fee span:last-child').textContent = `$${data.total.toFixed(2)}`;
  container.querySelector('.recurring-fee span:last-child').textContent = `$${data.recurringTotal.toFixed(2)}`;
}

function calculatePricing() {
  alert("ZXCVBN")
  // Get base price
  let basePrice = pricing[currentSelections.cleaningType].basePrice;
  
  // Apply square footage multiplier
  if (currentSelections.squareFootage === '1000-1499') basePrice *= 1.2;
  if (currentSelections.squareFootage === '1500-1999') basePrice *= 1.4;
  if (currentSelections.squareFootage === '2000+') basePrice *= 1.6;
  
  // Apply bedroom/bathroom adjustments
  if (currentSelections.bedrooms === '3') basePrice *= 1.1;
  if (currentSelections.bedrooms === '4+') basePrice *= 1.25;
  if (currentSelections.bathrooms === '3+') basePrice *= 1.15;
  
  // Apply frequency discount
  const discount = pricing.frequencyDiscounts[currentSelections.frequency];
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
  const frequencyText = {
    'weekly': 'Weekly - 20% off',
    'biweekly': 'Bi-weekly - 15% off',
    'monthly': 'Monthly - 10% off',
    'one-time': 'One Time'
  };
  
  // Get time slot
  const dateInput = document.getElementById('service-date');
  const timeSelect = document.getElementById('service-time');
  let timeSlot = 'Not selected';
  if (dateInput.value && timeSelect.value) {
    timeSlot = `${dateInput.value} @ ${timeSelect.value}`;
  }
  
  // Prepare data for all summaries
  const summaryData = {
    serviceName: pricing[currentSelections.cleaningType].name,
    basePrice: basePrice,
    timeSlot: timeSlot,
    frequencyText: frequencyText[currentSelections.frequency],
    subtotal: subtotal,
    tax: tax,
    total: total,
    recurringTotal: recurringTotal
  };
  
  // Update desktop summary
  const desktopSummary = document.querySelector('.desktop-summary .pricing-summary');
  if (desktopSummary) {
    updateSummaryElement(desktopSummary, summaryData);
  }
  
  // Update all mobile summaries
  const mobileSummaries = document.querySelectorAll('.mobile-summary');
  mobileSummaries.forEach(summary => {
    updateSummaryElement(summary, summaryData);
  });
}

// Initialize the calculator
function initPricingCalculator() {
  // Cleaning type selection
  document.getElementById('cleaning-level').addEventListener('change', function() {
    currentSelections.cleaningType = this.value;
    calculatePricing();
  });
  
  // Frequency selection
  document.querySelectorAll('input[name="frequency"]').forEach(input => {
    input.addEventListener('change', function() {
      currentSelections.frequency = this.value;
      calculatePricing();
    });
  });
  
  // Square footage selection
  document.getElementById('square-footage').addEventListener('change', function() {
    currentSelections.squareFootage = this.value;
    calculatePricing();
  });
  
  // Bedrooms selection
  document.getElementById('bedrooms').addEventListener('change', function() {
    currentSelections.bedrooms = this.value;
    calculatePricing();
  });
  
  // Bathrooms selection
  document.getElementById('bathrooms').addEventListener('change', function() {
    currentSelections.bathrooms = this.value;
    calculatePricing();
  });
  
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
  document.getElementById('service-date').addEventListener('change', calculatePricing);
  document.getElementById('service-time').addEventListener('change', calculatePricing);
  
  // Initialize pricing
  calculatePricing();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPricingCalculator);