/**
 * Saudi IBAN check, done in the browser before the API's own validation:
 * "SA" + 2 check digits + 22 digits (24 characters), with a valid ISO 13616 mod-97 checksum.
 * Spaces are ignored and letters may be lower case.
 */

/** Most characters the IBAN field takes: 24, plus the 5 spaces of the grouped form "SA41 2000 0000 6080 1016 7519" */
export const IBAN_MAX_LENGTH = 29;

/** The IBAN without spaces, in upper case */
export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

/** The translation key of the error, or null when it's valid (or empty — that's checked separately) */
export function ibanError(value: string): string | null {
  const iban = normalizeIban(value);
  if (!iban) {
    return null;
  }
  return /^SA\d{22}$/.test(iban) && hasValidChecksum(iban) ? null : 'initiative.bank.ibanError';
}

/** Move the first 4 characters to the end, letters → numbers (A=10 … Z=35), and the number mod 97 must be 1 */
function hasValidChecksum(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55);
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}
