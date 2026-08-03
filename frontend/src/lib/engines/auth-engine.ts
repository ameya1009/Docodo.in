export interface PasswordStrengthResult {
  score: number;
  label: "WEAK" | "MODERATE" | "STRONG" | "BULLETPROOF";
  suggestions: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score += 1;
  else suggestions.push("Use at least 8 characters");

  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push("Include an uppercase letter");

  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push("Include at least one number");

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else suggestions.push("Add a symbol (!, @, #, etc.)");

  let label: PasswordStrengthResult["label"] = "WEAK";
  if (score >= 4) label = "BULLETPROOF";
  else if (score === 3) label = "STRONG";
  else if (score === 2) label = "MODERATE";

  return { score, label, suggestions };
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
