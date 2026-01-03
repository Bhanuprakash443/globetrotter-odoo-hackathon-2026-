/**
 * Input validation utilities
 */
export const validation = {
  // Email validation
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  },

  // Password validation
  validatePassword: (password, minLength = 8) => {
    if (!password) return "Password is required";
    if (password.length < minLength) return `Password must be at least ${minLength} characters`;
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    return null;
  },

  // Required field validation
  validateRequired: (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Phone validation
  validatePhone: (phone) => {
    if (!phone) return null; // Optional
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      return "Please enter a valid phone number";
    }
    return null;
  },

  // Date validation
  validateDate: (date, fieldName = "Date") => {
    if (!date) return `${fieldName} is required`;
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) return `Please enter a valid ${fieldName.toLowerCase()}`;
    return null;
  },

  // Date range validation
  validateDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return "End date must be after start date";
    return null;
  },

  // Number validation
  validateNumber: (value, min = null, max = null, fieldName = "Number") => {
    if (value === "" || value === null || value === undefined) return `${fieldName} is required`;
    const num = parseFloat(value);
    if (isNaN(num)) return `Please enter a valid ${fieldName.toLowerCase()}`;
    if (min !== null && num < min) return `${fieldName} must be at least ${min}`;
    if (max !== null && num > max) return `${fieldName} must be at most ${max}`;
    return null;
  },

  // Username validation
  validateUsername: (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
  },

  // Trip title validation
  validateTripTitle: (title) => {
    if (!title) return "Trip name is required";
    if (title.length < 3) return "Trip name must be at least 3 characters";
    if (title.length > 100) return "Trip name must be less than 100 characters";
    return null;
  },

  // Validate form fields object
  validateForm: (formData, rules) => {
    const errors = {};
    Object.keys(rules).forEach((field) => {
      const rule = rules[field];
      const value = formData[field];
      let error = null;

      if (rule.required) {
        error = validation.validateRequired(value, rule.label || field);
      }

      if (!error && rule.validator) {
        error = rule.validator(value, formData);
      }

      if (error) {
        errors[field] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

