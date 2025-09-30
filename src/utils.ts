/**
 * Format match date for display
 */
export const formatMatchDate = (utcDate: string): string => {
  return new Date(utcDate).toLocaleDateString();
}