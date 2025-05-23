export const validationRules = {
  name: {
    required: true,
    validate: val => val.trim().length > 0 || "Name is required",
  },
  email: {
    required: true,
    validate: val => {
      if (!val.trim()) return "Email is required";
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return emailRegex.test(val) || "Invalid email format";
    },
  },
  phone: {
    required: true,
    validate: val => {
      if (!val) return "Phone number is required";
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(val) || "Invalid phone number";
    },
  },
  dob: {
    required: true,
    validate: val => {
      if (!val) return "Date of Birth is required";
      if (!isValidDateString(val)) return "DOB must be a real date in YYYY-MM-DD format";
      if (new Date(val) > new Date()) return "Date of Birth cannot be in the future";
      return true;
    },
  },
  gender: {
    required: true,
    validate: val => {
      if (!val) return "Gender is required";
      const allowed = ["Female", "Male", "Other"];
      return allowed.includes(val) || "Invalid gender";
    },
  },
  address: {
    required: true,
    validate: val => val.trim().length > 0 || "Address is required",
  },
};

function isValidDateString(str) {
  // Checking format first
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  // Parse and check for real date
  const [year, month, day] = str.split('-').map(Number);
  const date = new Date(str);

  return (
    date instanceof Date &&
    !isNaN(date) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

