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

function calculatePricing() {
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
  
  // Update the display
  document.querySelector('.service-name').textContent = pricing[currentSelections.cleaningType].name;
  document.querySelector('.service-price').textContent = `$${basePrice.toFixed(2)}`;
  
  // Format frequency display text
  const frequencyText = {
    'weekly': 'Weekly - 20% off',
    'biweekly': 'Bi-weekly - 15% off',
    'monthly': 'Monthly - 10% off',
    'one-time': 'One Time'
  };
  
  document.querySelector('.frequency').textContent = frequencyText[currentSelections.frequency];
  
  // Update totals
  document.querySelector('.subtotal span:last-child').textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector('.tax span:last-child').textContent = `$${tax.toFixed(2)}`;
  document.querySelector('.initial-fee span:last-child').textContent = `$${total.toFixed(2)}`;
  document.querySelector('.recurring-fee span:last-child').textContent = `$${recurringTotal.toFixed(2)}`;
  
  // Update time slot if date/time is selected
  const dateInput = document.getElementById('service-date');
  const timeSelect = document.getElementById('service-time');
  if (dateInput.value && timeSelect.value) {
    document.querySelector('.time-slot').textContent = 
      `${dateInput.value} @ ${timeSelect.value}`;
  }
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