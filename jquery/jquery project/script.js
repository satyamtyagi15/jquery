$(document).ready(function() {
    // Cache selectors for performance
    const $form = $('#registrationForm');
    const $name = $('#name');
    const $email = $('#email');
    const $phone = $('#phone');
    const $password = $('#password');
    const $togglePassword = $('#togglePassword');
    const $messageBox = $('#messageBox');
    const startTimestamp = Date.now(); // Start time for reaction time tracking

    // Function to display messages (success or error)
    function showMessage(message, type) {
        $messageBox.text(message).removeClass('success error').addClass(type).fadeIn();
        // Hide error messages for individual fields when a new overall message is shown
        $('.error-message').hide();
    }

    // Function to validate a single field and display its error message
    function validateField(field, message) {
        const $field = $(field);
        const $errorMessage = $field.next('.error-message');
        if ($field.val().trim() === '') {
            $errorMessage.text(message).fadeIn();
            return false;
        }
        $errorMessage.fadeOut();
        return true;
    }

    // Email validation using a simple regex
    function validateEmail(email) {
        const $emailField = $(email);
        const $errorMessage = $emailField.next('.error-message');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($emailField.val())) {
            $errorMessage.text('Please enter a valid email address.').fadeIn();
            return false;
        }
        $errorMessage.fadeOut();
        return true;
    }

    // Phone number validation (exactly 10 digits)
    function validatePhone(phone) {
        const $phoneField = $(phone);
        const $errorMessage = $phoneField.next('.error-message');
        const phoneValue = $phoneField.val().replace(/\D/g, ''); // Remove non-digits
        if (phoneValue.length !== 10) {
            $errorMessage.text('Phone number must be exactly 10 digits.').fadeIn();
            return false;
        }
        $errorMessage.fadeOut();
        return true;
    }

    // Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    function validatePassword(password) {
        const $passwordField = $(password);
        const $errorMessage = $passwordField.next('.error-message');
        const passwordValue = $passwordField.val();
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordPattern.test(passwordValue)) {
            $errorMessage.text('Password must be at least 8 characters, and include an uppercase letter, a lowercase letter, and a number.').fadeIn();
            return false;
        }
        $errorMessage.fadeOut();
        return true;
    }

    // Toggle password visibility
    $togglePassword.on('click', function() {
        const passwordField = $password[0];
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    // Handle form submission
    $form.on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Run all validation checks
        const isNameValid = validateField($name, 'Name is required.');
        const isEmailValid = validateEmail($email);
        const isPhoneValid = validatePhone($phone);
        const isPasswordValid = validatePassword($password);

        // Check if all fields are valid
        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid) {
            const reactionTime = Date.now() - startTimestamp; // Calculate reaction time
            showMessage(`Registration successful! Reaction time: ${reactionTime}ms`, 'success');
            // Reset the form after successful submission
            $form[0].reset();
            // Optional: Hide the success message after a few seconds
            setTimeout(() => {
                $messageBox.fadeOut();
            }, 5000);
        } else {
            showMessage('Please correct the errors in the form.', 'error');
        }
    });

    // Add real-time validation on keyup for a better user experience
    $name.on('keyup', function() {
        if ($(this).val().trim() !== '') {
            $(this).next('.error-message').fadeOut();
        }
    });

    $email.on('keyup', function() {
        validateEmail($(this));
    });

    $phone.on('keyup', function() {
        validatePhone($(this));
    });

    $password.on('keyup', function() {
        validatePassword($(this));
    });
});