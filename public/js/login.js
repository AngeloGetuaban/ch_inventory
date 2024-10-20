document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');

    form.addEventListener('submit', function(event) {
        let valid = true;

        // Simple validation for empty fields
        if (usernameInput.value.trim() === '') {
            alert('Please enter your username.');
            valid = false;
        }

        if (passwordInput.value.trim() === '') {
            alert('Please enter your password.');
            valid = false;
        }

        // Prevent form submission if validation fails
        if (!valid) {
            event.preventDefault();
        }
    });
});
