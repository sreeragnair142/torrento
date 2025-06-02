// form-script.js

// Function to handle option selection
function selectOption(element) {
  // Toggle selected class for visual feedback
  element.classList.toggle('selected');
  
  // Get all selected options
  const selectedOptions = document.querySelectorAll('.cleaning-option.selected');
  const optionsArray = Array.from(selectedOptions).map(opt => opt.getAttribute('data-option'));
  
  // Store selected options in hidden input
  document.getElementById('selectedOptions').value = optionsArray.join(',');
  
  // Update the mobile summary
  updateMobileSummary();
}

// Function to update mobile summary
function updateMobileSummary() {
  // Get values from form fields
  const serviceType = document.getElementById('cleaning-level').value || 'Standard House Cleaning';
  const serviceDate = document.getElementById('service-date').value || '06/11/2025';
  const serviceTime = document.getElementById('service-time').value || '8:00AM - 9:00AM';
  const frequency = document.querySelector('input[name="frequency"]:checked')?.value || 'One Time';
  
  // Calculate base price based on selections
  let basePrice = 89.00; // Default price
  
  // Adjust price based on cleaning level
  if (document.getElementById('cleaning-level').value === 'deep') {
    basePrice = 129.00;
  }
  
  // Adjust price based on square footage
  const sqft = document.getElementById('square-footage').value;
  if (sqft === '1000-1499') basePrice += 20;
  else if (sqft === '1500-1999') basePrice += 40;
  else if (sqft === '2000+') basePrice += 60;
  
  // Apply frequency discount
  let discount = 0;
  let frequencyText = frequency;
  if (frequency === 'weekly') {
    discount = basePrice * 0.15;
    frequencyText = 'Weekly - 15% off';
  } else if (frequency === 'biweekly') {
    discount = basePrice * 0.10;
    frequencyText = 'Bi-weekly - 10% off';
  } else if (frequency === 'monthly') {
    discount = basePrice * 0.05;
    frequencyText = 'Monthly - 5% off';
  }
  
  const subtotal = basePrice - discount;
  const tax = subtotal * 0.13; // Assuming 13% tax
  const total = subtotal + tax;
  
  // Update the summary elements
  document.querySelector('.mobile-summary .service-name').textContent = serviceType;
  document.querySelector('.mobile-summary .service-price').textContent = `$${basePrice.toFixed(2)}`;
  document.querySelector('.mobile-summary .time-slot').textContent = `${serviceDate} @ ${serviceTime}`;
  document.querySelector('.mobile-summary .frequency').textContent = frequencyText;
  
  // Update pricing
  document.querySelector('.mobile-summary .subtotal span:last-child').textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector('.mobile-summary .tax span:last-child').textContent = `$${tax.toFixed(2)}`;
  document.querySelector('.mobile-summary .initial-fee span:last-child').textContent = `$${total.toFixed(2)}`;
  
  // Calculate recurring fee (without initial clean fee)
  const recurringSubtotal = basePrice - discount;
  const recurringTax = recurringSubtotal * 0.13;
  const recurringTotal = recurringSubtotal + recurringTax;
  document.querySelector('.mobile-summary .recurring-fee span:last-child').textContent = `$${recurringTotal.toFixed(2)}`;
}

// Initialize form functionality
function initForm() {
  // Add event listeners to all relevant form fields
  const formFields = [
    'cleaning-level', 'service-date', 'service-time', 
    'square-footage', 'bedrooms', 'bathrooms'
  ];

  formFields.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', updateMobileSummary);
    }
  });

  // For radio buttons
  document.querySelectorAll('input[name="frequency"]').forEach(radio => {
    radio.addEventListener('change', updateMobileSummary);
  });

  // For cleaning options
  document.querySelectorAll('.cleaning-option').forEach(option => {
    option.addEventListener('click', function() {
      selectOption(this);
    });
  });

  // Set default date to today
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  document.getElementById('service-date').value = `${yyyy}-${mm}-${dd}`;
  
  // Initialize summary
  updateMobileSummary();

  // Form step navigation
  document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function() {
      const nextStep = this.getAttribute('data-next');
      document.querySelector('.form-steps.active').classList.remove('active');
      document.getElementById(nextStep).classList.add('active');
    });
  });

  document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function() {
      const prevStep = this.getAttribute('data-prev');
      document.querySelector('.form-steps.active').classList.remove('active');
      document.getElementById(prevStep).classList.add('active');
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initForm);