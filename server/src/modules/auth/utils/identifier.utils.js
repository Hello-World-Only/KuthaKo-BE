// src/modules/auth/utils/identifier.utils.js

// -------------------------------
// EMAIL VALIDATOR
// -------------------------------
export const isEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// -------------------------------
// PHONE VALIDATOR (E.164)
// Supports: +91xxxxxxxxxx, +1xxxxxxxxxx, etc.
// Length: +[countryCode][number] = 7 to 16 chars
// -------------------------------
export const isPhoneE164 = (phone) => {
  if (!phone) return false;
  const regex = /^\+[1-9][0-9]{5,14}$/;
  return regex.test(phone);
};

// -------------------------------
// NORMALIZE PHONE
// Input: phonePrefix = "+91", phone = "9876543210"
// Output: "+919876543210"
// -------------------------------
export const normalizePhone = (phonePrefix, phone) => {
  if (!phonePrefix || !phone) return null;

  // Remove spaces, dashes, etc.
  const prefix = phonePrefix.replace(/\s+/g, "");
  const num = phone.replace(/\s+/g, "");

  // Ensure number does NOT contain prefix again
  const raw = num.startsWith(prefix) ? num.slice(prefix.length) : num;

  return prefix + raw;
};

// -------------------------------
// MAIN FUNCTION
// Extract identifier from body
// Return: { method, identifier }
// method = "email" | "phone"
// -------------------------------
export const getIdentifierFromBody = (body) => {
  // CASE 1 → EMAIL LOGIN
  if (body.email) {
    const email = body.email.trim().toLowerCase();

    if (!isEmail(email)) {
      throw new Error("Invalid email format.");
    }

    return {
      method: "email",
      identifier: email,
    };
  }

  // CASE 2 → PHONE LOGIN
  if (body.phonePrefix && body.phone) {
    const identifier = normalizePhone(body.phonePrefix, body.phone);

    if (!isPhoneE164(identifier)) {
      throw new Error("Invalid phone number format. Use E.164 format (e.g., +919876543210).");
    }

    return {
      method: "phone",
      identifier,
    };
  }

  // If neither email nor phone is provided
  throw new Error("Either email or phonePrefix + phone is required.");
};
