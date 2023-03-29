function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  
    if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      return 'Strong';
    } else if (password.length >= minLength && (hasUpperCase || hasLowerCase) && hasNumber) {
      return 'Medium';
    } else {
      return 'Weak';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit-button');
  
    passwordInput.addEventListener('input', (event) => {
      const passwordStrength = checkPasswordStrength(event.target.value);
      const passwordStrengthIndicator = document.getElementById('password-strength');
      passwordStrengthIndicator.innerText = `Password strength: ${passwordStrength}`;
  
      // Enable or disable the submit button based on password strength
      submitButton.disabled = passwordStrength === 'Weak';
    });
  });
  