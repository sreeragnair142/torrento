// assets/js/form.js

document.addEventListener('DOMContentLoaded', function() {
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('service-date').setAttribute('min', today);

  // Next step buttons
  document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function() {
      const nextStepId = this.getAttribute('data-next');
      const currentStep = this.closest('.form-steps');
      
      // Validate before proceeding
      if (validateStep(currentStep)) {
        currentStep.classList.remove('active');
        document.getElementById(nextStepId).classList.add('active');
        
        // Scroll to top of form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Previous step buttons
  document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const prevStepId = this.getAttribute('data-prev');
      const currentStep = this.closest('.form-steps');
      
      currentStep.classList.remove('active');
      document.getElementById(prevStepId).classList.add('active');
      
      // Scroll to top of form
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Cleaning option selection
  document.querySelectorAll('.cleaning-option').forEach(option => {
    option.addEventListener('click', function() {
      // Toggle selected class
      this.classList.toggle('selected');
    });
  });

  // Property type selection
  document.querySelectorAll('.property-type').forEach(option => {
    option.addEventListener('click', function() {
      // Remove selected class from all options
      document.querySelectorAll('.property-type').forEach(opt => {
        opt.classList.remove('selected');
      });
      // Add selected class to clicked option
      this.classList.add('selected');
    });
  });

  // Coupon code application
    const validCoupons = {
      'CLEAN10': { discount: 10, type: 'percentage' },
      'SPARKLE20': { discount: 20, type: 'percentage' },
      'FIRST5': { discount: 5, type: 'dollars' },
      'SUMMER15': { discount: 15, type: 'percentage' }
    };

    // Original prices (you would normally get these from your pricing calculator)
    let originalPrices = {
      subtotal: 89.00,
      tax: 11.57,
      initialFee: 100.57,
      recurringFee: 80.46
    };

    // Current prices (will be modified by coupons)
    let currentPrices = {
      subtotal: 89.00,
      tax: 11.57,
      initialFee: 100.57,
      recurringFee: 80.46
    };

    document.getElementById('apply-coupon').addEventListener('click', function() {
      const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
      const feedbackElement = document.getElementById('coupon-feedback');
      
      if (couponCode === '') {
        feedbackElement.textContent = 'Please enter a coupon code';
        feedbackElement.style.color = '#e74c3c';
        return;
      }

      if (validCoupons[couponCode]) {
        const coupon = validCoupons[couponCode];
        let discountAmount = 0;
        
        if (coupon.type === 'percentage') {
          discountAmount = (originalPrices.subtotal * coupon.discount) / 100;
        } else {
          discountAmount = coupon.discount;
        }

        // Apply discount to prices
        currentPrices.subtotal = originalPrices.subtotal - discountAmount;
        currentPrices.tax = (currentPrices.subtotal * 0.13).toFixed(2); // Assuming 13% tax
        currentPrices.initialFee = (parseFloat(currentPrices.subtotal) + parseFloat(currentPrices.tax)).toFixed(2);
        
        // Update the displayed prices
        updatePrices();
        
        feedbackElement.textContent = `Coupon applied successfully! ${coupon.discount}${coupon.type === 'percentage' ? '%' : '$'} discount applied.`;
        feedbackElement.style.color = '#28a745';
      } else {
        feedbackElement.textContent = 'Invalid coupon code';
        feedbackElement.style.color = '#e74c3c';
      }
    });

    function updatePrices() {
      // Update desktop summary
      document.querySelector('.desktop-summary .service-price').textContent = `$${currentPrices.subtotal.toFixed(2)}`;
      document.querySelector('.desktop-summary .tax span:last-child').textContent = `$${currentPrices.tax}`;
      document.querySelector('.desktop-summary .initial-fee span:last-child').textContent = `$${currentPrices.initialFee}`;
      document.querySelector('.desktop-summary .recurring-fee span:last-child').textContent = `$${currentPrices.recurringFee}`;
      
      // Update mobile summary
      document.querySelector('.mobile-summary .service-price').textContent = `$${currentPrices.subtotal.toFixed(2)}`;
      document.querySelector('.mobile-summary .tax span:last-child').textContent = `$${currentPrices.tax}`;
      document.querySelector('.mobile-summary .initial-fee span:last-child').textContent = `$${currentPrices.initialFee}`;
      document.querySelector('.mobile-summary .recurring-fee span:last-child').textContent = `$${currentPrices.recurringFee}`;
    }

    // Reset prices if coupon is removed
    document.getElementById('coupon-code').addEventListener('input', function() {
      if (this.value.trim() === '') {
        // Reset to original prices
        currentPrices = JSON.parse(JSON.stringify(originalPrices));
        updatePrices();
        document.getElementById('coupon-feedback').textContent = '';
      }
    });

  // Form submission
  document.querySelector('#cleaningForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateStep(document.getElementById('step6'))) {
      alert('Booking submitted successfully!');
      // Here you would typically send the form data to your server
      console.log('Form submitted with data:', collectFormData());
    }
  });

  // Validation function
  function validateStep(step) {
    let isValid = true;
    const inputs = step.querySelectorAll('[required]');
    
    // Reset all errors
    inputs.forEach(input => {
      input.classList.remove('error');
    });
    
    // Check required fields
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      }
    });

    // Special validation for radio buttons in step 1
    if (step.id === 'step1') {
      const frequencySelected = step.querySelector('input[name="frequency"]:checked');
      if (!frequencySelected) {
        document.querySelector('.frequency-options').style.border = '1px solid #e74c3c';
        isValid = false;
      } else {
        document.querySelector('.frequency-options').style.border = 'none';
      }
    }

    if (!isValid) {
      alert('Please fill in all required fields.');
    }

    return isValid;
  }

  // Collect all form data
  function collectFormData() {
    // Get selected cleaning options
    const selectedOptions = [];
    document.querySelectorAll('.cleaning-option.selected').forEach(option => {
      selectedOptions.push(option.getAttribute('data-option'));
    });

    // Get selected property type
    let propertyType = '';
    const selectedProperty = document.querySelector('.property-type.selected');
    if (selectedProperty) {
      propertyType = selectedProperty.getAttribute('data-type');
    }

    return {
      address: document.getElementById('address').value,
      suite: document.getElementById('suite').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postal: document.getElementById('postal').value,
      date: document.getElementById('service-date').value,
      time: document.getElementById('service-time').value,
      frequency: document.querySelector('input[name="frequency"]:checked')?.value,
      cleaningType: document.getElementById('cleaning-type').value,
      cleaningLevel: document.getElementById('cleaning-level').value,
      squareFootage: document.getElementById('square-footage').value,
      bedrooms: document.getElementById('bedrooms').value,
      bathrooms: document.getElementById('bathrooms').value,
      halfBaths: document.getElementById('half-baths').value,
      basement: document.getElementById('basement').value,
      cleaningOptions: selectedOptions,
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      cleaningInstructions: document.getElementById('cleaning-instructions').value,
      accessInfo: document.getElementById('access-info').value,
      parking: document.getElementById('parking').value,
      garbageLocation: document.getElementById('garbage-location').value,
      propertyType: propertyType,
      timeRestriction: document.getElementById('time-restriction').value,
      couponCode: document.getElementById('coupon-code').value,
      cardNumber: document.getElementById('inputCard').value,
      cardHolder: document.getElementById('inputHolder').value,
      expiryDate: document.getElementById('inputExpire').value,
      ccvCode: document.getElementById('inputCCV').value
    };
  }
});