/**
 * Generates a random order ID with a prefix and timestamp
 * Format: PREFIX_TIMESTAMP_RANDOM
 */
export const generateRandomOrderId = (): string => {
  const prefix = 'ORDER';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}_${timestamp}_${random}`;
}; 