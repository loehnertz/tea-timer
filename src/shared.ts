/**
 * Checks if the given timestamp is older than 12 hours from the current time (epoch).
 *
 * @param savedAt The timestamp to check (epoch).
 */
export function isOlderThan12hours(savedAt: number): boolean {
  if (!savedAt) return true
  return Date.now() - savedAt > 12 * 60 * 60 * 1000
}
