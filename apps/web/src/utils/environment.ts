/**
 * Check if the current environment is localhost
 * This is used to control access to admin features
 */
export const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return false;
  }
  
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.')
  );
};

/**
 * Check if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Check if admin features should be accessible
 */
export const isAdminAccessible = (): boolean => {
  return isLocalhost() || isDevelopment();
};
