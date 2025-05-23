import { validationRules } from "./Validation"; 

export function validateForm(formData) {
  const errors = {};

  for (const field in validationRules) {
    const { required, validate } = validationRules[field];
    const value = formData[field];

    if (required && (!value || String(value).trim() === "")) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      continue;
    }

    if (value || !required) {
      const valid = validate(value ?? "");
      if (valid !== true) {
        errors[field] = valid;
      }
    }
  }

  return errors;
}