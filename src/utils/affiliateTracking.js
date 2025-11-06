/**
 * Affiliate Tracking Utility
 * Captures and stores affiliate codes from URL parameters
 */

const AFFILIATE_STORAGE_KEY = 'mba_affiliate_code';
const VALID_AFFILIATE_CODES = ['zerotoaihero'];

/**
 * Capture affiliate code from URL on page load
 * Stores it in sessionStorage for the duration of the session
 */
export const captureAffiliateCode = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && VALID_AFFILIATE_CODES.includes(refCode.toLowerCase())) {
      sessionStorage.setItem(AFFILIATE_STORAGE_KEY, refCode.toLowerCase());
      console.log('Affiliate code captured:', refCode);
      return refCode.toLowerCase();
    }
  } catch (error) {
    console.error('Error capturing affiliate code:', error);
  }
  return null;
};

/**
 * Get the stored affiliate code
 * @returns {string|null} The affiliate code or null if not present
 */
export const getAffiliateCode = () => {
  try {
    return sessionStorage.getItem(AFFILIATE_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting affiliate code:', error);
    return null;
  }
};

/**
 * Check if user came via affiliate link
 * @returns {boolean} True if affiliate code is present
 */
export const isAffiliateUser = () => {
  return getAffiliateCode() !== null;
};

/**
 * Clear the affiliate code from storage
 */
export const clearAffiliateCode = () => {
  try {
    sessionStorage.removeItem(AFFILIATE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing affiliate code:', error);
  }
};

