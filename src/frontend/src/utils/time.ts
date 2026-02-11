/**
 * Converts IC Time (bigint nanoseconds since epoch) to a human-readable date string
 */
export function formatICTime(time: bigint): string {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  
  // Format as: "Jan 15, 2026"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Converts IC Time to a full date-time string
 */
export function formatICDateTime(time: bigint): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Alias for formatICTime for backward compatibility
 */
export function formatTimeToDate(time: bigint): string {
  return formatICTime(time);
}
