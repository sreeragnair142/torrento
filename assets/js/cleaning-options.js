document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.cleaning-option').forEach(option => {
    option.addEventListener('click', () => {
      // Toggle selection
      option.classList.toggle('selected');

      // If you want to allow only one selection at a time, uncomment below:
      // document.querySelectorAll('.cleaning-option').forEach(o => o.classList.remove('selected'));
      // option.classList.add('selected');

      // Optionally, store selected value or update form data
      const selectedOptions = [...document.querySelectorAll('.cleaning-option.selected')].map(opt =>
        opt.getAttribute('data-option')
      );
      console.log('Selected options:', selectedOptions);
    });
  });
});