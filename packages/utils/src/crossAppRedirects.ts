/**
 * Cross-app redirect utilities
 * Handles redirects between different apps in the monorepo
 */

export const getWebAppUrl = (path: string = '') => {
  // In development, use localhost with different ports
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://localhost:3000${path}`;
  }
  
  // In production, use the same domain but different subdomain
  // This assumes web app is on the main domain (e.g., gnymble.com)
  // and other apps are on subdomains
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Remove subdomain if it exists (e.g., app.gnymble.com -> gnymble.com)
  const mainDomain = hostname.replace(/^[^.]+\./, '');
  
  return `${protocol}//${mainDomain}${path}`;
};

export const getUserAppUrl = (path: string = '') => {
  // In development, use localhost with different ports
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://localhost:3001${path}`;
  }
  
  // In production, use subdomain
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Remove subdomain if it exists and add user subdomain
  const mainDomain = hostname.replace(/^[^.]+\./, '');
  
  return `${protocol}//app.${mainDomain}${path}`;
};

export const getTextingAppUrl = (path: string = '') => {
  // In development, use localhost with different ports
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://localhost:3002${path}`;
  }
  
  // In production, use subdomain
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Remove subdomain if it exists and add texting subdomain
  const mainDomain = hostname.replace(/^[^.]+\./, '');
  
  return `${protocol}//texting.${mainDomain}${path}`;
};

export const getAdminAppUrl = (path: string = '') => {
  // In development, use localhost with different ports
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://localhost:3003${path}`;
  }
  
  // In production, use subdomain
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Remove subdomain if it exists and add admin subdomain
  const mainDomain = hostname.replace(/^[^.]+\./, '');
  
  return `${protocol}//admin.${mainDomain}${path}`;
};

export const redirectToWebApp = (path: string = '') => {
  window.location.href = getWebAppUrl(path);
};

export const redirectToUserApp = (path: string = '') => {
  window.location.href = getUserAppUrl(path);
};

export const redirectToTextingApp = (path: string = '') => {
  window.location.href = getTextingAppUrl(path);
};

export const redirectToAdminApp = (path: string = '') => {
  window.location.href = getAdminAppUrl(path);
};
