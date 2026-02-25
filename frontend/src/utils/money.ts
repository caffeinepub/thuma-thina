/**
 * Money utility for ZAR (South African Rand) formatting and parsing.
 * All values are stored and displayed as rands (not cents).
 */

/**
 * Format a bigint amount in rands for display
 * @param rands - Amount in rands as bigint
 * @returns Formatted string like "R 217.00"
 */
export function formatZAR(rands: bigint): string {
  return `R ${Number(rands).toFixed(2)}`;
}

/**
 * Parse a string input to bigint rands
 * @param input - String input from user (e.g., "217" or "217.50")
 * @returns Bigint amount in rands
 */
export function parseZAR(input: string): bigint {
  const cleaned = input.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) {
    return BigInt(0);
  }
  // Round to 2 decimal places and convert to bigint
  return BigInt(Math.round(num * 100) / 100);
}

/**
 * Validate ZAR input string
 * @param input - String to validate
 * @returns true if valid ZAR amount
 */
export function isValidZAR(input: string): boolean {
  const cleaned = input.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return !isNaN(num) && num >= 0;
}
